import { store } from '../store/store';
import { Note } from '../interfaces';

function getNewNote(x: number, y: number): Note {
    const { noteStyle } = store.getState().tools;
    const offset = noteStyle.size / 2;
    return {
        type: 'note',
        x0: x - offset,
        x2: x + offset,
        y0: y - offset,
        y2: y + offset,
        ...noteStyle,
    };
}

export default getNewNote;
