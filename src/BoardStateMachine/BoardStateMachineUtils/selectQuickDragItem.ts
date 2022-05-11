import { WSService } from '../../services';
import { store } from '../../store/store';
import { setDraggedItemId } from '../../store/slices/itemsSlice';

function selectQuickDragItem(itemId?: string): void {
    const { itemsLock } = store.getState().connection;
    const { draggedItemId } = store.getState().items;
    // lock item if it isnt already
    if (itemId && !itemsLock[itemId]) {
        store.dispatch(setDraggedItemId(itemId));
        WSService.lockItems({ itemIds: [itemId], lockState: true });
        // unlock item if it was previouly locked
    } else if (!itemId && draggedItemId) {
        store.dispatch(setDraggedItemId());
        WSService.lockItems({ itemIds: [draggedItemId], lockState: false });
    }
}

export default selectQuickDragItem;
