import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Shape, Item } from '../../interfaces/items';

//
// THINK ABOUT THE SEPARATION OF ITEMS (wich include chat) and the rest of the items that should be stored in thiss slice
const initShapes: Shape[] = [
    { type: 'shape', shapeType: 'rect', x: 50, y: 36, width: 38, height: 80 },
    { type: 'shape', shapeType: 'rect', x: 1, y: 41, width: 100, height: 20, strokeColor: 'blue' },
    {
        type: 'shape',
        shapeType: 'rect',
        x: 150,
        y: 80,
        width: 65,
        height: 200,
        strokeColor: 'black',
        backgroundColor: 'pink',
    },
    { type: 'shape', shapeType: 'rect', x: 10, y: 201, width: 50, height: 20, backgroundColor: 'green' },
];

interface ItemsState {
    items: Item[];
}

const initialState: ItemsState = {
    items: initShapes,
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
