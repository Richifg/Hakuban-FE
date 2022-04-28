import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BoardItem, Point, MainPoint, UpdateData } from '../../interfaces';
import websocket from '../../services/WebSocket/WebSocket';
import { areKeysValid } from '../../utils';

interface ItemsState {
    items: { [id: string]: BoardItem };
    dragOffset: { x: number; y: number };
    draggedItemId?: string;
    selectedItemId?: string;
    dragSelectedItemIds: string[];
    selectedPoint?: Point;
    lineConnections: { [lineId: string]: { [point: string]: string } };
    maxZIndex: number;
    minZIndex: number;
}

const initialState: ItemsState = {
    items: {},
    dragOffset: { x: 0, y: 0 },
    dragSelectedItemIds: [],
    lineConnections: {},
    maxZIndex: -Infinity,
    minZIndex: Infinity,
};

const itemsSlice = createSlice({
    name: 'items',
    initialState,
    reducers: {
        setItems: (state, action: PayloadAction<BoardItem[]>) => {
            action.payload.forEach((item) => (state.items[item.id] = item));
        },
        addItem: (state, action: PayloadAction<{ item: BoardItem; blockSync?: boolean } | BoardItem>) => {
            const { item, blockSync } = 'item' in action.payload ? action.payload : { item: action.payload, blockSync: false };
            state.items[item.id] = item;
            if (!item.isNew && !blockSync) websocket.addItem(item);
        },
        updateItems: (state, action: PayloadAction<{ updateData: UpdateData[]; blockSync?: boolean } | UpdateData[]>) => {
            const { updateData, blockSync } =
                'updateData' in action.payload ? action.payload : { updateData: action.payload, blockSync: false };
            const cleanUpdateData: UpdateData[] = [];
            updateData.forEach(({ id, ...data }) => {
                const oldItem = state.items[id];
                let error = false;
                if (areKeysValid(Object.keys(data), oldItem)) state.items[id] = { ...oldItem, ...data };
                else error = true;
                if (!error && !state.items[id].inProgress) {
                    cleanUpdateData.push({ id, ...data });
                }
                if (error) console.log('something is wrong', data, id);
            });
            if (!blockSync && cleanUpdateData.length) websocket.updateItems(cleanUpdateData);
        },
        deleteItems: (state, action: PayloadAction<{ ids: string[]; blockSync: boolean } | string[]>) => {
            const { ids, blockSync } = 'ids' in action.payload ? action.payload : { ids: action.payload, blockSync: false };
            ids.forEach((id) => delete state.items[id]);
            delete state.selectedItemId;
            state.dragSelectedItemIds = [];
            if (!blockSync) websocket.deleteItems(ids);
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
        setMaxZIndex: (state, action: PayloadAction<number>) => {
            const zIndex = action.payload;
            if (zIndex > state.maxZIndex) state.maxZIndex = zIndex;
        },
        setMinZIndex: (state, action: PayloadAction<number>) => {
            const zIndex = action.payload;
            if (zIndex < state.minZIndex) state.minZIndex = zIndex;
        },
    },
});

export const {
    setItems,
    addItem,
    updateItems,
    deleteItems,
    setDragOffset,
    setDraggedItemId,
    setSelectedItemId,
    setDragSelectedItemIds,
    setSelectedPoint,
    setLineConnections,
    addLineConnection,
    removeLineConnection,
    setMaxZIndex,
    setMinZIndex,
} = itemsSlice.actions;

export default itemsSlice.reducer;
