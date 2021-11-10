import type { BoardItem, Point } from '../interfaces/items';
import type { CanvasTransform } from '../interfaces/board';

function getTransformedPointsFromItem(item: BoardItem, transform: CanvasTransform): { [key in Point]: { x: number; y: number } } {
    const { x0, y0, x2, y2 } = item;
    const { dX, dY } = transform;
    const x0T = x0 + dX;
    const x2T = x2 + dX;
    const y0T = y0 + dY;
    const y2T = y2 + dY;

    return {
        P0: { x: x0T, y: y0T },
        P1: { x: x2T, y: y0T },
        P2: { x: x2T, y: y2T },
        P3: { x: x0T, y: y2T },
    };
}

export default getTransformedPointsFromItem;
