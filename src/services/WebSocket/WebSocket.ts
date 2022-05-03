import { store } from '../../store/store';
import { setId, setError } from '../../store/slices/connectionSlice';
import { addMessage } from '../../store/slices/chatSlice';
import { BoardItem, UpdateData, WSMessage } from '../../interfaces';
import { getSanitizedData } from '../../utils';
import { processItemDeletions, processItemUpdates } from '../../BoardStateMachine/BoardStateMachineUtils';

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

        // connection with BE is now verified by the id message <------ WHAT? it is not!
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
            // also also, maybe APP APP is not the correct thingy but instead some setup function that is run and somehow setups up somenthing.... yes... what?
            // do somenthing about this comment or just erase it >_<

            socket.addEventListener('message', (event) => {
                const message = JSON.parse(event.data) as WSMessage;
                switch (message.type) {
                    case 'error':
                        store.dispatch(setError(message.content));
                        reject(message.content);
                        break;

                    case 'add':
                        const items = message.content;
                        processItemUpdates(items, true);
                        break;

                    case 'update':
                        const updateData = message.content;
                        processItemUpdates(updateData, true);
                        break;

                    case 'delete':
                        const ids = message.content;
                        processItemDeletions(ids);
                        break;

                    case 'chat':
                        const chatMessage = message.content;
                        store.dispatch(addMessage(chatMessage));
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

    // TODO: figure out creation date/ id
    addChatMessage(text: string): void {
        this.sendMessage({
            type: 'chat',
            content: {
                id: 'TEMP', // #TODO decide where ids are generated
                type: 'chat',
                content: text,
                from: this.id,
                creationDate: Date.now(),
            },
        });
    }

    addItems(items: BoardItem[]): void {
        this.sendMessage({
            type: 'add',
            content: getSanitizedData(items),
        });
    }

    updateItems(updateData: UpdateData[]): void {
        this.sendMessage({
            type: 'update',
            content: getSanitizedData(updateData),
        });
    }

    deleteItems(ids: string[]): void {
        this.sendMessage({
            type: 'delete',
            content: ids,
        });
    }

    sendMessage(message: WSMessage): void {
        // console.log(message.type, message.content);
        // this.socket?.send(JSON.stringify(message));
    }

    disconnect(): void {
        this.socket?.close();
        this.socket = undefined;
    }
}

const service = new WebSocketService();

export default service;
