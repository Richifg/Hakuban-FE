import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Action, CanvasTransform, BoardItem } from '../../interfaces';
import { getItemMaxCoordinates } from '../../utils';

const BOARD_PADDING = 200; //px

interface BoardState {
    currentAction: Action;
    cursorPosition: { x: number; y: number };
    canvasTransform: CanvasTransform;
    lastTranslate: { dX: number; dY: number };
    canvasSize: { width: number; height: number };
    boardLimits: { top: number; right: number; bottom: number; left: number };
    isWriting: boolean;
}

const initialState: BoardState = {
    currentAction: 'IDLE',
    cursorPosition: { x: 0, y: 0 },
    canvasTransform: { dX: 0, dY: 0, scale: 1 },
    lastTranslate: { dX: 0, dY: 0 },
    canvasSize: { width: 0, height: 0 },
    boardLimits: { top: Infinity, right: -Infinity, bottom: -Infinity, left: Infinity },
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
        setCanvasScale: (state, action: PayloadAction<number>) => {
            const scale = parseFloat(action.payload.toFixed(2));
            state.canvasTransform.scale = scale;
        },
        centerCanvasAt: (state, action: PayloadAction<[boardX: number, boardY: number]>) => {
            const [boardX, boardY] = action.payload;
            const { canvasSize, canvasTransform } = state;
            state.canvasTransform.dX = Math.round(canvasSize.width * 0.5 - boardX * canvasTransform.scale);
            state.canvasTransform.dY = Math.round(canvasSize.height * 0.5 - boardY * canvasTransform.scale);
        },
        setCanvasSize: (state, action: PayloadAction<{ width: number; height: number }>) => {
            state.canvasSize = action.payload;
        },
        updateBoardLimits: (state, action: PayloadAction<BoardItem>) => {
            const { maxX, maxY, minX, minY } = getItemMaxCoordinates(action.payload);
            const { top, right, bottom, left } = state.boardLimits;
            if (maxY > bottom - BOARD_PADDING) state.boardLimits.bottom = maxY + BOARD_PADDING;
            if (maxX > right - BOARD_PADDING) state.boardLimits.right = maxX + BOARD_PADDING;
            if (minY < top + BOARD_PADDING) state.boardLimits.top = minY - BOARD_PADDING;
            if (minX < left + BOARD_PADDING) state.boardLimits.left = minX - BOARD_PADDING;
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
    setCanvasScale,
    centerCanvasAt,
    setCanvasSize,
    updateBoardLimits,
    setIsWriting,
} = boardSlice.actions;

export default boardSlice.reducer;
