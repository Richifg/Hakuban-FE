import { Coordinates } from '../interfaces';
import { getMaxCoordinates } from '.';

function isAreaInsideArea(area1: Coordinates, area2: Coordinates): boolean {
    const { maxX, maxY, minX, minY } = getMaxCoordinates(area1);
    const { maxX: maxX2, maxY: maxY2, minX: minX2, minY: minY2 } = getMaxCoordinates(area2);

    if (
        // X overlap if either point of area is inside item or both are outisde
        ((minX2 > minX && minX2 < maxX) || (maxX2 > minX && maxX2 < maxX) || (minX2 < minX && maxX2 > maxX)) &&
        // Y overlap follows same conditions
        ((minY2 > minY && minY2 < maxY) || (maxY2 > minY && maxY2 < maxY) || (minY2 < minY && maxY2 > maxY))
    )
        return true;
    else return false;
}

export default isAreaInsideArea;
