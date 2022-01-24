import type { BoardItem } from '../interfaces/items';
import type { CanvasTransform } from '../interfaces/board';

function isPointInsideItem(x: number, y: number, item: BoardItem, transform: CanvasTransform): boolean {
    const { dX, dY, scale } = transform;
    const realX = (x - dX) / scale;
    const realY = (y - dY) / scale;
    const { x0, y0, x2, y2 } = item;
    if ((realX >= x0 && realX <= x2) || (realX <= x0 && realX >= x2)) {
        if ((realY >= y0 && realY <= y2) || (realY <= y0 && realY >= y2)) {
            return true;
        }
    }
    return false;
}
export default isPointInsideItem;
