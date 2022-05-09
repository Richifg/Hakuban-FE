import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BoardItem, Point, UpdateData } from '../../interfaces';

interface ItemsState {
    items: { [id: string]: BoardItem };
    dragOffset: { x: number; y: number };
    selectedItemIds: string[];
    draggedItemId?: string;
    selectedPoint?: Point;
    lineConnections: { [lineId: string]: { [point: string]: string } };
    inProgress: boolean;
}

const initialState: ItemsState = {
    items: {},
    dragOffset: { x: 0, y: 0 },
    selectedItemIds: [],
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
            });
            state.selectedItemIds = state.selectedItemIds.filter((id) => !ids.includes(id));
            if (state.draggedItemId && ids.includes(state.draggedItemId)) delete state.draggedItemId;
        },
        setDragOffset: (state, action: PayloadAction<[x: number, y: number]>) => {
            const [x, y] = action.payload;
            state.dragOffset = { x, y };
        },
        setDraggedItemId: (state, action: PayloadAction<string | undefined>) => {
            state.draggedItemId = action.payload;
        },
        setSelectedItemIds: (state, action: PayloadAction<string[]>) => {
            state.selectedItemIds = action.payload;
        },
        setSelectedPoint: (state, action: PayloadAction<Point>) => {
            state.selectedPoint = action.payload;
        },
        setLineConnections: (state, action: PayloadAction<{ [id: string]: { [point: string]: string } }>) => {
            state.lineConnections = action.payload;
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
    setDragOffset,
    setDraggedItemId,
    setSelectedItemIds,
    setSelectedPoint,
    setLineConnections,
    setInProgress,
} = itemsSlice.actions;

export default itemsSlice.reducer;
