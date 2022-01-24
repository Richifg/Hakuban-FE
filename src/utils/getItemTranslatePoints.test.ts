import type { Shape } from '../interfaces/items';
import { getItemTranslatePoints } from '.';

test('calculates new translate points correctly', () => {
    const testItem: Shape = {
        type: 'shape',
        shapeType: 'circle',
        x0: 50,
        y0: -91,
        x2: 13,
        y2: 50,
    };
    const newX = 60;
    const newY = 40;
    const transform = { dX: 90, dY: -14, scale: 1 };

    const { x0, y2 } = getItemTranslatePoints(testItem, 'P0', newX, newY, transform);

    expect(x0).toBe((testItem.x0 - transform.dX) / transform.scale);
    expect(y2).toBe((testItem.y2 - transform.dY) / transform.scale);
});
