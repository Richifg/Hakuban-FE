import { store } from '../../store/store';
import { Line, MainPoint } from '../../interfaces';
import { removeLineConnection } from '../../store/slices/itemsSlice';
import { isConnectableItem } from '../../utils';
import { pushItemChanges } from './';

// removes an item connnection from the selected point of a Line

function disconnectItem(line: Line, point: MainPoint): void {
    const { items, lineConnections } = store.getState().items;
    const connectedItemId = lineConnections?.[line.id]?.[point];
    if (connectedItemId) {
        const itemToDisconnect = { ...items[connectedItemId] };
        if (isConnectableItem(itemToDisconnect)) {
            const connections = itemToDisconnect.connections?.filter(
                ([connId, connPoint]) => connId !== line.id || connPoint !== point,
            );
            pushItemChanges({ id: itemToDisconnect.id, connections });
            store.dispatch(removeLineConnection({ lineId: line.id, point }));
        }
    }
}

export default disconnectItem;
