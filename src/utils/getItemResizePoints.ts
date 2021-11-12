import type { Shape, Point } from '../interfaces/items';
import type { CanvasTransform } from '../interfaces/board';

type ResizePoints = { x0: number; y0: number; x2: number; y2: number };

function getItemResizePoints(
    item: Shape,
    selectedPoint: Point,
    newX: number,
    newY: number,
    transform: CanvasTransform,
): ResizePoints {
    let [x0, y0, x2, y2] = [0, 0, 0, 0];
    const { dX, dY } = transform;
    switch (selectedPoint) {
        case 'P0':
            x0 = newX - dX;
            y0 = newY - dY;
            x2 = item.x2;
            y2 = item.y2;
            break;
        case 'P1':
            x0 = item.x0;
            y0 = newY - dY;
            x2 = newX - dX;
            y2 = item.y2;
            break;
        case 'P2':
            x0 = item.x0;
            y0 = item.y0;
            x2 = newX - dX;
            y2 = newY - dY;
            break;
        default:
            x0 = newX - dX;
            y0 = item.y0;
            x2 = item.x2;
            y2 = newY - dY;
    }
    return { x0, y0, x2, y2 };
}

export default getItemResizePoints;
