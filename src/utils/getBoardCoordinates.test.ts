import type { CanvasTransform } from '../interfaces/board';
import { getBoardCoordinates } from '.';

test('returns correct detransformed points', () => {
    const trans: CanvasTransform = { dX: 10, dY: -5, scale: 1.6 };
    const [testX, testY] = [10, 5];
    const [x, y] = getBoardCoordinates(testX, testY, trans);
    expect(x).toBe((x - trans.dX) / trans.scale);
    expect(y).toBe((y - trans.dY) / trans.scale);
});

test('returns zeroes when scale is 0', () => {
    const trans: CanvasTransform = { dX: 10, dY: -5, scale: 0 };
    const [testX, testY] = [-20, 45];
    const [x, y] = getBoardCoordinates(testX, testY, trans);
    expect(x).toBe(0);
    expect(y).toBe(0);
});
