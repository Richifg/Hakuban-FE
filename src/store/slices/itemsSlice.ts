import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { BoardItem, Point, MainPoint } from '../../interfaces/items';

interface ItemsState {
    items: { [id: string]: BoardItem };
    dragOffset: { x: number; y: number };
    draggedItem?: BoardItem;
    selectedItem?: BoardItem;
    selectedPoint?: Point;
    lineConnections: { [id: string]: { [point: string]: string } };
    maxZIndex: number;
    minZIndex: number;
}

const initialState: ItemsState = {
    items: {},
    dragOffset: { x: 0, y: 0 },
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
        addItem: (state, action: PayloadAction<BoardItem>) => {
            const newItem = action.payload;
            state.items[newItem.id] = newItem;
            if (state.selectedItem?.id === newItem.id) state.selectedItem = newItem;
        },
        updateItem: (state, action: PayloadAction<{ id: string | undefined; key: string; value: string | number | boolean }>) => {
            const { id, key, value } = action.payload;
            if (id) {
                const oldItem = state.items[id];
                if (key in oldItem) {
                    const newItem = { ...oldItem, [key]: value };
                    state.items[id] = newItem;
                    if (state.selectedItem?.id === newItem.id) state.selectedItem = newItem;
                }
            }
        },
        deleteItem: (state, action: PayloadAction<string>) => {
            delete state.items[action.payload];
        },
        setDragOffset: (state, action: PayloadAction<[x: number, y: number]>) => {
            const [x, y] = action.payload;
            state.dragOffset = { x, y };
        },
        setDraggedItem: (state, action: PayloadAction<BoardItem | undefined>) => {
            state.draggedItem = action.payload;
        },
        setSelectedItem: (state, action: PayloadAction<BoardItem | undefined>) => {
            state.selectedItem = action.payload;
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
            state.maxZIndex = action.payload;
        },
        setMinZIndex: (state, action: PayloadAction<number>) => {
            state.minZIndex = action.payload;
        },
    },
});

export const {
    setItems,
    addItem,
    updateItem,
    deleteItem,
    setDragOffset,
    setDraggedItem,
    setSelectedItem,
    setSelectedPoint,
    setLineConnections,
    addLineConnection,
    removeLineConnection,
    setMaxZIndex,
    setMinZIndex,
} = itemsSlice.actions;

export default itemsSlice.reducer;
