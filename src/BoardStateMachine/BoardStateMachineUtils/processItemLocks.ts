import { store } from '../../store/store';
import { LockData } from '../../interfaces';
import { setItemsLock, removeSyncData, syncData } from '../../store/slices/connectionSlice';
import { setCurrentAction } from '../../store/slices/boardSlice';
import { selectItems } from '../../BoardStateMachine/BoardStateMachineUtils';

// process incoming WSLockMessages from BE to make sure user has not selected somenthing locked by someone else

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
                selectItems();
                newSelectedIds.length === 0 && dispatch(setCurrentAction('IDLE'));
            }
            // dataToSync accumulated for those items is now invalid
            removedIds.length && dispatch(removeSyncData(removedIds));
        }
    } else {
        itemIds.forEach((id) => delete newItemsLock[id]);
    }
    dispatch(setItemsLock(newItemsLock));

    // sync data for new confirmed locks
    const { inProgress } = getState().items;
    if (!inProgress && ownLock) dispatch(syncData());
}

export default processItemLock;
