import { BoardItem } from '../interfaces';

function getItemMaxCoordinates(item: BoardItem): { maxX: number; minX: number; maxY: number; minY: number } {
    let maxX: number, maxY: number, minX: number, minY: number;
    const { x0, x2, y0, y2 } = item;
    if (x0 >= x2) {
        maxX = x0;
        minX = x2;
    } else {
        maxX = x2;
        minX = x0;
    }

    if (y0 >= y2) {
        maxY = y0;
        minY = y2;
    } else {
        maxY = y2;
        minY = y0;
    }

    return { maxX, minX, maxY, minY };
}

export default getItemMaxCoordinates;
