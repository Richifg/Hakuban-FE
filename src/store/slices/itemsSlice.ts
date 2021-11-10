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
    selectedItem?: BoardItem;
    selectedPoint?: Point;
    defaultItem: BoardItem;
}

const initialState: ItemsState = {
    items: [],
    userItems: [],
    defaultItem,
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
            console.log('tried to add a new one, this is the index', index);
            if (index !== -1) state.userItems[index] = newItem;
            else {
                console.log('im on the else, what da hell is jhappening?', state.userItems);
                state.userItems.push(newItem);
                console.log('well?', state.userItems);
            }
        },
        deleteItem: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter((item) => item.id !== action.payload);
            state.userItems = state.items.filter((item) => item.id !== action.payload);
        },
        setSelectedItem: (state, action: PayloadAction<BoardItem | undefined>) => {
            state.selectedItem = action.payload;
        },
        setSelectedPoint: (state, action: PayloadAction<Point>) => {
            state.selectedPoint = action.payload;
        },
        setDefaultItem: (state, action: PayloadAction<BoardItem>) => {
            state.defaultItem = action.payload;
        },
    },
});

export const { setItems, addItem, addUserItem, deleteItem, setSelectedItem, setSelectedPoint, setDefaultItem } =
    itemsSlice.actions;

export default itemsSlice.reducer;
