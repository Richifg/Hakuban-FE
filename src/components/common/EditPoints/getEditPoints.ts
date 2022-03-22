import { BoardItem, Point } from '../../../interfaces/items';
import { CanvasTransform } from '../../../interfaces/board';
import { getCanvasCoordinates } from '../../../utils';

function getEditPoints(item: BoardItem, transform: CanvasTransform): [point: Point, x: number, y: number][] {
    const { x0, y0, x2, y2 } = item;
    const [x0C, y0C] = getCanvasCoordinates(x0, y0, transform);
    const [x2C, y2C] = getCanvasCoordinates(x2, y2, transform);

    const points: [Point, number, number][] = [
        ['P0', x0C, y0C],
        ['P2', x2C, y2C],
    ];
    if (item.type !== 'line') {
        points.push(['P1', x2C, y0C], ['P3', x0C, y2C]);
    }

    return points;
}

export default getEditPoints;
