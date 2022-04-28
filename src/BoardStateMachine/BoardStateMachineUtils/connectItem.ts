import { store } from '../../store/store';
import { BoardItem, Line, MainPoint } from '../../interfaces';
import { addLineConnection } from '../../store/slices/itemsSlice';
import { isConnectableItem } from '../../utils';
import { disconnectItem, pushItemChanges } from './';

// adds a Line connection to an item and returns the updated item

function connectItem(itemToConnect: BoardItem, line: Line, point: MainPoint, boardX: number, boardY: number): void {
    if (isConnectableItem(itemToConnect)) {
        // line may have a previous connection which needs to be removed
        disconnectItem(line, point);

        // get relative connection coordinate
        const connectedItem = { ...itemToConnect };
        if (!connectedItem.connections) connectedItem.connections = [];
        const { id, x0, y0, x2, y2 } = connectedItem;
        const [minX, minY] = [Math.min(x0, x2), Math.min(y0, y2)];
        const [width, height] = [Math.abs(x2 - x0), Math.abs(y2 - y0)];
        const [x, y] = [parseFloat(((boardX - minX) / width).toFixed(2)), parseFloat(((boardY - minY) / height).toFixed(2))];
        const connections = [...connectedItem.connections, [line.id, point, x, y]];

        pushItemChanges({ id, connections });
        store.dispatch(addLineConnection({ lineId: line.id, point, itemId: connectedItem.id }));
    }
}

export default connectItem;
