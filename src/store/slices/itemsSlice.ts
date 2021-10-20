import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Item } from '../../interfaces/items';

interface ItemsState {
    items: Item[];
}

const initialState: ItemsState = {
    items: [],
};

const itemsSlice = createSlice({
    name: 'items',
    initialState,
    reducers: {
        setItems: (state, action: PayloadAction<Item[]>) => {
            state.items = action.payload;
        },
        addItem: (state, action: PayloadAction<Item>) => {
            const newItem = action.payload;
            const index = state.items.findIndex((item) => item.id === newItem.id);
            if (index) state.items[index] = newItem;
            else state.items.push(newItem);
        },
        deleteItem: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter((item) => item.id !== action.payload);
        },
    },
});

export const { setItems, addItem, deleteItem } = itemsSlice.actions;

export default itemsSlice.reducer;
