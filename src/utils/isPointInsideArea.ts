import { Coordinates } from '../interfaces/items';
import { SHAPE_CLICK_TOLERANCE } from '../constants';

function isPointInsideArea(pointX: number, pointY: number, area: Coordinates, tolerance = SHAPE_CLICK_TOLERANCE): boolean {
    const { x0, y0, x2, y2 } = area;
    if ((pointX + tolerance >= x0 && pointX - tolerance <= x2) || (pointX - tolerance <= x0 && pointX + tolerance >= x2)) {
        if ((pointY + tolerance >= y0 && pointY - tolerance <= y2) || (pointY - tolerance <= y0 && pointY + tolerance >= y2)) {
            return true;
        }
    }
    return false;
}
export default isPointInsideArea;
