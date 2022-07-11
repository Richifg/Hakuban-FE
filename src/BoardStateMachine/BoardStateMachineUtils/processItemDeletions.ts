import { store } from '../../store/store';
import { deleteItems } from '../../store/slices/itemsSlice';
import { WSService } from '../../services';
import { updateLineConnections, updateBoardLimits } from './';

// process item deletions both from user and from BE
// keeps items, lineConnections and BoardLimits updated

function processItemDeletions(ids: string | string[], blockSync = false): void {
    const { items, inProgress } = store.getState().items;
    const idsArray = Array.isArray(ids) ? ids : [ids];
    const oldItems = idsArray.map((id) => items[id]).filter((i) => !!i);

    if (oldItems.length) {
        store.dispatch(deleteItems(idsArray));
        updateLineConnections(oldItems);
        !inProgress && updateBoardLimits(oldItems, true);
    }

    !blockSync && WSService.deleteItems(idsArray);
}

export default processItemDeletions;
