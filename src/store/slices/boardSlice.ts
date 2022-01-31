import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Action, CanvasTransform } from '../../interfaces/board';

interface BoardState {
    currentAction: Action;
    cursorPosition: { x: number; y: number };
    canvasTransform: CanvasTransform;
    lastTranslate: { dX: number; dY: number };
    canvasSize: { width: number; height: number };
    isWriting: boolean;
}

const initialState: BoardState = {
    currentAction: 'IDLE',
    cursorPosition: { x: 0, y: 0 },
    canvasTransform: { dX: 0, dY: 0, scale: 1 },
    lastTranslate: { dX: 0, dY: 0 },
    canvasSize: { width: 0, height: 0 },
    isWriting: false,
};

export const boardSlice = createSlice({
    name: 'board',
    initialState,
    reducers: {
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
                dX: Math.round(state.canvasTransform.dX + dX),
                dY: Math.round(state.canvasTransform.dY + dY),
            };
        },
        translateCanvasTo: (state, action: PayloadAction<[dX: number, dY: number]>) => {
            const [dX, dY] = action.payload;
            state.lastTranslate = state.canvasTransform;
            state.canvasTransform = { ...state.canvasTransform, dX, dY };
        },
        scaleCanvas: (state, action: PayloadAction<number>) => {
            const { canvasTransform } = state;
            state.canvasTransform = {
                ...canvasTransform,
                scale: canvasTransform.scale + action.payload,
            };
        },
        scaleCanvasTo: (state, action: PayloadAction<number>) => {
            const { canvasTransform } = state;
            const scale = parseFloat(action.payload.toFixed(2));
            state.canvasTransform = { ...canvasTransform, scale };
        },
        setCanvasSize: (state, action: PayloadAction<{ width: number; height: number }>) => {
            state.canvasSize = action.payload;
        },
        setIsWriting: (state, action: PayloadAction<boolean>) => {
            state.isWriting = action.payload;
        },
    },
});

export const {
    setCurrentAction,
    setCursorPosition,
    translateCanvas,
    translateCanvasTo,
    scaleCanvas,
    scaleCanvasTo,
    setCanvasSize,
    setIsWriting,
} = boardSlice.actions;

export default boardSlice.reducer;
