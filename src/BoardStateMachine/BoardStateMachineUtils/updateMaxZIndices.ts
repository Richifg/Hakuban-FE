import { setMaxZIndex, setMinZIndex } from '../../store/slices/boardSlice';
import { store } from '../../store/store';

function updateMaxZIndices(indices: number[]): void {
    const { maxZIndex, minZIndex } = store.getState().board;
    const maxIndex = Math.max(...indices);
    const minIndex = Math.min(...indices);
    if (maxIndex > maxZIndex) store.dispatch(setMaxZIndex(maxIndex));
    if (minIndex < minZIndex) store.dispatch(setMinZIndex(minIndex));
}

export default updateMaxZIndices;
