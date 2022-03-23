import { store } from '../store/store';
import { BoardItem, BoardItemType, Note, Line, Drawing, Shape, Text } from '../interfaces';
import { getNewId } from '../utils';

function getNewItem(x: number, y: number, zIndex: number, type: 'note'): Note;
function getNewItem(x: number, y: number, zIndex: number, type: 'line'): Line;
function getNewItem(x: number, y: number, zIndex: number, type: 'drawing'): Drawing;
function getNewItem(x: number, y: number, zIndex: number, type: 'shape'): Shape;
function getNewItem(x: number, y: number, zIndex: number, type: 'text'): Text;
function getNewItem(x: number, y: number, zIndex: number, type: BoardItemType): BoardItem {
    const id = getNewId();
    switch (type) {
        case 'line':
            return {
                id,
                type,
                zIndex,
                x0: x,
                x2: x,
                y0: y,
                y2: y,
                ...store.getState().tools.lineStyle,
            };
        case 'note':
            const { noteStyle } = store.getState().tools;
            const offset = noteStyle.size / 2;
            return {
                id,
                type,
                zIndex,
                x0: x - offset,
                x2: x + offset,
                y0: y - offset,
                y2: y + offset,
                ...noteStyle,
            };
        case 'shape':
            const { shapeStyle, shapeType } = store.getState().tools;
            return {
                id,
                type,
                zIndex,
                x0: x,
                y0: y,
                x2: x,
                y2: y,
                shapeType,
                ...shapeStyle,
            };
        case 'drawing':
            return {
                id,
                type,
                zIndex,
                x0: 0,
                x2: 0,
                y0: 0,
                y2: 0,
                points: [[x, y]],
                ...store.getState().tools.drawingStyle,
                inProgress: true,
            };
        case 'text':
            return {
                id,
                type,
                zIndex,
                x0: x,
                y0: y,
                x2: x,
                y2: y,
                text: {
                    content: '',
                    ...store.getState().tools.textStyle,
                },
            };
    }
}

export default getNewItem;
