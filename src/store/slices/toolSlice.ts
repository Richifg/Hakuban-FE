import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Tool } from '../../interfaces/board';
import type { ShapeStyle, TextStyle, ShapeType, NoteStyle } from '../../interfaces/items';

interface ToolsState {
    selectedTool: Tool;
    shapeType: ShapeType;
    shapeStyle: ShapeStyle;
    textStyle: TextStyle;
    noteStyle: NoteStyle;
}

const initialState: ToolsState = {
    selectedTool: 'POINTER',
    shapeType: 'rect',
    shapeStyle: {
        lineWidth: 1,
        lineColor: 'black',
        fillColor: 'transparent',
    },
    textStyle: {
        fontSize: 20,
        fontFamily: 'serif',
        color: 'black',
        hAlign: 'center',
        vAlign: 'center',
        bold: false,
        italic: false,
    },
    noteStyle: {
        color: '#eded66',
        size: 100,
    },
};

export const toolsSlice = createSlice({
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
    },
});

export const { setSelectedTool, setShapeType, setShapeStyle, setTextStyle, setNoteStyle } = toolsSlice.actions;

export default toolsSlice.reducer;
