import { Coordinates } from '../interfaces';

function getMaxCoordinates(item: Coordinates | Coordinates[]): { maxX: number; minX: number; maxY: number; minY: number } {
    let maxX = -Infinity;
    let maxY = -Infinity;
    let minX = Infinity;
    let minY = Infinity;
    const items = Array.isArray(item) ? item : [item];
    items.forEach((item) => {
        const { x0, x2, y0, y2 } = item;
        maxX = Math.max(maxX, x0, x2);
        maxY = Math.max(maxY, y0, y2);
        minX = Math.min(minX, x0, x2);
        minY = Math.min(minY, y0, y2);
    });

    return { maxX, minX, maxY, minY };
}

export default getMaxCoordinates;
