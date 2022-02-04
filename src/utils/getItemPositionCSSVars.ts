import { getTransformedCoordinates } from './';
import { BoardItem, CanvasTransform } from '../interfaces';

function getItemPositionCSSVars(
    transform: CanvasTransform,
    item?: BoardItem,
): { left: number; top: number; width: number; height: number } {
    if (!item) return { top: 0, left: 0, height: 0, width: 0 };
    const { x0, y0, x2, y2 } = item;
    const [x, y] = [Math.min(x0, x2), Math.min(y0, y2)];
    const [left, top] = getTransformedCoordinates(x, y, transform);
    const width = Math.abs(x0 - x2);
    const height = Math.abs(y0 - y2);
    return { left, top, width, height };
}

export default getItemPositionCSSVars;
