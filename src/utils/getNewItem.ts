import type { CanvasTransform, Tool } from '../interfaces/board';
import type { BoardItem } from '../interfaces/items';
import { getNewId } from './';

function getNewItem(x: number, y: number, tool: Tool, transform: CanvasTransform, defaultItem: BoardItem): BoardItem {
    const { dX, dY, scale } = transform;
    const id = getNewId();
    const initX = (x - dX) / scale;
    const initY = (y - dY) / scale;
    const newItem = {
        ...defaultItem,
        id,
        x0: initX,
        y0: initY,
        x2: initX,
        y2: initY,
    };
    return newItem;
}

export default getNewItem;
