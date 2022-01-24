import { CanvasTransform } from '../interfaces/board';

function getDetransformedCoordinates(x: number, y: number, transform: CanvasTransform): [x: number, y: number] {
    const { dX, dY, scale } = transform;
    const detransformedX = (x - dX) / scale;
    const detransformedY = (y - dY) / scale;

    return [detransformedX, detransformedY];
}

export default getDetransformedCoordinates;
