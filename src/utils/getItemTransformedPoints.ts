import type { BoardItem, Point } from '../interfaces/items';
import type { CanvasTransform } from '../interfaces/board';
import { getCanvasCoordinates } from '.';

function getItemTransformedPoints(item: BoardItem, transform: CanvasTransform): { [key in Point]: { x: number; y: number } } {
    const { x0, y0, x2, y2 } = item;
    const [x0C, y0C] = getCanvasCoordinates(x0, y0, transform);
    const [x2C, y2C] = getCanvasCoordinates(x2, y2, transform);

    return {
        P0: { x: x0C, y: y0C },
        P1: { x: x2C, y: y0C },
        P2: { x: x2C, y: y2C },
        P3: { x: x0C, y: y2C },
    };
}

export default getItemTransformedPoints;
