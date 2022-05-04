import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BoardItem, Point, MainPoint, UpdateData } from '../../interfaces';

interface ItemsState {
    items: { [id: string]: BoardItem };
    dragOffset: { x: number; y: number };
    draggedItemId?: string;
    selectedItemId?: string;
    dragSelectedItemIds: string[];
    selectedPoint?: Point;
    lineConnections: { [lineId: string]: { [point: string]: string } };
    inProgress: boolean;
}

const initialState: ItemsState = {
    items: {},
    dragOffset: { x: 0, y: 0 },
    dragSelectedItemIds: [],
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
                if (state.selectedItemId === id) delete state.selectedItemId;
            });
            state.dragSelectedItemIds = state.dragSelectedItemIds.filter((id) => !ids.includes(id));
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
    setSelectedItemId,
    setDragSelectedItemIds,
    setSelectedPoint,
    setLineConnections,
    addLineConnection,
    removeLineConnection,
    setInProgress,
} = itemsSlice.actions;

export default itemsSlice.reducer;
