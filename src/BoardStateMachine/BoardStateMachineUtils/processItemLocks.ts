import { store } from '../../store/store';
import { LockData } from '../../interfaces';
import { setItemsLock, removeSyncData } from '../../store/slices/connectionSlice';
import { setCurrentAction } from '../../store/slices/boardSlice';
import { selectItems } from '../../BoardStateMachine/BoardStateMachineUtils';

// process incoming WSLockMessages from BE to make sure user has not selected somenthing locked by someone else

function processItemLock(data: LockData, userId: string): void {
    const { getState, dispatch } = store;
    const { userId: ownId, itemsLock } = getState().connection;

    const newItemsLock = { ...itemsLock };
    const { lockState, itemIds } = data;

    if (lockState) {
        itemIds.forEach((id) => (newItemsLock[id] = userId));
        if (userId !== ownId) {
            // remove selected items that are now locked by a different user
            const { selectedItemIds } = getState().items;
            const removedIds: string[] = [];
            itemIds.forEach((id) => {
                if (selectedItemIds.includes(id)) removedIds.push(id);
            });
            if (removedIds.length) {
                const newSelectedIds = selectedItemIds.filter((id) => !removedIds.includes(id));
                selectItems(newSelectedIds);
                newSelectedIds.length === 0 && dispatch(setCurrentAction('IDLE'));
            }
            // dataToSync accumulated for those items is now invalid
            removedIds.length && dispatch(removeSyncData(removedIds));
        }
    } else {
        itemIds.forEach((id) => delete newItemsLock[id]);
    }
    dispatch(setItemsLock(newItemsLock));
}

export default processItemLock;
