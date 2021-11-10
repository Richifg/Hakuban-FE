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
    switch (selectedPoint) {
        case 'P0':
            x0 = newX;
            y0 = newY;
            x2 = item.x2;
            y2 = item.y2;
            break;
        case 'P1':
            x0 = item.x0;
            y0 = newY;
            x2 = newX;
            y2 = item.y2;
            break;
        case 'P2':
            x0 = item.x0;
            y0 = item.y0;
            x2 = newX;
            y2 = newY;
            break;
        default:
            x0 = newX;
            y0 = item.y0;
            x2 = item.x2;
            y2 = newY;
    }
    const { dX, dY } = transform;
    x0 -= dX; // ##TODO why all the points have to be translated
    x2 -= dX; // shouldnt instead the intact points be left as is?
    y0 -= dY;
    y2 -= dY;
    return { x0, y0, x2, y2 };
}

export default getItemResizePoints;
