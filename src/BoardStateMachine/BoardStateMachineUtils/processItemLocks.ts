import { store } from '../../store/store';
import { LockData } from '../../interfaces';
import { setItemsLock, removeSyncData, syncData } from '../../store/slices/connectionSlice';
import { setCurrentAction } from '../../store/slices/boardSlice';
import { setSelectedItemIds } from '../../store/slices/itemsSlice';

function processItemLock(data: LockData, userId: string): void {
    const { getState, dispatch } = store;
    const { userId: ownId, itemsLock } = getState().connection;
    const newItemsLock = { ...itemsLock };
    const { lockState, itemIds } = data;
    const ownLock = userId === ownId;

    if (lockState) {
        itemIds.forEach((id) => (newItemsLock[id] = userId));
        if (!ownLock) {
            // removed selected items that are now locked by a different user
            const { selectedItemIds } = getState().items;
            const newSelectedIds: string[] = [];
            const removedIds: string[] = [];
            itemIds.forEach((id) => {
                if (selectedItemIds.includes(id)) removedIds.push(id);
                else newSelectedIds.push(id);
            });
            if (newSelectedIds.length !== selectedItemIds.length) {
                dispatch(setSelectedItemIds(newSelectedIds));
                newSelectedIds.length === 0 && dispatch(setCurrentAction('IDLE'));
            }
            // dataToSync accumlated for those items is now invalid
            removedIds.length && dispatch(removeSyncData(removedIds));
        }
    } else {
        itemIds.forEach((id) => delete newItemsLock[id]);
    }
    dispatch(setItemsLock(newItemsLock));

    // sync data for new confirmed locks
    const { isEditting } = getState().items;
    if (!isEditting && ownLock) dispatch(syncData());
}

export default processItemLock;
