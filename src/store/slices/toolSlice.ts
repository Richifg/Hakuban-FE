import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Tool } from '../../interfaces/board';
import type { ShapeStyle, TextStyle, ShapeType } from '../../interfaces/items';

interface ToolsState {
    selectedTool: Tool;
    shapeType: ShapeType;
    shapeStyle: ShapeStyle;
    textStyle: TextStyle;
}

const initialState: ToolsState = {
    selectedTool: 'POINTER',
    shapeType: 'bubble',
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
    },
});

export const { setSelectedTool, setShapeType, setShapeStyle, setTextStyle } = toolsSlice.actions;

export default toolsSlice.reducer;
