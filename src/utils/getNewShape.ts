import { store } from '../store/store';
import type { Shape } from '../interfaces/items';
import { getNewId } from '.';

function getNewShape(x: number, y: number): Shape {
    const { shapeStyle, shapeType } = store.getState().tools;
    const id = getNewId();
    const newItem = {
        id,
        type: 'shape',
        x0: x,
        y0: y,
        x2: x,
        y2: y,
        shapeType,
        ...shapeStyle,
    } as const;
    return newItem;
}

export default getNewShape;
