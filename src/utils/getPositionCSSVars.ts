import { getCanvasCoordinates } from '.';
import { Coordinates, CanvasTransform } from '../interfaces';

function getPositionCSSVars(
    transform: CanvasTransform,
    boardCoordinates: Coordinates,
    scaleSize = true,
): { left: number; top: number; width: number; height: number } {
    const { x0, y0, x2, y2 } = boardCoordinates;
    const { scale } = transform;
    const [x, y] = [Math.min(x0, x2), Math.min(y0, y2)];
    const [left, top] = getCanvasCoordinates(x, y, transform);
    const width = Math.abs(x0 - x2) * (scaleSize ? scale : 1);
    const height = Math.abs(y0 - y2) * (scaleSize ? scale : 1);
    return { left, top, width, height };
}

export default getPositionCSSVars;
