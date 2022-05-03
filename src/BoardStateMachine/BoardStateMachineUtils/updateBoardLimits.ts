import { store } from '../../store/store';
import { setBoardLimits } from '../../store/slices/boardSlice';
import { BoardItem, Coordinates, UpdateData } from '../../interfaces';
import { BOARD_PADDING } from '../../constants';
import { getMaxCoordinates, getFarthestLimitFromItems } from '../../utils';
import { COORDINATE_KEYS } from '../../constants';

function updateBoardLimits(updates: (BoardItem | UpdateData)[], areItemsDeleted = false): void {
    const { boardLimits } = store.getState().board;
    const updatedLimits = { ...boardLimits };
    const itemsArray = Object.values(store.getState().items.items);

    if (updates.length) {
        updates.forEach((update) => {
            if (COORDINATE_KEYS.some((key) => Object.keys(update).includes(key))) {
                const coordinates = update as Coordinates;
                const { id } = update;
                const { maxX, maxY, minX, minY } = getMaxCoordinates(coordinates);
                const { top, right, bottom, left } = boardLimits;

                // update limit if item coordinates exceeds previous one
                if (!areItemsDeleted && maxY > bottom.extent - BOARD_PADDING)
                    updatedLimits.bottom = { extent: maxY + BOARD_PADDING, itemId: id };
                // or find new limit among all items if item was the previous limit holder
                else if (bottom.itemId === id) updatedLimits.bottom = getFarthestLimitFromItems('bottom', itemsArray);

                if (!areItemsDeleted && maxX > right.extent - BOARD_PADDING)
                    updatedLimits.right = { extent: maxX + BOARD_PADDING, itemId: id };
                else if (right.itemId === id) updatedLimits.right = getFarthestLimitFromItems('right', itemsArray);

                if (!areItemsDeleted && minY < top.extent + BOARD_PADDING)
                    updatedLimits.top = { extent: minY - BOARD_PADDING, itemId: id };
                else if (top.itemId === id) updatedLimits.top = getFarthestLimitFromItems('top', itemsArray);

                if (!areItemsDeleted && minX < left.extent + BOARD_PADDING)
                    updatedLimits.left = { extent: minX - BOARD_PADDING, itemId: id };
                else if (left.itemId === id) updatedLimits.left = getFarthestLimitFromItems('left', itemsArray);
            }
        });
    }
    store.dispatch(setBoardLimits(updatedLimits));
}

export default updateBoardLimits;
