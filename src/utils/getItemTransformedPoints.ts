import type { BoardItem, Point } from '../interfaces/items';
import type { CanvasTransform } from '../interfaces/board';
import { getTransformedCoordinates } from '.';

function getItemTransformedPoints(item: BoardItem, transform: CanvasTransform): { [key in Point]: { x: number; y: number } } {
    const { x0, y0, x2, y2 } = item;
    const [x0T, y0T] = getTransformedCoordinates(x0, y0, transform);
    const [x2T, y2T] = getTransformedCoordinates(x2, y2, transform);

    return {
        P0: { x: x0T, y: y0T },
        P1: { x: x2T, y: y0T },
        P2: { x: x2T, y: y2T },
        P3: { x: x0T, y: y2T },
    };
}

export default getItemTransformedPoints;
