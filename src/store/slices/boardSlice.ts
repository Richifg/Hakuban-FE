import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Action, CanvasTransform, BoardItem } from '../../interfaces';
import { getDetransformedCoordinates, getItemMaxCoordinates, getTransformedCoordinates } from '../../utils';

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
    boardLimits: { top: 0, right: 0, bottom: 0, left: 0 },
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
        scaleCanvasToScreenPoint: (state, action: PayloadAction<[newScale: number, screenX: number, screenY: number]>) => {
            const [newScale, screenX, screenY] = action.payload;
            const { canvasTransform } = state;
            const scale = parseFloat(newScale.toFixed(2));
            // get canvas coordinates
            const [absX, absY] = getDetransformedCoordinates(screenX, screenY, canvasTransform);
            // position coordinates using the new scale
            const [newX, newY] = getTransformedCoordinates(absX, absY, { ...canvasTransform, scale });
            // translate keeping relative coordinates in the same position on the screen
            const [dX, dY] = [screenX - newX, screenY - newY];
            state.canvasTransform = {
                scale,
                dX: Math.round(canvasTransform.dX + dX),
                dY: Math.round(canvasTransform.dY + dY),
            };
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
    scaleCanvas,
    scaleCanvasToScreenPoint,
    setCanvasSize,
    updateBoardLimits,
    setIsWriting,
} = boardSlice.actions;

export default boardSlice.reducer;
