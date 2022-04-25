import { store } from '../../store/store';
import { BoardItem } from '../../interfaces';
import { addItem } from '../../store/slices/itemsSlice';

// updates the coordinates of the Lines to wich an item is connected

function updateLineConnections(item: BoardItem, inProgress = true): BoardItem[] {
    const updatedLines: BoardItem[] = [];
    if ('connections' in item) {
        const { items } = store.getState().items;
        item.connections?.forEach(([id, point, pX, pY]) => {
            const { x0, x2, y0, y2 } = item;
            const [width, height] = [Math.abs(x2 - x0), Math.abs(y2 - y0)];
            const line = items[id];
            if (line.type === 'line') {
                const updatedLine = { ...line };
                const x = Math.min(x0, x2) + width * pX;
                const y = Math.min(y0, y2) + height * pY;
                if (point === 'P0') {
                    updatedLine.x0 = x;
                    updatedLine.y0 = y;
                } else {
                    updatedLine.x2 = x;
                    updatedLine.y2 = y;
                }
                updatedLine.inProgress = inProgress;

                store.dispatch(addItem(updatedLine));
                updatedLines.push(updatedLine);
            }
        });
    }
    return updatedLines;
}

export default updateLineConnections;
