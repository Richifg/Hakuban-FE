import type { BoardItem, Point, Coordinates } from '../interfaces/items';
import type { CanvasTransform } from '../interfaces/board';
import { getDetransformedCoordinates } from '.';

// return new points for item based on cursor position and selectedPoint
// if resizeOffset is provided, resize will mantain aspect ratio

function getItemResizePoints(
    item: BoardItem,
    selectedPoint: Point,
    cursorX: number,
    cursorY: number,
    transform: CanvasTransform,
    maintainRatio = false,
): Coordinates {
    let newX: number;
    let newY: number;
    const { x0, y0, x2, y2 } = item;
    // detransforms cursor coordinates to get the real canvas coordinates
    const [realCursorX, realCursorY] = getDetransformedCoordinates(cursorX, cursorY, transform);
    if (!maintainRatio) {
        [newX, newY] = [realCursorX, realCursorY];
    } else {
        // gets the resize anchor point
        let staticX: number;
        let staticY: number;
        if (selectedPoint === 'P0') [staticX, staticY] = [x2, y2];
        else if (selectedPoint === 'P1') [staticX, staticY] = [x0, y2];
        else if (selectedPoint === 'P2') [staticX, staticY] = [x0, y0];
        else [staticX, staticY] = [x2, y0];

        // checks on which axis the resize point grew more
        const deltaX = realCursorX - staticX;
        const deltaY = realCursorY - staticY;
        const deltaDirection = Math.sign(deltaX | 1) * Math.sign(deltaY | 1); // avoid Math.sign(0) as it returns 0

        // calculates the other axis maintaining the item size ratio
        const ratio = Math.abs((x2 - x0) / (y2 - y0));
        if (Math.abs(deltaX) > Math.abs(deltaY * ratio))
            [newX, newY] = [realCursorX, staticY + (deltaX / ratio) * deltaDirection];
        else [newX, newY] = [staticX + deltaY * ratio * deltaDirection, realCursorY];
    }

    if (selectedPoint === 'P0') return { x0: newX, y0: newY, x2, y2 };
    else if (selectedPoint === 'P1') return { x0, x2: newX, y0: newY, y2 };
    else if (selectedPoint === 'P2') return { x0, y0, x2: newX, y2: newY };
    else return { x0: newX, x2, y0, y2: newY };
}

export default getItemResizePoints;
