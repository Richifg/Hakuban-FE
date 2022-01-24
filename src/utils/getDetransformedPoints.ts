import { CanvasTransform } from '../interfaces/board';

function getUntransformedPoints(x: number, y: number, transform: CanvasTransform): [x: number, y: number] {
    const { dX, dY, scale } = transform;
    if (scale === 0) return [0, 0];
    const realX = (x - dX) / scale;
    const realY = (y - dY) / scale;
    return [realX, realY];
}

export default getUntransformedPoints;
