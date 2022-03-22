import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { BoardItem, Point } from '../../interfaces/items';

interface ItemsState {
    items: { [id: string]: BoardItem };
    dragOffset: { x: number; y: number };
    selectedItem?: BoardItem;
    selectedPoint?: Point;
    lineConnectionCount: { [id: string]: number };
}

const initialState: ItemsState = {
    items: {},
    dragOffset: { x: 0, y: 0 },
    lineConnectionCount: {},
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
        updateItem: (state, action: PayloadAction<{ id: string; value: string | number | boolean; key: string }>) => {
            const { id, value, key } = action.payload;
            const oldItem = state.items[id];
            if (key in oldItem) {
                const newItem = { ...oldItem, [key]: value };
                state.items[id] = { ...oldItem, [key]: value };
                if (state.selectedItem?.id === newItem.id) state.selectedItem = newItem;
            }
        },
        deleteItem: (state, action: PayloadAction<string>) => {
            delete state.items[action.payload];
        },
        setDragOffset: (state, action: PayloadAction<[x: number, y: number]>) => {
            const [x, y] = action.payload;
            state.dragOffset = { x, y };
        },
        setSelectedItem: (state, action: PayloadAction<BoardItem | undefined>) => {
            state.selectedItem = action.payload;
        },
        setSelectedPoint: (state, action: PayloadAction<Point>) => {
            state.selectedPoint = action.payload;
        },
        setLineConnections: (state, action: PayloadAction<{ [id: string]: number }>) => {
            state.lineConnectionCount = action.payload;
        },
        increaseLineConnections: (state, action: PayloadAction<string>) => {
            const id = action.payload;
            if (state.lineConnectionCount[id] === undefined) state.lineConnectionCount[id] = 1;
            else state.lineConnectionCount[id] += 1;
        },
        decreaseLineConnections: (state, action: PayloadAction<string>) => {
            const id = action.payload;
            if (state.lineConnectionCount[id] === undefined) state.lineConnectionCount[id] = 0;
            else state.lineConnectionCount[id] -= 1;
        },
    },
});

export const {
    setItems,
    addItem,
    updateItem,
    deleteItem,
    setDragOffset,
    setSelectedItem,
    setSelectedPoint,
    setLineConnections,
    increaseLineConnections,
    decreaseLineConnections,
} = itemsSlice.actions;

export default itemsSlice.reducer;
