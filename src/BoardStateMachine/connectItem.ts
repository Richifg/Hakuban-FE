import { store } from '../store/store';
import { BoardItem, Line, MainPoint } from '../interfaces';
import { addItem, addLineConnection } from '../store/slices/itemsSlice';
import { isConnectableItem } from '../utils';

// adds a Line connection to an item

function connectItem(itemToConnect: BoardItem, line: Line, point: MainPoint, boardX: number, boardY: number): void {
    if (isConnectableItem(itemToConnect)) {
        const connectedItem = { ...itemToConnect };
        if (!connectedItem.connections) connectedItem.connections = [];
        const minX = Math.min(connectedItem.x0, connectedItem.x2);
        const minY = Math.min(connectedItem.y0, connectedItem.y2);
        connectedItem.connections = [...connectedItem.connections, [line.id, point, boardX - minX, boardY - minY]];
        store.dispatch(addItem(connectedItem));
        store.dispatch(addLineConnection([line.id, point, connectedItem.id]));
    }
}

export default connectItem;
