import type { CanvasTransform } from '../interfaces/board';
import type { Shape, Point } from '../interfaces/items';

type TranslatePoints = { x0: number; y0: number; x2: number; y2: number };

/*
// THE BIG QUESTION //

    should I allow translate only on C point?
    can someone drag a shape from any point (not Point) in Miro?
    check that out and consider you options....
*/

function getItemTranslatePoints(
    item: Shape,
    selectedPoint: Point,
    newX: number,
    newY: number,
    transform: CanvasTransform,
): TranslatePoints {
    const { x0, x2, y0, y2 } = item;
    const dX = newX - transform.dX;
    const dY = newY - transform.dY;
    return { x0: x0 + dX, x2: x2 + dX, y0: y0 + dY, y2: y2 + dY };
}

export default getItemTranslatePoints;
