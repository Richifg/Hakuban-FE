import { BoardItem, Point, Coordinates } from '../interfaces/items';

// return new points for item based on cursor position and selectedPoint
// aspect ratio can be mantained when requested

function getResizedCoordinates(
    item: BoardItem,
    selectedPoint: Point,
    cursorBoardX: number,
    cursorBoardY: number,
    maintainRatio = false,
): Coordinates {
    let newX: number;
    let newY: number;
    const { x0, y0, x2, y2 } = item;
    if (!maintainRatio) {
        [newX, newY] = [cursorBoardX, cursorBoardY];
    } else {
        // gets the resize anchor point
        let staticX: number;
        let staticY: number;
        if (selectedPoint === 'P0') [staticX, staticY] = [x2, y2];
        else if (selectedPoint === 'P1') [staticX, staticY] = [x0, y2];
        else if (selectedPoint === 'P2') [staticX, staticY] = [x0, y0];
        else [staticX, staticY] = [x2, y0];

        // checks on which axis the resize point grew more
        const deltaX = cursorBoardX - staticX;
        const deltaY = cursorBoardY - staticY;
        const deltaDirection = Math.sign(deltaX | 1) * Math.sign(deltaY | 1); // avoid Math.sign(0) as it returns 0

        // calculates the other axis maintaining the item size ratio
        const ratio = Math.abs((x2 - x0) / (y2 - y0));
        if (Math.abs(deltaX) > Math.abs(deltaY * ratio))
            [newX, newY] = [cursorBoardX, staticY + (deltaX / ratio) * deltaDirection];
        else [newX, newY] = [staticX + deltaY * ratio * deltaDirection, cursorBoardY];
    }

    if (selectedPoint === 'P0') return { x0: newX, y0: newY, x2, y2 };
    else if (selectedPoint === 'P1') return { x0, x2: newX, y0: newY, y2 };
    else if (selectedPoint === 'P2') return { x0, y0, x2: newX, y2: newY };
    else return { x0: newX, x2, y0, y2: newY };
}

export default getResizedCoordinates;
