import { store } from '../../store/store';
import { setUserId, setError } from '../../store/slices/connectionSlice';
import { addMessage, setMessages } from '../../store/slices/chatSlice';
import { BoardItem, UpdateData, WSMessage, LockData, User, ChatMessage } from '../../interfaces';
import { processItemDeletions, processItemLocks, processItemUpdates } from '../../BoardStateMachine/BoardStateMachineUtils';
import { addUsers, removeUser, setOwnUser, setIsLoading } from '../../store/slices/usersSlice';
import { getSanitizedData, getDefaultUser, getNewId } from '../../utils';

const url = process.env.REACT_APP_SERVER_URL;
const protocol = process.env.NODE_ENV === 'production' ? 'wss' : 'ws';
const fullUrl = `${protocol}://${url}`;

class WebSocketService {
    id: string;
    socket?: WebSocket;
    constructor() {
        this.id = '';
    }
    connect(roomId: string, password?: string): Promise<void> {
        // disconnect before attempting a new connection
        if (this.socket) this.disconnect();

        const fullURL = `${fullUrl}?roomId=${roomId}` + (password ? `&password=${password}` : '');
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
                // only process broadcasts from other users except for
                // own locks which need to be confirmed before data can be synced
                // own chats which are only displayed until broacasted by BE
                // own user updates which need to be confirmed before display
                if (userId !== this.id || ['lock', 'chat', 'user'].includes(type)) {
                    switch (type) {
                        case 'init':
                            const { items, ownId, users } = message.content;
                            this.id = ownId;
                            store.dispatch(setUserId(ownId));
                            store.dispatch(setOwnUser(getDefaultUser(ownId)));
                            store.dispatch(addUsers(users));
                            // separate items in chat and boardItems
                            const boardItems = items.filter((item) => item.type !== 'chat') as BoardItem[];
                            processItemUpdates(boardItems, true);
                            const chatItems = items.filter((item) => item.type === 'chat') as ChatMessage[];
                            store.dispatch(setMessages(chatItems));
                            // let promise know connection to room was successfull
                            resolve();
                            break;

                        case 'error':
                            store.dispatch(setError(message.content));
                            reject(message.content);
                            break;

                        case 'add':
                            const newItems = message.content;
                            processItemUpdates(newItems, true);
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
                            console.log('aint getting nothing');
                            const chatMessage = message.content;
                            store.dispatch(addMessage(chatMessage));
                            break;

                        case 'lock':
                            const lockData = message.content;
                            processItemLocks(lockData, userId);
                            break;

                        case 'user':
                            if (message.content.userAction === 'leave') store.dispatch(removeUser(message.content.id));
                            else store.dispatch(addUsers([message.content.user]));
                            break;
                    }
                }
            });
        });

        return connectionPromise;
    }

    addChatMessage(text: string): void {
        this.sendMessage({
            userId: this.id,
            type: 'chat',
            content: {
                id: getNewId(),
                type: 'chat',
                content: text,
                fromUsername: store.getState().users.ownUser?.username || '',
                fromId: this.id,
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

    updateUser(user: User): void {
        store.dispatch(setIsLoading(true));
        this.sendMessage({
            userId: this.id,
            type: 'user',
            content: { userAction: 'update', user },
        });
    }

    sendMessage(message: WSMessage): void {
        // TODO: add try hard here
        this.socket?.send(JSON.stringify(message));
    }

    disconnect(): void {
        this.socket?.close();
        this.socket = undefined;
    }
}

const service = new WebSocketService();

export default service;
