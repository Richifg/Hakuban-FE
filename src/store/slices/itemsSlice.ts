import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BoardItem, Point, MainPoint, UpdateData } from '../../interfaces';
import websocket from '../../services/WebSocket/WebSocket';

interface ItemsState {
    items: { [id: string]: BoardItem };
    dataToSync: { [key: string]: BoardItem | UpdateData };
    dragOffset: { x: number; y: number };
    draggedItemId?: string;
    selectedItemId?: string;
    dragSelectedItemIds: string[];
    selectedPoint?: Point;
    lineConnections: { [lineId: string]: { [point: string]: string } };
    inProgress: boolean;
}

const initialState: ItemsState = {
    items: {},
    dataToSync: {},
    dragOffset: { x: 0, y: 0 },
    dragSelectedItemIds: [],
    lineConnections: {},
    inProgress: false,
};

const itemsSlice = createSlice({
    name: 'items',
    initialState,
    reducers: {
        setItems: (state, action: PayloadAction<BoardItem[]>) => {
            action.payload.forEach((item) => (state.items[item.id] = item));
        },
        addItems: (state, action: PayloadAction<BoardItem[]>) => {
            action.payload.forEach((item) => {
                state.items[item.id] = item;
            });
        },
        updateItem: (state, action: PayloadAction<UpdateData>) => {
            const { id, ...data } = action.payload;
            const oldItem = state.items[id];
            if (oldItem) state.items[id] = { ...oldItem, ...data };
        },
        deleteItems: (state, action: PayloadAction<string[]>) => {
            const ids = action.payload;
            ids.forEach((id) => {
                delete state.items[id];
                if (state.selectedItemId === id) delete state.selectedItemId;
            });
            state.dragSelectedItemIds = state.dragSelectedItemIds.filter((id) => !ids.includes(id));
        },
        addSyncData: (state, action: PayloadAction<(BoardItem | UpdateData)[]>) => {
            action.payload.forEach((newData) => {
                const { id } = newData;
                const oldData = state.dataToSync[id];
                // full items replace whatever was stored for sync
                if (newData.creationDate || !oldData) state.dataToSync[id] = newData;
                // updateData updates existing sync data
                else state.dataToSync[id] = { ...oldData, ...newData };
            });
        },
        syncData: (state) => {
            const items: BoardItem[] = [];
            const updates: UpdateData[] = [];
            // first send new items and then updates
            Object.values(state.dataToSync).forEach((data) => {
                if (data.creationDate) items.push(data as BoardItem);
                else updates.push(data);
            });
            items.length && websocket.addItems(items);
            updates.length && websocket.updateItems(updates);
            state.dataToSync = {};
        },
        setDragOffset: (state, action: PayloadAction<[x: number, y: number]>) => {
            const [x, y] = action.payload;
            state.dragOffset = { x, y };
        },
        setDraggedItemId: (state, action: PayloadAction<string | undefined>) => {
            state.draggedItemId = action.payload;
            if (state.dragSelectedItemIds) state.dragSelectedItemIds = [];
        },
        setSelectedItemId: (state, action: PayloadAction<string | undefined>) => {
            state.selectedItemId = action.payload;
            if (state.dragSelectedItemIds) state.dragSelectedItemIds = [];
        },
        setDragSelectedItemIds: (state, action: PayloadAction<string[] | undefined>) => {
            const ids = action.payload || [];
            state.dragSelectedItemIds = ids;
            state.draggedItemId = undefined;
            state.selectedItemId = undefined;
        },
        setSelectedPoint: (state, action: PayloadAction<Point>) => {
            state.selectedPoint = action.payload;
        },
        setLineConnections: (state, action: PayloadAction<{ [id: string]: { [point: string]: string } }>) => {
            state.lineConnections = action.payload;
        },
        addLineConnection: (state, action: PayloadAction<{ lineId: string; itemId: string; point: MainPoint }>) => {
            const { lineId, point, itemId } = action.payload;
            if (state.lineConnections[lineId] === undefined) state.lineConnections[lineId] = {};
            state.lineConnections[lineId][point] = itemId;
        },
        removeLineConnection: (state, action: PayloadAction<{ lineId: string; point: MainPoint }>) => {
            const { lineId, point } = action.payload;
            if (state.lineConnections[lineId] !== undefined) {
                delete state.lineConnections[lineId][point];
                if (Object.values(state.lineConnections[lineId]).length === 0) delete state.lineConnections[lineId];
            }
        },
        setInProgress: (state, action: PayloadAction<boolean>) => {
            state.inProgress = action.payload;
        },
    },
});

export const {
    setItems,
    addItems,
    updateItem,
    deleteItems,
    addSyncData,
    syncData,
    setDragOffset,
    setDraggedItemId,
    setSelectedItemId,
    setDragSelectedItemIds,
    setSelectedPoint,
    setLineConnections,
    addLineConnection,
    removeLineConnection,
    setInProgress,
} = itemsSlice.actions;

export default itemsSlice.reducer;
