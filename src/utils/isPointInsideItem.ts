import type { BoardItem } from '../interfaces/items';

function isPointInsideItem(boardX: number, boardY: number, item: BoardItem): boolean {
    const { x0, y0, x2, y2 } = item;
    if ((boardX >= x0 && boardX <= x2) || (boardX <= x0 && boardX >= x2)) {
        if ((boardY >= y0 && boardY <= y2) || (boardY <= y0 && boardY >= y2)) {
            return true;
        }
    }
    return false;
}
export default isPointInsideItem;
