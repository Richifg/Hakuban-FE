import type { Shape, ShapeStyle, ShapeType } from '../interfaces/items';
import { getNewId } from '.';

function getNewShape(x: number, y: number, shapeType: ShapeType, style: ShapeStyle): Shape {
    const id = getNewId();
    const newItem = {
        id,
        type: 'shape',
        x0: x,
        y0: y,
        x2: x,
        y2: y,
        shapeType,
        ...style,
    } as const;
    return newItem;
}

export default getNewShape;
