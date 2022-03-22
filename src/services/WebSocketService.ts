import { store } from '../store/store';
import { setItems, addItem, setLineConnections, addLineConnection } from '../store/slices/itemsSlice';
import { setId, setError } from '../store/slices/connectionSlice';
import { setMessages, addMessage } from '../store/slices/chatSlice';
import { WSMessage } from '../interfaces/webSocket';
import { ChatMessage, BoardItem } from '../interfaces/items';
import { setBoardLimits } from '../store/slices/boardSlice';
import { getUpdatedBoardLimits } from '../utils';

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
                        if (message.content.type === 'chat') store.dispatch(addMessage(message.content));
                        else {
                            const item = message.content;
                            store.dispatch(addItem(item));
                            store.dispatch(setBoardLimits(getUpdatedBoardLimits(item)));
                            if ('connections' in item)
                                item.connections?.forEach(([lineId, point]) =>
                                    store.dispatch(addLineConnection([lineId, point, item.id])),
                                );
                        }
                        break;
                    case 'collection':
                        // separate items by type
                        const chatMessages = message.content.filter((item) => item.type === 'chat') as ChatMessage[];
                        const boardItems = message.content.filter((item) => item.type !== 'chat') as BoardItem[];
                        store.dispatch(setItems(boardItems));
                        store.dispatch(setMessages(chatMessages));
                        store.dispatch(setBoardLimits(getUpdatedBoardLimits(undefined, Object.values(boardItems))));
                        // set all line connections
                        const lineConnections: { [lineId: string]: { [point: string]: string } } = {};
                        boardItems.forEach((item) => {
                            if ('connections' in item)
                                item.connections?.forEach(([lineId, point]) => {
                                    if (!lineConnections[lineId]) lineConnections[lineId] = {};
                                    lineConnections[lineId][point] = item.id;
                                });
                        });
                        store.dispatch(setLineConnections(lineConnections));
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
    // what does this comment even mean?
    sendMessage(text: string): void {
        const message: WSMessage = {
            type: 'item',
            content: {
                id: 'TEMP', // #TODO decide if ids where generated
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
