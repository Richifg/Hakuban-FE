import type { BoardItem, Point, Coordinates } from '../interfaces/items';
import type { CanvasTransform } from '../interfaces/board';
import { getBoardCoordinates } from '.';

// return new points for item based on cursor position and selectedPoint
// if resizeOffset is provided, resize will mantain aspect ratio

function getResizedCoordinates(
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
    const [boardX, boardY] = getBoardCoordinates(cursorX, cursorY, transform);
    if (!maintainRatio) {
        [newX, newY] = [boardX, boardY];
    } else {
        // gets the resize anchor point
        let staticX: number;
        let staticY: number;
        if (selectedPoint === 'P0') [staticX, staticY] = [x2, y2];
        else if (selectedPoint === 'P1') [staticX, staticY] = [x0, y2];
        else if (selectedPoint === 'P2') [staticX, staticY] = [x0, y0];
        else [staticX, staticY] = [x2, y0];

        // checks on which axis the resize point grew more
        const deltaX = boardX - staticX;
        const deltaY = boardY - staticY;
        const deltaDirection = Math.sign(deltaX | 1) * Math.sign(deltaY | 1); // avoid Math.sign(0) as it returns 0

        // calculates the other axis maintaining the item size ratio
        const ratio = Math.abs((x2 - x0) / (y2 - y0));
        if (Math.abs(deltaX) > Math.abs(deltaY * ratio)) [newX, newY] = [boardX, staticY + (deltaX / ratio) * deltaDirection];
        else [newX, newY] = [staticX + deltaY * ratio * deltaDirection, boardY];
    }

    if (selectedPoint === 'P0') return { x0: newX, y0: newY, x2, y2 };
    else if (selectedPoint === 'P1') return { x0, x2: newX, y0: newY, y2 };
    else if (selectedPoint === 'P2') return { x0, y0, x2: newX, y2: newY };
    else return { x0: newX, x2, y0, y2: newY };
}

export default getResizedCoordinates;
