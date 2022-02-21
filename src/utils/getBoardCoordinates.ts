import { CanvasTransform } from '../interfaces/board';

function getBoardCoordinates(canvasX: number, canvasY: number, transform: CanvasTransform): [x: number, y: number] {
    const { dX, dY, scale } = transform;
    const detransformedX = (canvasX - dX) / scale;
    const detransformedY = (canvasY - dY) / scale;

    return [detransformedX, detransformedY];
}

export default getBoardCoordinates;
