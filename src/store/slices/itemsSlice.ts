import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { BoardItem, Point } from '../../interfaces/items';

const defaultItem: BoardItem = {
    type: 'shape',
    shapeType: 'rect',
    x0: 0,
    y0: 0,
    x2: 0,
    y2: 0,
    lineColor: 'black',
};

interface ItemsState {
    items: BoardItem[];
    userItems: BoardItem[];
    defaultItem: BoardItem;
    dragOffset: { x: number; y: number };
    selectedItem?: BoardItem;
    selectedPoint?: Point;
}

const initialState: ItemsState = {
    items: [],
    userItems: [],
    defaultItem,
    dragOffset: { x: 0, y: 0 },
};

const itemsSlice = createSlice({
    name: 'items',
    initialState,
    reducers: {
        setItems: (state, action: PayloadAction<BoardItem[]>) => {
            state.items = action.payload;
        },
        setUserItems: (state, action: PayloadAction<BoardItem[]>) => {
            state.userItems = action.payload;
        },
        addItem: (state, action: PayloadAction<BoardItem>) => {
            const newItem = action.payload;
            // check for duplicates before adding
            const index = state.items.findIndex((item) => item.id === newItem.id);
            if (index !== -1) state.items[index] = newItem;
            else state.items.push(newItem);
            // also delete duplicates on userItems
            const userIndex = state.userItems.findIndex((item) => item.id === newItem.id);
            if (userIndex) state.userItems.splice(userIndex, 1);
        },
        addUserItem(state, action: PayloadAction<BoardItem>) {
            // check for duplicates before adding
            const newItem = action.payload;
            const index = state.userItems.findIndex((item) => item.id === newItem.id);
            if (index !== -1) state.userItems[index] = newItem;
            else state.userItems.push(newItem);
            // also delete duplicates on regular items
            const regularIndex = state.userItems.findIndex((item) => item.id === newItem.id);
            if (regularIndex) state.items.splice(regularIndex, 1);
            // updated selected item
            state.selectedItem = newItem;
        },
        deleteItem: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter((item) => item.id !== action.payload);
            state.userItems = state.items.filter((item) => item.id !== action.payload);
        },
        setDefaultItem: (state, action: PayloadAction<BoardItem>) => {
            state.defaultItem = action.payload;
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

export const { setItems, addItem, addUserItem, deleteItem, setDefaultItem, setDragOffset, setSelectedItem, setSelectedPoint } =
    itemsSlice.actions;

export default itemsSlice.reducer;
