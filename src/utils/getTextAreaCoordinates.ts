import { Shape, Coordinates } from '../interfaces';

function getTextAreaCoordinates(shape: Shape): Coordinates {
    const { x0, x2, y0, y2, shapeType } = shape;
    const [maxX, maxY] = [Math.max(x0, x2), Math.max(y0, y2)];
    const [minX, minY] = [Math.min(x0, x2), Math.min(y0, y2)];
    const [width, height] = [maxX - minX, maxY - minY];

    let [xL, xR, yT, yB] = [0, 0, 0, 0];
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
    return { x0: xL, y0: yT, x2: xR, y2: yB };
}

export default getTextAreaCoordinates;
