import { store } from '../../store/store';
import { WSService } from '../../services';
import { setSelectedItemIds } from '../../store/slices/itemsSlice';

function selectItems(ids?: string | string[]): void {
    const { inProgress } = store.getState().items;
    const { itemsLock, userId: ownId } = store.getState().connection;

    const newSelectedItemIds: string[] = [];
    if (Array.isArray(ids)) newSelectedItemIds.push(...ids);
    else if (typeof ids === 'string') newSelectedItemIds.push(ids);

    // filter out ids locked by someone else
    const validSelectedIds = newSelectedItemIds.filter((id) => !itemsLock[id] || itemsLock[id] === ownId);

    // update store selection
    store.dispatch(setSelectedItemIds(validSelectedIds));

    if (!inProgress) {
        // lock newly selectedIds which are not yet lock
        if (validSelectedIds.length) {
            const unLockedIds = validSelectedIds.filter((id) => !itemsLock[id]);
            unLockedIds.length && WSService.lockItems({ itemIds: unLockedIds, lockState: true });
        }

        // unlock unselectedIds which are locked
        const itemsLockEntries = Object.entries(itemsLock);
        if (itemsLockEntries.length) {
            const ownLockedIds = itemsLockEntries.filter(([, userId]) => ownId === userId).map(([itemId]) => itemId);
            const unselectedIds = ownLockedIds.filter((id) => !validSelectedIds.includes(id));
            unselectedIds.length && WSService.lockItems({ itemIds: unselectedIds, lockState: false });
        }
    }
}

export default selectItems;
