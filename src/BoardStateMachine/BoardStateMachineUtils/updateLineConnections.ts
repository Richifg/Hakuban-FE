import { store } from '../../store/store';
import { BoardItem, UpdateData, Line } from '../../interfaces';
import { isConnectableItem } from '../../utils';
import { pushItemChanges } from './';

// updates the coordinates of the Lines to wich an item is connected

function updateLineConnections(item: BoardItem, inProgress = true): Line[] {
    const updatedLines: Line[] = [];
    if (isConnectableItem(item)) {
        const updateDataArr: UpdateData[] = [];
        const { items } = store.getState().items;
        item.connections?.forEach(([id, point, pX, pY]) => {
            const line = items[id];
            const { x0, x2, y0, y2 } = item;
            const [width, height] = [Math.abs(x2 - x0), Math.abs(y2 - y0)];
            const x = Math.min(x0, x2) + width * pX;
            const y = Math.min(y0, y2) + height * pY;
            {
                const { x0, x2, y0, y2 } = line;
                const updateData: UpdateData = { id, x0, x2, y0, y2, inProgress };
                if (point === 'P0') {
                    updateData.x0 = x;
                    updateData.y0 = y;
                } else {
                    updateData.x2 = x;
                    updateData.y2 = y;
                }
                updateDataArr.push(updateData);
                line.type === 'line' && updatedLines.push({ ...line, ...updateData });
            }
        });
        updateDataArr.length && pushItemChanges(updateDataArr);
    }
    return updatedLines;
}

export default updateLineConnections;
