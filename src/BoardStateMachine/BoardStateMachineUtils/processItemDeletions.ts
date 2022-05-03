import { store } from '../../store/store';
import { BoardItem } from '../../interfaces';
import { deleteItems } from '../../store/slices/itemsSlice';
import { WSService } from '../../services';
import { updateLineConnections, updateBoardLimits } from './';

function processItemDeletions(ids: string | string[], blockSync = false): void {
    const oldItems: BoardItem[] = [];
    const idsArray = Array.isArray(ids) ? ids : [ids];
    const { items, inProgress } = store.getState().items;
    idsArray.forEach((id) => {
        const oldItem = items[id];
        oldItems.push(oldItem);
    });

    store.dispatch(deleteItems(idsArray));
    updateLineConnections(oldItems);

    !inProgress && updateBoardLimits(oldItems, true);
    !blockSync && WSService.deleteItems(idsArray);
}

export default processItemDeletions;
