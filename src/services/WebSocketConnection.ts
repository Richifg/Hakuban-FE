import { store } from '../store/store';
import { setItems, addItem } from '../store/slices/itemsSlice';
import { WSMessage } from '../interfaces/webSocket';

const url = process.env.REACT_APP_SERVER_URL;

class WebSocketConnection {
    id: string;
    socket?: WebSocket;
    constructor() {
        this.id = '';
    }
    connect(roomId: string, password?: string): Promise<boolean> {
        const fullURL = `${url}?roomId=${roomId}` + password ? `&password=${password}` : '';
        const socket = new WebSocket(fullURL);
        this.socket = socket;

        const connectionPromise = new Promise<boolean>((resolve, reject) => {
            socket.addEventListener('open', () => resolve(true));
            socket.addEventListener('error', (event) => {
                console.log('error!', event);
                reject(false);
            });
        });

        socket.addEventListener('error', (event) => {
            // handle other errors here
            console.log('error!', event);
        });
        socket.addEventListener('message', (event) => {
            const message = JSON.parse(event.data) as WSMessage;
            console.log('received message!', message);
            switch (message.type) {
                case 'error':
                    console.log(`Error: ${message.content}`);
                    break;
                case 'item':
                    store.dispatch(addItem(message.content));
                    break;
                case 'collection':
                    store.dispatch(setItems(message.content));
                    break;
                case 'id':
                    this.id = message.content;
                    break;
            }
        });

        return connectionPromise;
    }
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
}

const service = new WebSocketConnection();

export default service;
