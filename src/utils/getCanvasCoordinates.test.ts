import { CanvasTransform } from '../interfaces/board';
import { getCanvasCoordinates } from '.';

test('returns correct transformed points', () => {
    const transform: CanvasTransform = { dX: 30, dY: -48, scale: 0.5 };
    const [testX, testY] = [26, 0];
    const [x, y] = getCanvasCoordinates(testX, testY, transform);
    expect(x).toBe(testX * transform.scale + transform.dX);
    expect(y).toBe(testY * transform.scale + transform.dY);
});
