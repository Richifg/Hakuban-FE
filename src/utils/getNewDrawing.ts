import { Drawing } from '../interfaces';
import { getNewId } from './';

function getNewDrawing(x: number, y: number): Drawing {
    return {
        type: 'drawing',
        id: getNewId(),
        x0: 0,
        x2: 0,
        y0: 0,
        y2: 0,
        points: [[x, y]],
        lineColor: 'black',
        lineWidth: 1,
        inProgress: true,
    };
}

export default getNewDrawing;
