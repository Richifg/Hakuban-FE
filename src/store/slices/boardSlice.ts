import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Action, CanvasTransform } from '../../interfaces/board';
import { getDetransformedCoordinates, getTransformedCoordinates } from '../../utils';

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
            state.canvasTransform.dX = Math.round(state.canvasTransform.dX + dX);
            state.canvasTransform.dY = Math.round(state.canvasTransform.dY + dY);
        },
        scaleCanvas: (state, action: PayloadAction<number>) => {
            const { scale } = state.canvasTransform;
            state.canvasTransform.scale = scale + action.payload;
        },
        scaleCanvasTo: (state, action: PayloadAction<[newScale: number, cursorX: number, cursorY: number]>) => {
            const [newScale, cursorX, cursorY] = action.payload;
            const { canvasTransform } = state;
            const scale = parseFloat(newScale.toFixed(2));
            // real position of cursor
            const [realX, realY] = getDetransformedCoordinates(cursorX, cursorY, canvasTransform);
            // position of cursor if canvas was using new scale
            const [newX, newY] = getTransformedCoordinates(realX, realY, { ...canvasTransform, scale });
            // how much canvas needs to be translated to maintain cursor position
            const [dX, dY] = [cursorX - newX, cursorY - newY];
            state.canvasTransform = {
                scale,
                dX: Math.round(canvasTransform.dX + dX),
                dY: Math.round(canvasTransform.dY + dY),
            };
        },
        setCanvasSize: (state, action: PayloadAction<{ width: number; height: number }>) => {
            state.canvasSize = action.payload;
        },
        setIsWriting: (state, action: PayloadAction<boolean>) => {
            state.isWriting = action.payload;
        },
    },
});

export const { setCurrentAction, setCursorPosition, translateCanvas, scaleCanvas, scaleCanvasTo, setCanvasSize, setIsWriting } =
    boardSlice.actions;

export default boardSlice.reducer;
