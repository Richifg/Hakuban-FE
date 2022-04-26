import { store } from '../../store/store';
import {
    setItems,
    addItem,
    deleteItems,
    setLineConnections,
    addLineConnection,
    setMaxZIndex,
    setMinZIndex,
} from '../../store/slices/itemsSlice';
import { setId, setError } from '../../store/slices/connectionSlice';
import { setMessages, addMessage } from '../../store/slices/chatSlice';
import { WSMessage } from '../../interfaces/webSocket';
import { ChatMessage, BoardItem, UpdateData } from '../../interfaces';
import { updateBoardLimits } from '../../BoardStateMachine/BoardStateMachineUtils';

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
            socket.addEventListener('message', (event) => {
                const message = JSON.parse(event.data) as WSMessage;
                switch (message.type) {
                    case 'error':
                        store.dispatch(setError(message.content));
                        reject(message.content);
                        break;

                    case 'init':
                        // separate items by type
                        const chatMessages = message.content.filter((item) => item.type === 'chat') as ChatMessage[];
                        const boardItems = message.content.filter((item) => item.type !== 'chat') as BoardItem[];
                        store.dispatch(setItems(boardItems));
                        store.dispatch(setMessages(chatMessages));
                        updateBoardLimits(undefined, Object.values(boardItems));
                        // set all line connections and find max/min zIndex
                        let [maxZIndex, minZIndex] = [-Infinity, Infinity];
                        const lineConnections: { [lineId: string]: { [point: string]: string } } = {};
                        boardItems.forEach((item) => {
                            if ('connections' in item)
                                item.connections?.forEach(([lineId, point]) => {
                                    if (!lineConnections[lineId]) lineConnections[lineId] = {};
                                    lineConnections[lineId][point] = item.id;
                                });
                            maxZIndex = Math.max(maxZIndex, item.zIndex);
                            minZIndex = Math.min(minZIndex, item.zIndex);
                        });
                        store.dispatch(setLineConnections(lineConnections));
                        store.dispatch(setMaxZIndex(maxZIndex));
                        store.dispatch(setMinZIndex(minZIndex));
                        break;

                    case 'add':
                        const item = message.content;
                        if (item.type === 'chat') store.dispatch(addMessage(item));
                        else {
                            store.dispatch(addItem({ item, blockSync: true }));
                            updateBoardLimits(item);
                            if ('connections' in item)
                                item.connections?.forEach(([lineId, point]) =>
                                    store.dispatch(addLineConnection({ lineId, point, itemId: item.id })),
                                );
                            const { zIndex } = item;
                            const { minZIndex, maxZIndex } = store.getState().items;
                            if (zIndex > maxZIndex) store.dispatch(setMaxZIndex(zIndex));
                            if (zIndex < minZIndex) store.dispatch(setMinZIndex(zIndex));
                        }
                        break;

                    case 'delete':
                        const ids = message.content;
                        store.dispatch(deleteItems({ ids, blockSync: true }));
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
            type: 'add',
            content: {
                id: 'TEMP', // #TODO decide where ids are generated
                type: 'chat',
                content: text,
                from: this.id,
                creationDate: Date.now(),
            },
        });
    }

    addItem(item: BoardItem): void {
        // clean up temporary properties on items
        const sanitizedItem = { ...item };
        delete sanitizedItem.inProgress;
        if ('text' in sanitizedItem) delete sanitizedItem.text?.skipRendering;

        this.sendMessage({
            type: 'add',
            content: sanitizedItem,
        });
    }

    updateItems(updateData: UpdateData): void {
        this.sendMessage({
            type: 'update',
            content: updateData,
        });
    }

    deleteItems(ids: string[]): void {
        this.sendMessage({
            type: 'delete',
            content: ids,
        });
    }

    sendMessage(message: WSMessage): void {
        this.socket?.send(JSON.stringify(message));
    }

    disconnect(): void {
        this.socket?.close();
        this.socket = undefined;
    }
}

const service = new WebSocketService();

export default service;
