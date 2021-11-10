import type { Item } from '../interfaces/items';
import getItemResizePoints from './getItemResizePoints';

test('calculates new resize points correctly', () => {
    const dX = 50;
    const dY = -26;
    const newX = 45;
    const newY = 6;
    const item: Item = {
        type: 'shape',
        shapeType: 'circle',
        x0: 10,
        x2: 20,
        y0: 60,
        y2: 100,
    };
    const transform = { dX, dY, sX: 0, sY: 0 };
    const { x0, x2, y0, y2 } = getItemResizePoints(item, 'P1', newX, newY, transform);

    expect(x0).toBe(item.x0);
    expect(x2).toBe(newX - dX);
    expect(y0).toBe(newY - dY);
    expect(y2).toBe(item.y2);
});
