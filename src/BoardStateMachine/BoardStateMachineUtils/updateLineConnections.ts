import { store } from '../../store/store';
import { BoardItem } from '../../interfaces';
import { setLineConnections } from '../../store/slices/itemsSlice';
import { isConnectableItem } from '../../utils';

// updates line connections on store
function updateLineConnections(oldItems: BoardItem[], newItems: BoardItem[] = []): void {
    let hasUpdated = false;
    // deep copy store line connections
    const { lineConnections } = store.getState().items;
    const newLineConnections: typeof lineConnections = {};
    Object.entries(lineConnections).forEach(([key, value]) => (newLineConnections[key] = { ...value }));
    // delete any connection on old Items
    oldItems.forEach((oldItem) => {
        if (isConnectableItem(oldItem)) {
            const { connections, id } = oldItem;
            if (connections) {
                hasUpdated = true;
                connections.forEach(([lineId, point]) => {
                    if (newLineConnections?.[lineId]?.[point] === id) {
                        delete newLineConnections[lineId][point];
                    }
                });
            }
        }
    });
    // then add all connections on new Items
    newItems.forEach((newItem) => {
        if (isConnectableItem(newItem)) {
            const { connections, id } = newItem;
            if (connections) {
                hasUpdated = true;
                connections.forEach(([lineId, point]) => {
                    if (newLineConnections[lineId]) newLineConnections[lineId][point] = id;
                    else newLineConnections[lineId] = { [point]: id };
                });
            }
        }
    });
    if (hasUpdated) store.dispatch(setLineConnections(newLineConnections));
}

export default updateLineConnections;
