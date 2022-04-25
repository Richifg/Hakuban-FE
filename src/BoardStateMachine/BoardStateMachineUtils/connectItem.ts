import { store } from '../../store/store';
import { BoardItem, Line, MainPoint } from '../../interfaces';
import { addItem, addLineConnection } from '../../store/slices/itemsSlice';
import { isConnectableItem } from '../../utils';

// adds a Line connection to an item and returns the updated item

function connectItem(itemToConnect: BoardItem, line: Line, point: MainPoint, boardX: number, boardY: number): void {
    if (isConnectableItem(itemToConnect)) {
        const connectedItem = { ...itemToConnect };
        if (!connectedItem.connections) connectedItem.connections = [];
        const { x0, y0, x2, y2 } = connectedItem;
        const [minX, minY] = [Math.min(x0, x2), Math.min(y0, y2)];
        const [width, height] = [Math.abs(x2 - x0), Math.abs(y2 - y0)];
        const [x, y] = [parseFloat(((boardX - minX) / width).toFixed(2)), parseFloat(((boardY - minY) / height).toFixed(2))];
        connectedItem.connections = [...connectedItem.connections, [line.id, point, x, y]];
        store.dispatch(addItem(connectedItem));
        store.dispatch(addLineConnection({ lineId: line.id, point, itemId: connectedItem.id }));
    }
}

export default connectItem;
