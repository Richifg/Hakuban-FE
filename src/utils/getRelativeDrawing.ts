import { Drawing } from '../interfaces';

function getRelativeDrawing(drawing: Drawing): Drawing {
    let [x0, y0, x2, y2] = [Infinity, Infinity, -Infinity, -Infinity];

    // find maximun and minimun points
    drawing.points.forEach(([x, y]) => {
        if (x < x0) x0 = x;
        if (x > x2) x2 = x;
        if (y < y0) y0 = y;
        if (y > y2) y2 = y;
    });

    const width = x2 - x0;
    const height = y2 - y0;

    // make every point relative
    const points: [number, number][] = drawing.points.map(([x, y]) => [
        parseFloat(((x - x0) / width).toFixed(4)),
        parseFloat(((y - y0) / height).toFixed(4)),
    ]);

    return { ...drawing, x0, x2, y0, y2, points };
}

export default getRelativeDrawing;
