import { getTransformedCoordinates } from './';
import { Coordinates, CanvasTransform } from '../interfaces';

function getItemPositionCSSVars(
    transform: CanvasTransform,
    coodinates: Coordinates,
): { left: number; top: number; width: number; height: number } {
    const { x0, y0, x2, y2 } = coodinates;
    const [x, y] = [Math.min(x0, x2), Math.min(y0, y2)];
    const [left, top] = getTransformedCoordinates(x, y, transform);
    const width = Math.abs(x0 - x2);
    const height = Math.abs(y0 - y2);
    return { left, top, width, height };
}

export default getItemPositionCSSVars;
