import { store } from '../store/store';
import { setItems, addItem } from '../store/slices/itemsSlice';
import { setId, setError } from '../store/slices/connectionSlice';
import { setMessages } from '../store/slices/chatSlice';
import { WSMessage } from '../interfaces/webSocket';
import { ChatMessage } from '../interfaces/items';

const url = process.env.REACT_APP_SERVER_URL;

class WebSocketService {
    id: string;
    socket?: WebSocket;
    constructor() {
        this.id = '';
    }
    connect(roomId: string, password?: string): Promise<void> {
        const fullURL = `ws://${url}?roomId=${roomId}` + (password ? `&password=${password}` : '');
        const socket = new WebSocket(fullURL);
        this.socket = socket;

        // connection with BE is now verified by the id message
        const connectionPromise = new Promise<void>((resolve, reject) => {
            socket.addEventListener('open', () => {
                console.log('ws connection openned');
            });
            socket.addEventListener('error', (event) => {
                console.log('error!', event);
                reject('unkown error');
            });
            // TODO: this component should receive a callback, and maybe app shuold initialize a websocketservice with the callback
            // and also import store and form the callback setting stuff on store.
            // also also, maybe APP APP is not the correct thingy but instead some setup function that is run and somehow setups up somenthing.... yes
            socket.addEventListener('message', (event) => {
                const message = JSON.parse(event.data) as WSMessage;
                switch (message.type) {
                    case 'error':
                        store.dispatch(setError(message.content));
                        reject(message.content);
                        break;
                    case 'item':
                        store.dispatch(addItem(message.content));
                        break;
                    case 'collection':
                        // TODO: check TypeScript Handbook to see alternative to importing and asserting the type here
                        const chatMessages = message.content.filter((item) => item.type === 'chat') as ChatMessage[];
                        const otherItems = message.content.filter((item) => item.type !== 'chat');
                        store.dispatch(setItems(otherItems));
                        store.dispatch(setMessages(chatMessages));
                        break;
                    case 'id':
                        store.dispatch(setId(message.content));
                        this.id = message.content;
                        resolve();
                        break;
                }
            });
        });

        return connectionPromise;
    }

    // TODO: remove id from the service, it should be a parameter of sendMessage
    sendMessage(text: string): void {
        const message: WSMessage = {
            type: 'item',
            content: {
                type: 'chat',
                content: text,
                from: this.id,
            },
        };
        this.socket?.send(JSON.stringify(message));
    }
    disconnect(): void {
        this.socket?.close();
        this.socket = undefined;
    }
}

const service = new WebSocketService();

export default service;
