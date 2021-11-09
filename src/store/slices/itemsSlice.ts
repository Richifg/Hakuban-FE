import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Item } from '../../interfaces/items';

interface ItemsState {
    items: Item[];
    userItems: Item[];
}

const initialState: ItemsState = {
    items: [],
    userItems: [
        {
            type: 'shape',
            shapeType: 'rect',
            x: 500,
            y: 100,
            width: 20,
            height: 300,
            strokeColor: 'green',
        },
    ],
};

const itemsSlice = createSlice({
    name: 'items',
    initialState,
    reducers: {
        setItems: (state, action: PayloadAction<Item[]>) => {
            state.items = action.payload;
        },
        setUserItems: (state, action: PayloadAction<Item[]>) => {
            state.userItems = action.payload;
        },
        addItem: (state, action: PayloadAction<Item>) => {
            const newItem = action.payload;
            // check for duplicates before adding
            const index = state.items.findIndex((item) => item.id === newItem.id);
            if (index) state.items[index] = newItem;
            else state.items.push(newItem);
            // also delete duplicates on userItems
            const userIndex = state.userItems.findIndex((item) => item.id === newItem.id);
            if (userIndex) state.userItems.splice(userIndex, 1);
        },
        addUserItem(state, action: PayloadAction<Item>) {
            // check for duplicates before adding
            const newItem = action.payload;
            const index = state.items.findIndex((item) => item.id === newItem.id);
            if (index) state.items[index] = newItem;
            else state.items.push(newItem);
        },
        deleteItem: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter((item) => item.id !== action.payload);
            state.userItems = state.items.filter((item) => item.id !== action.payload);
        },
    },
});

export const { setItems, addItem, addUserItem, deleteItem } = itemsSlice.actions;

export default itemsSlice.reducer;
