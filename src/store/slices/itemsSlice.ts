import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { BoardItem, Point } from '../../interfaces/items';

interface ItemsState {
    items: { [id: string]: BoardItem };
    dragOffset: { x: number; y: number };
    selectedItem?: BoardItem;
    selectedPoint?: Point;
}

const initialState: ItemsState = {
    items: {},
    dragOffset: { x: 0, y: 0 },
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
            // check for duplicates before adding
            state.items[newItem.id] = newItem;
            state.selectedItem = newItem;
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
    },
});

export const { setItems, addItem, deleteItem, setDragOffset, setSelectedItem, setSelectedPoint } = itemsSlice.actions;

export default itemsSlice.reducer;
