import { store } from '../../store/store';
import { addItems } from '../../store/slices/itemsSlice';
import { syncData, addSyncData } from '../../store/slices/connectionSlice';
import { updateBoardLimits, updateLineConnections, updateMaxZIndices } from '.';
import { BoardItem, UpdateData } from '../../interfaces';
import { isUpdateDataValid } from '../../utils';

// process item updates both from user and from BE
// keeps items, lineConnections and BoardLimits updated

function processItemUpdates(data: BoardItem | UpdateData | (BoardItem | UpdateData)[], blockSync = false): void {
    const validUpdates: UpdateData[] = []; // updates that can be synced
    const updatedItems: BoardItem[] = []; // items after applying valid updates
    const oldItems: BoardItem[] = []; // items as they were before updates

    const { items, inProgress } = store.getState().items;

    const itemOrUpdates = Array.isArray(data) ? data : [data];
    itemOrUpdates.forEach((data) => {
        if (data.creationDate) {
            const item = data as BoardItem;
            validUpdates.push(item);
            updatedItems.push(item);
        } else {
            const update = data as UpdateData;
            const oldItem = items[update.id];
            if (oldItem && isUpdateDataValid(update, oldItem)) {
                validUpdates.push(update);
                oldItems.push(oldItem);

                const updatedItem = { ...oldItem, ...update } as BoardItem;
                updatedItems.push(updatedItem);
            }
        }
    });
    // inmediatly update store items and lineConnections
    updatedItems.length && store.dispatch(addItems(updatedItems));
    updateLineConnections(oldItems, updatedItems);

    // queue data for later sync if needed
    !blockSync && validUpdates.length && store.dispatch(addSyncData(validUpdates));

    // on final update,
    const updates = Object.values(store.getState().connection.dataToSync);
    if (!inProgress && updates.length) {
        // also update store boardLimits and max/min zIndex
        updates.length && updateBoardLimits(updates);
        const zIndices = updates.map<number>((i) => i.zIndex).filter((i) => !!i);
        zIndices.length && updateMaxZIndices(zIndices);

        // sync data with BE
        !blockSync && store.dispatch(syncData());
    }
}

export default processItemUpdates;
