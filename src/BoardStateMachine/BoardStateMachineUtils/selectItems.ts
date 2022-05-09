import { store } from '../../store/store';
import { WSService } from '../../services';
import { setSelectedItemIds } from '../../store/slices/itemsSlice';

function selectItems(ids?: string | string[]): void {
    const newSelectedItemIds: string[] = [];
    const { inProgress } = store.getState().items;
    const { itemsLock, userId: ownId } = store.getState().connection;

    if (Array.isArray(ids)) newSelectedItemIds.push(...ids);
    if (typeof ids === 'string') newSelectedItemIds.push(ids);

    // update store selection
    store.dispatch(setSelectedItemIds(newSelectedItemIds));

    if (!inProgress) {
        // lock newly selectedIds which are not yet lock
        if (newSelectedItemIds.length) {
            const unLockedIds = newSelectedItemIds.filter((id) => !itemsLock[id]);
            unLockedIds.length && WSService.lockItems({ itemIds: unLockedIds, lockState: true });
        }

        // unlock unselectedIds which are locked
        const itemsLockEntries = Object.entries(itemsLock);
        if (itemsLockEntries.length) {
            const ownLockedIds = itemsLockEntries.filter(([, userId]) => ownId === userId).map(([itemId]) => itemId);
            const unselectedIds = ownLockedIds.filter((id) => !newSelectedItemIds.includes(id));
            unselectedIds.length && WSService.lockItems({ itemIds: unselectedIds, lockState: false });
        }
    }
}

export default selectItems;
