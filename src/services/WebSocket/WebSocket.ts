import { store } from '../../store/store';
import { setUserId, setError } from '../../store/slices/connectionSlice';
import { addMessage } from '../../store/slices/chatSlice';
import { BoardItem, UpdateData, WSMessage, LockData } from '../../interfaces';
import { processItemDeletions, processItemLocks, processItemUpdates } from '../../BoardStateMachine/BoardStateMachineUtils';
import { addUsers, removeUser, setOwnUser } from '../../store/slices/usersSlice';
import { getSanitizedData, getDefaultUser } from '../../utils';

const url = process.env.REACT_APP_SERVER_URL;

class WebSocketService {
    id: string;
    socket?: WebSocket;
    constructor() {
        this.id = '';
    }
    connect(roomId: string, password?: string): Promise<void> {
        // disconnect before attempting a new connection
        if (this.socket) this.disconnect();
        const fullURL = `ws://${url}?roomId=${roomId}` + (password ? `&password=${password}` : '');
        const socket = new WebSocket(fullURL);
        this.socket = socket;
        const connectionPromise = new Promise<void>((resolve, reject) => {
            socket.addEventListener('open', () => {
                console.log('ws connection openned');
            });
            socket.addEventListener('error', (event) => {
                console.log('error!', event);
                reject('Service connection error');
            });

            socket.addEventListener('message', (event) => {
                const message = JSON.parse(event.data) as WSMessage;
                const { type, userId } = message;
                // only process broadcasts from other user or of type lock
                // own locks need to be confirmed before data can be synced
                console.log(`R:${type}`, message.content);
                if (userId !== this.id || type === 'lock') {
                    switch (type) {
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
                            processItemDeletions(ids, true);
                            break;

                        case 'chat':
                            const chatMessage = message.content;
                            store.dispatch(addMessage(chatMessage));
                            break;

                        case 'lock':
                            const lockData = message.content;
                            processItemLocks(lockData, userId);
                            break;

                        case 'user':
                            if (message.content.userAction === 'leave') store.dispatch(removeUser(message.content.id));
                            else store.dispatch(addUsers(message.content.users));
                            break;

                        case 'id':
                            this.id = message.content;
                            store.dispatch(setUserId(message.content));
                            store.dispatch(setOwnUser(getDefaultUser(this.id)));
                            // resolve promise to indicate successfull connect
                            resolve();
                            break;
                    }
                }
            });
        });

        return connectionPromise;
    }

    // TODO: figure out creation date/ id TODO TODO
    addChatMessage(text: string): void {
        this.sendMessage({
            userId: this.id,
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
            userId: this.id,
            type: 'add',
            content: getSanitizedData(items),
        });
    }

    updateItems(updateData: UpdateData[]): void {
        this.sendMessage({
            userId: this.id,
            type: 'update',
            content: getSanitizedData(updateData),
        });
    }

    deleteItems(ids: string[]): void {
        this.sendMessage({
            userId: this.id,
            type: 'delete',
            content: ids,
        });
    }

    lockItems(lockData: LockData): void {
        this.sendMessage({
            userId: this.id,
            type: 'lock',
            content: lockData,
        });
    }

    sendMessage(message: WSMessage): void {
        console.log(message.type, message.content);
        this.socket?.send(JSON.stringify(message));
    }

    disconnect(): void {
        this.socket?.close();
        this.socket = undefined;
    }
}

const service = new WebSocketService();

export default service;
