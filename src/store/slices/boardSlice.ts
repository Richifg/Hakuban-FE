import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Point } from '../../interfaces/board';

type Tool = 'POINTER' | 'SHAPE' | 'PEN';
type Action = 'IDLE' | 'DRAW' | 'DRAG' | 'EDIT' | 'PAN' | 'SLIDE';

interface BoardState {
    selectedTool: Tool;
    currentAction: Action;
    cursorPosition: { x: number; y: number };
    canvasTransform: { dX: number; dY: number; sX: number; sY: number };
    lastTranslate: { dX: number; dY: number };
    canvasSize: { width: number; height: number };
    selectedItem?: string;
    selectedPoint?: Point;
}

const initialState: BoardState = {
    selectedTool: 'POINTER',
    currentAction: 'IDLE',
    cursorPosition: { x: 0, y: 0 },
    canvasTransform: { dX: 0, dY: 0, sX: 1, sY: 1 },
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
        setCursorPosition: (state, action: PayloadAction<[number, number]>) => {
            const [x, y] = action.payload;
            state.cursorPosition = { x, y };
        },
        translateCanvas: (state, action: PayloadAction<[number, number]>) => {
            const [dX, dY] = action.payload;
            state.lastTranslate = { dX, dY };
            state.canvasTransform = {
                ...state.canvasTransform,
                dX: state.canvasTransform.dX + dX,
                dY: state.canvasTransform.dY + dY,
            };
        },
        scaleCanvas: (state, action: PayloadAction<[number, number]>) => {
            const [sX, sY] = action.payload;
            state.canvasTransform = {
                ...state.canvasTransform,
                sX: state.canvasTransform.sX + sX,
                sY: state.canvasTransform.sY + sY,
            };
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
    setCursorPosition,
    translateCanvas,
    scaleCanvas,
    setCanvasSize,
    setSelectedItem,
    setSelectedPoint,
} = boardSlice.actions;

export default boardSlice.reducer;
