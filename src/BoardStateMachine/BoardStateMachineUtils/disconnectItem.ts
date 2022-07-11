import { store } from '../../store/store';
import { Line, MainPoint, UpdateData } from '../../interfaces';
import { isConnectableItem } from '../../utils';

// removes an item connnection from the selected point of a Line

function disconnectItem(line: Line, point: MainPoint): UpdateData | undefined {
    const { items, lineConnections } = store.getState().items;
    const connectedItemId = lineConnections?.[line.id]?.[point];
    if (connectedItemId) {
        const itemToDisconnect = { ...items[connectedItemId] };
        if (isConnectableItem(itemToDisconnect)) {
            const connections = itemToDisconnect.connections?.filter(
                ([connId, connPoint]) => connId !== line.id || connPoint !== point,
            );
            return { id: itemToDisconnect.id, connections };
        }
    }
}

export default disconnectItem;
