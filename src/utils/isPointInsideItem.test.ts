import { isPointInsideItem } from './';

test('returns true on an inside point', () => {
    const item = {
        type: 'shape',
        shapeType: 'circle',
        x0: 100,
        y0: -100,
        x2: 0,
        y2: 100,
    } as const;
    const transform = { dX: 0, dY: 0, sX: 1, sY: 1 };

    expect(isPointInsideItem(50, 0, item, transform)).toBe(true);
});

test('return false on an outside point', () => {
    const item = {
        type: 'shape',
        shapeType: 'circle',
        x0: 13,
        y0: 20,
        x2: 26,
        y2: 89,
    } as const;
    const transform = { dX: 0, dY: 0, sX: 1, sY: 1 };

    expect(isPointInsideItem(16, 3, item, transform)).toBe(false);
});
