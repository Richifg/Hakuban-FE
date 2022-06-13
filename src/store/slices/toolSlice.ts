import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Tool } from '../../interfaces/board';
import type { ShapeStyle, TextStyle, ShapeType, NoteStyle, LineStyle, DrawingStyle } from '../../interfaces/items';

interface ToolsState {
    selectedTool: Tool;
    shapeType: ShapeType;
    shapeStyle: ShapeStyle;
    textStyle: TextStyle;
    noteStyle: NoteStyle;
    lineStyle: LineStyle;
    drawingStyle: DrawingStyle;
}

const initialState: ToolsState = {
    selectedTool: 'POINTER',
    shapeType: 'rect',
    shapeStyle: {
        lineWidth: 1,
        linePattern: 0,
        lineColor: 'black',
        fillColor: 'transparent',
    },
    textStyle: {
        fontSize: 20,
        fontFamily: 'serif',
        textColor: 'black',
        hAlign: 'center',
        vAlign: 'center',
        bold: false,
        italic: false,
    },
    noteStyle: {
        fillColor: '#fcf8bd',
        size: 100,
    },
    lineStyle: {
        lineWidth: 2,
        lineColor: 'black',
        lineType: 'straight',
        linePattern: 0,
        arrow0Type: 'none',
        arrow2Type: 'simple',
    },
    drawingStyle: {
        lineWidth: 1,
        lineColor: 'black',
        linePattern: 0,
    },
};

export const slice = createSlice({
    name: 'tools',
    initialState,
    reducers: {
        setSelectedTool: (state, action: PayloadAction<Tool>) => {
            state.selectedTool = action.payload;
        },
        setShapeType: (state, action: PayloadAction<ShapeType>) => {
            state.shapeType = action.payload;
        },
        setShapeStyle: (state, action: PayloadAction<ShapeStyle>) => {
            state.shapeStyle = action.payload;
        },
        setTextStyle: (state, action: PayloadAction<TextStyle>) => {
            state.textStyle = action.payload;
        },
        setNoteStyle: (state, action: PayloadAction<NoteStyle>) => {
            state.noteStyle = action.payload;
        },
        setLineStyle: (state, action: PayloadAction<LineStyle>) => {
            state.lineStyle = action.payload;
        },
        setDrawingStyle: (state, action: PayloadAction<DrawingStyle>) => {
            state.drawingStyle = action.payload;
        },
    },
});

export const { setSelectedTool, setShapeType, setShapeStyle, setTextStyle, setNoteStyle, setDrawingStyle } = slice.actions;

export default slice.reducer;
