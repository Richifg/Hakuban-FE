import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Point } from '../../interfaces/board';

type Tool = 'POINTER' | 'SHAPE' | 'PEN';
type Action = 'IDLE' | 'DRAW' | 'DRAG' | 'EDIT' | 'PAN' | 'SLIDE';

interface BoardState {
    selectedTool: Tool;
    currentAction: Action;
    cursorMovement: { x: number; y: number };
    canvasSize: { width: number; height: number };
    selectedItem?: string;
    selectedPoint?: Point;
}

const initialState: BoardState = {
    selectedTool: 'POINTER',
    currentAction: 'IDLE',
    cursorMovement: { x: 0, y: 0 },
    canvasSize: { width: 0, height: 0 },
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
        setCursorMovement: (state, action: PayloadAction<{ x: number; y: number }>) => {
            state.cursorMovement = action.payload;
        },
        setCanvasSize: (state, action: PayloadAction<{ width: number; height: number }>) => {
            state.canvasSize = action.payload;
        },
        setSelectedItem: (state, action: PayloadAction<string>) => {
            state.selectedItem = action.payload;
        },
        setSelectedPoint: (state, action: PayloadAction<Point>) => {
            state.selectedPoint = action.payload;
        },
    },
});

export const {
    setSelectedTool,
    setCurrentAction,
    setCursorMovement,
    setCanvasSize,
    setSelectedItem,
    setSelectedPoint,
} = boardSlice.actions;

export default boardSlice.reducer;
