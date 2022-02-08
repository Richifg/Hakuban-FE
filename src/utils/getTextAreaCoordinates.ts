import { Shape, Coordinates } from '../interfaces';

function getTextAreaCoordinates(shape: Shape): Coordinates {
    const { x0, x2, y0, y2, shapeType } = shape;
    let [xL, xR, yT, yB] = [0, 0, 0, 0];
    const [width, height] = [Math.abs(x2 - x0), Math.abs(y2 - y0)];
    switch (shapeType) {
        case 'rect':
            return { x0, x2, y0, y2 };
        case 'roundedRect':
            // r = 10% width or height; offset = cos(45)*(sqrt2 - 1)*r
            const cornerOffset = Math.min(width, height) * 0.02929;
            [xL, yT] = [Math.min(x0, x2) + cornerOffset, Math.min(y0, y2) + cornerOffset];
            [xR, yB] = [Math.max(x0, x2) - cornerOffset, Math.max(y0, y2) - cornerOffset];
            break;
        case 'circle':
            // r = 50% width and height; offset = cos(45)*(sqrt2 - 1)*r
            const [xOffset, yOffset] = [0.1464 * width, 0.1464 * height];
            [xL, yT] = [Math.min(x0, x2) + xOffset, Math.min(y0, y2) + yOffset];
            [xR, yB] = [Math.max(x0, x2) - xOffset, Math.max(y0, y2) - yOffset];
            break;
        case 'bubble':

        default:
            return { x0, x2, y0, y2 };
    }
    return { x0: xL, y0: yT, x2: xR, y2: yB };
}

export default getTextAreaCoordinates;
