import { Coordinates } from '../interfaces/items';

function isPointInsideArea(pointX: number, pointY: number, area: Coordinates): boolean {
    const { x0, y0, x2, y2 } = area;
    if ((pointX >= x0 && pointX <= x2) || (pointX <= x0 && pointX >= x2)) {
        if ((pointY >= y0 && pointY <= y2) || (pointY <= y0 && pointY >= y2)) {
            return true;
        }
    }
    return false;
}
export default isPointInsideArea;
