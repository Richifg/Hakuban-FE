import { Shape, Note, Text, Coordinates } from '../interfaces';
import { getItemMaxCoordinates } from '../utils';

function getTextAreaCoordinates(item: Shape | Note | Text): Coordinates {
    const { x0, x2, y0, y2 } = item;
    let [xL, xR, yT, yB] = [0, 0, 0, 0];

    const { type } = item;
    if (type === 'shape') {
        const { maxX, maxY, minX, minY } = getItemMaxCoordinates(item);
        const [width, height] = [maxX - minX, maxY - minY];
        const { shapeType } = item;
        if (shapeType === 'rect') {
            // rect uses whole shape
            return { x0, x2, y0, y2 };
        } else if (shapeType === 'roundedRect') {
            // r = 10% width or height; offset = cos(45)*(sqrt2 - 1)*r
            const cornerOffset = Math.min(width, height) * 0.02929;
            [xL, yT] = [minX + cornerOffset, minY + cornerOffset];
            [xR, yB] = [maxX - cornerOffset, maxY - cornerOffset];
        } else if (shapeType === 'circle') {
            // r = 50% width and height; offset = cos(45)*(sqrt2 - 1)*r
            const [xOffset, yOffset] = [0.1464 * width, 0.1464 * height];
            [xL, yT] = [minX + xOffset, minY + yOffset];
            [xR, yB] = [maxX - xOffset, maxY - yOffset];
        } else if (shapeType === 'bubble') {
            // r = 20% width and height; offset = cos(45)*(sqrt2 - 1)*r
            const cornerOffset = Math.min(width, height) * 0.05858;
            [xL, yT] = [minX + cornerOffset, minY + cornerOffset];
            [xR, yB] = [maxX - cornerOffset, maxY - cornerOffset];
            const tailOffset = 0.2 * height;
            if (y2 >= y0) yB -= tailOffset;
            else yT += tailOffset;
        } else if (shapeType === 'triangle') {
            // triangle uses half width and height slanted towards the base
            const widthOffset = 0.25 * width;
            [xL, yT] = [minX + widthOffset, minY];
            [xR, yB] = [maxX - widthOffset, maxY];
            const heightOffset = 0.5 * height;
            if (y2 >= y0) yT += heightOffset;
            else yB -= heightOffset;
        } else if (shapeType === 'romboid') {
            // romboid uses half area
            const widthOffset = 0.25 * width;
            const heightOffset = 0.25 * height;
            [xL, yT] = [minX + widthOffset, minY + heightOffset];
            [xR, yB] = [maxX - widthOffset, maxY - heightOffset];
        }
    } else if (type === 'note') {
        // Note uses 5% padding
        const [width, height] = [x2 - x0, y2 - y0];
        const paddingX = 0.05 * width;
        const paddingY = 0.05 * height;
        [xL, yT] = [x0 + paddingX, y0 + paddingY];
        [xR, yB] = [x2 - paddingX, y2 - paddingY];
    } else {
        return { x0, x2, y0, y2 };
    }
    return { x0: xL, y0: yT, x2: xR, y2: yB };
}

export default getTextAreaCoordinates;
