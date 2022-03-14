import { store } from '../store/store';
import { Line } from '../interfaces';
import { getNewId } from './';

function getNewLine(x: number, y: number): Line {
    const { lineStyle } = store.getState().tools;
    return {
        id: getNewId(),
        type: 'line',
        x0: x,
        x2: x,
        y0: y,
        y2: y,
        ...lineStyle,
    };
}

export default getNewLine;
