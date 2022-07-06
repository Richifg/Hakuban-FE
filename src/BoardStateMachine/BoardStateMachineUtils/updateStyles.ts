/* eslint-disable @typescript-eslint/no-explicit-any */
import { store } from '../../store/store';
import { BoardItemType } from '../../interfaces';
import { setShapeStyle, setTextStyle, setNoteStyle, setLineStyle, setDrawingStyle } from '../../store/slices/toolSlice';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function updateStyles(type: BoardItemType, key: string, value: any): void {
    const { textStyle } = store.getState().tools;
    if (type === 'text' || key in textStyle) {
        store.dispatch(setTextStyle(safelyUpdateObject(textStyle, key, value)));
    } else if (type === 'drawing') {
        store.dispatch(setDrawingStyle(safelyUpdateObject(store.getState().tools.drawingStyle, key, value)));
    } else if (type === 'line') {
        store.dispatch(setLineStyle(safelyUpdateObject(store.getState().tools.lineStyle, key, value)));
    } else if (type === 'note') {
        store.dispatch(setNoteStyle(safelyUpdateObject(store.getState().tools.noteStyle, key, value)));
    } else if (type === 'shape') {
        store.dispatch(setShapeStyle(safelyUpdateObject(store.getState().tools.shapeStyle, key, value)));
    }
}

export default updateStyles;

// eslint-disable-next-line @typescript-eslint/ban-types
function safelyUpdateObject<T extends Object>(obj: T, key: string, value: any): T {
    if (key in obj) {
        return { ...obj, [key]: value };
    } else return obj;
}
