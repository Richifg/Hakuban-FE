import { store } from '../../store/store';
import { setBoardLimits } from '../../store/slices/boardSlice';
import { BoardItem, Coordinates, UpdateData } from '../../interfaces';
import { getMaxCoordinates, getFarthestLimitFromItems } from '../../utils';
import { COORDINATE_KEYS, BOARD_PADDING } from '../../constants';

function updateBoardLimits(updates: (BoardItem | UpdateData)[], areItemsDeleted = false): void {
    const { boardLimits } = store.getState().board;
    const items = Object.values(store.getState().items.items);
    let hasUpdated = false;

    // deep copy current boardLimits without JSON.stringify (stringify turns Infinity to null)
    const updatedLimits = Object.fromEntries(
        Object.entries(boardLimits).map(([key, value]) => [key, { ...value }]),
    ) as typeof boardLimits;

    updates.forEach((update) => {
        if (COORDINATE_KEYS.some((key) => Object.keys(update).includes(key))) {
            hasUpdated = true;
            const { id } = update;
            const { maxX, maxY, minX, minY } = getMaxCoordinates(update as Coordinates);
            const { top, right, bottom, left } = updatedLimits;

            // update limit if item coordinates exceeds previous one
            if (!areItemsDeleted && maxY > bottom.extent - BOARD_PADDING)
                updatedLimits.bottom = { extent: maxY + BOARD_PADDING, itemId: id };
            // or find new limit among all items if item was the previous limit holder
            else if (bottom.itemId === id) updatedLimits.bottom = getFarthestLimitFromItems('bottom', items);

            if (!areItemsDeleted && maxX > right.extent - BOARD_PADDING)
                updatedLimits.right = { extent: maxX + BOARD_PADDING, itemId: id };
            else if (right.itemId === id) updatedLimits.right = getFarthestLimitFromItems('right', items);

            if (!areItemsDeleted && minY < top.extent + BOARD_PADDING)
                updatedLimits.top = { extent: minY - BOARD_PADDING, itemId: id };
            else if (top.itemId === id) updatedLimits.top = getFarthestLimitFromItems('top', items);

            if (!areItemsDeleted && minX < left.extent + BOARD_PADDING)
                updatedLimits.left = { extent: minX - BOARD_PADDING, itemId: id };
            else if (left.itemId === id) updatedLimits.left = getFarthestLimitFromItems('left', items);
        }
    });
    hasUpdated && store.dispatch(setBoardLimits(updatedLimits));
}

export default updateBoardLimits;
