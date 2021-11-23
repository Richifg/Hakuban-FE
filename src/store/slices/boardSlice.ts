import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Tool, Action, CanvasTransform } from '../../interfaces/board';

interface BoardState {
    selectedTool: Tool;
    currentAction: Action;
    cursorPosition: { x: number; y: number };
    canvasTransform: CanvasTransform;
    lastTranslate: { dX: number; dY: number };
    canvasSize: { width: number; height: number };
}

const initialState: BoardState = {
    selectedTool: 'POINTER',
    currentAction: 'IDLE',
    cursorPosition: { x: 0, y: 0 },
    canvasTransform: { dX: 0, dY: 0, scale: 1 },
    lastTranslate: { dX: 0, dY: 0 },
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
        setCursorPosition: (state, action: PayloadAction<[x: number, y: number]>) => {
            const [x, y] = action.payload;
            state.cursorPosition = { x, y };
        },
        translateCanvas: (state, action: PayloadAction<[dX: number, dY: number]>) => {
            const [dX, dY] = action.payload;
            state.lastTranslate = { dX, dY };
            state.canvasTransform = {
                ...state.canvasTransform,
                dX: state.canvasTransform.dX + dX,
                dY: state.canvasTransform.dY + dY,
            };
        },
        scaleCanvas: (state, action: PayloadAction<number>) => {
            const { canvasTransform } = state;
            state.canvasTransform = {
                ...canvasTransform,
                scale: canvasTransform.scale + action.payload,
            };
        },
        setCanvasSize: (state, action: PayloadAction<{ width: number; height: number }>) => {
            state.canvasSize = action.payload;
        },
    },
});

export const { setSelectedTool, setCurrentAction, setCursorPosition, translateCanvas, scaleCanvas, setCanvasSize } =
    boardSlice.actions;

export default boardSlice.reducer;
