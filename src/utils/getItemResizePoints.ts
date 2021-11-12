import type { Shape, Point } from '../interfaces/items';
import type { CanvasTransform } from '../interfaces/board';
import { getDetransformedCoordinates } from '.';

type ResizePoints = { x0: number; y0: number; x2: number; y2: number };

function getItemResizePoints(
    item: Shape,
    selectedPoint: Point,
    newX: number,
    newY: number,
    transform: CanvasTransform,
): ResizePoints {
    let [x0, y0, x2, y2] = [0, 0, 0, 0];
    const [realX, realY] = getDetransformedCoordinates(newX, newY, transform);
    switch (selectedPoint) {
        case 'P0':
            x0 = realX;
            y0 = realY;
            x2 = item.x2;
            y2 = item.y2;
            break;
        case 'P1':
            x0 = item.x0;
            y0 = realY;
            x2 = realX;
            y2 = item.y2;
            break;
        case 'P2':
            x0 = item.x0;
            y0 = item.y0;
            x2 = realX;
            y2 = realY;
            break;
        default:
            x0 = realX;
            y0 = item.y0;
            x2 = item.x2;
            y2 = realY;
    }
    return { x0, y0, x2, y2 };
}

export default getItemResizePoints;
