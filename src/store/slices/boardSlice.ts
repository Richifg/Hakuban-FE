import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Point } from '../../interfaces/board';

type Tool = 'POINTER' | 'SHAPE' | 'PEN';
type Action = 'IDLE' | 'DRAW' | 'DRAG' | 'EDIT' | 'PAN' | 'SLIDE';

interface BoardState {
    selectedTool: Tool;
    currentAction: Action;
    selectedItem?: string;
    selectedPoint?: Point;
}

const initialState: BoardState = {
    selectedTool: 'POINTER',
    currentAction: 'IDLE',
};

export const boardSlice = createSlice({
    name: 'board',
    initialState,
    reducers: {
        setSelectedTool: (state, action: PayloadAction<Tool>) => {
            state.selectedTool = action.payload;
        },
        setCurrentAction: (state, action: PayloadAction<Action>) => {
            state.currentAction = action.payload;
        },
        setSelectedItem: (state, action: PayloadAction<string>) => {
            state.selectedItem = action.payload;
        },
        setSelectedPoint: (state, action: PayloadAction<Point>) => {
            state.selectedPoint = action.payload;
        },
    },
});

export const { setSelectedTool, setCurrentAction, setSelectedItem, setSelectedPoint } = boardSlice.actions;

export default boardSlice.reducer;
