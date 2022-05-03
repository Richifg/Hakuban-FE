import { store } from '../store/store';
import { BoardItem, BoardItemType, Note, Line, Drawing, Shape, Text } from '../interfaces';
import { getNewId } from '../utils';

function getNewItem(x: number, y: number, type: 'note'): Note;
function getNewItem(x: number, y: number, type: 'line'): Line;
function getNewItem(x: number, y: number, type: 'drawing'): Drawing;
function getNewItem(x: number, y: number, type: 'shape'): Shape;
function getNewItem(x: number, y: number, type: 'text'): Text;
function getNewItem(x: number, y: number, type: BoardItemType): BoardItem {
    const { maxZIndex } = store.getState().board;
    const itemBase = {
        id: getNewId(),
        creationDate: Date.now(),
        zIndex: maxZIndex,
        type,
    };
    switch (type) {
        case 'line':
            const { lineStyle } = store.getState().tools;
            return {
                ...itemBase,
                type,
                x0: x,
                x2: x,
                y0: y,
                y2: y,
                ...lineStyle,
            };
        case 'note':
            const { noteStyle } = store.getState().tools;
            const offset = noteStyle.size / 2;
            return {
                ...itemBase,
                type,
                x0: x - offset,
                x2: x + offset,
                y0: y - offset,
                y2: y + offset,
                ...noteStyle,
            };
        case 'shape':
            const { shapeStyle, shapeType } = store.getState().tools;
            return {
                ...itemBase,
                type,
                x0: x,
                y0: y,
                x2: x,
                y2: y,
                shapeType,
                ...shapeStyle,
            };
        case 'drawing':
            const { drawingStyle } = store.getState().tools;
            return {
                ...itemBase,
                type,
                x0: 0,
                x2: 0,
                y0: 0,
                y2: 0,
                points: [[x, y]],
                isAbsolute: true,
                ...drawingStyle,
            };
        case 'text':
            const { textStyle } = store.getState().tools;
            return {
                ...itemBase,
                type,
                x0: x,
                y0: y,
                x2: x,
                y2: y,
                text: {
                    content: '',
                    ...textStyle,
                },
            };
    }
}

export default getNewItem;
