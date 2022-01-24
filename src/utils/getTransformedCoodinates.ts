import { CanvasTransform } from '../interfaces/board';

function getTransformedCoordinates(x: number, y: number, transform: CanvasTransform): [x: number, y: number] {
    const { dX, dY, scale } = transform;
    const transformedX = x * scale + dX;
    const transformedY = y * scale + dY;
    return [transformedX, transformedY];
}

export default getTransformedCoordinates;
