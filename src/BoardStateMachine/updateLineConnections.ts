import { store } from '../store/store';
import { BoardItem } from '../interfaces';
import { addItem } from '../store/slices/itemsSlice';

// updates the coordinates of the Lines to wich an item is connected

function updateLineConnections(item: BoardItem): void {
    if ('connections' in item) {
        const { items } = store.getState().items;
        item.connections?.forEach(([id, point, dX, dY]) => {
            const { x0, x2, y0, y2 } = item;
            const line = items[id];
            if (line.type === 'line') {
                const updatedLine = { ...line };
                const x = dX + Math.min(x0, x2);
                const y = dY + Math.min(y0, y2);
                if (point === 'P0') {
                    updatedLine.x0 = x;
                    updatedLine.y0 = y;
                } else {
                    updatedLine.x2 = x;
                    updatedLine.y2 = y;
                }
                store.dispatch(addItem(updatedLine));
            }
        });
    }
}

export default updateLineConnections;
