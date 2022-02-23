import type { CanvasTransform } from '../interfaces/board';
import type { BoardItem } from '../interfaces/items';
import { getBoardCoordinates } from './';

type TranslatePoints = { x0: number; y0: number; x2: number; y2: number };

function getItemTranslatePoints(
    item: BoardItem,
    offset: { x: number; y: number },
    newX: number,
    newY: number,
    transform: CanvasTransform,
): TranslatePoints {
    const [width, height] = [item.x2 - item.x0, item.y2 - item.y0];
    const [boardX, boardY] = getBoardCoordinates(newX, newY, transform);
    const [x0, y0] = [boardX - offset.x, boardY - offset.y];
    const [x2, y2] = [x0 + width, y0 + height];
    return { x0, y0, x2, y2 };
}

export default getItemTranslatePoints;
