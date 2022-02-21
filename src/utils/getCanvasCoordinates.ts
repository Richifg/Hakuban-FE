import { CanvasTransform } from '../interfaces/board';

function getCanvasCoordinates(boardX: number, boardY: number, transform: CanvasTransform): [x: number, y: number] {
    const { dX, dY, scale } = transform;
    const canvasX = boardX * scale + dX;
    const canvasY = boardY * scale + dY;
    return [canvasX, canvasY];
}

export default getCanvasCoordinates;
