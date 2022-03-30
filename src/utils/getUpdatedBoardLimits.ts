import { store } from '../store/store';
import { BoardItem, BoardLimits, Limit } from '../interfaces';
import { getMaxCoordinates } from './';

const BOARD_PADDING = 200; //px

function getUpdatedBoardLimits(item?: BoardItem, items?: BoardItem[]): BoardLimits {
    const { boardLimits } = store.getState().board;
    const itemsArray = items || Object.values(store.getState().items.items);
    const updatedLimits = { ...boardLimits };

    // if an item is provided, update the relevant board limits
    if (item) {
        const { id } = item;
        const { maxX, maxY, minX, minY } = getMaxCoordinates(item);
        const { top, right, bottom, left } = boardLimits;

        // update limit if item coordinates exceeds previous one
        if (maxY > bottom.extent - BOARD_PADDING) updatedLimits.bottom = { extent: maxY + BOARD_PADDING, itemId: id };
        // or find new limit among all items if item was the previous limit holder
        else if (bottom.itemId === id) updatedLimits.bottom = findFarthestLimitFromItems('bottom', itemsArray);

        if (maxX > right.extent - BOARD_PADDING) updatedLimits.right = { extent: maxX + BOARD_PADDING, itemId: id };
        else if (right.itemId === id) updatedLimits.right = findFarthestLimitFromItems('right', itemsArray);

        if (minY < top.extent + BOARD_PADDING) updatedLimits.top = { extent: minY - BOARD_PADDING, itemId: id };
        else if (top.itemId === id) updatedLimits.top = findFarthestLimitFromItems('top', itemsArray);

        if (minX < left.extent + BOARD_PADDING) updatedLimits.left = { extent: minX - BOARD_PADDING, itemId: id };
        else if (left.itemId === id) updatedLimits.left = findFarthestLimitFromItems('left', itemsArray);
    } else {
        // otherwise update all 4 limits
        updatedLimits.bottom = findFarthestLimitFromItems('bottom', itemsArray);
        updatedLimits.right = findFarthestLimitFromItems('right', itemsArray);
        updatedLimits.top = findFarthestLimitFromItems('top', itemsArray);
        updatedLimits.left = findFarthestLimitFromItems('left', itemsArray);
    }

    return updatedLimits;
}

// finds the item with the farthest extent in the provided direction
// for example, direction === left, finds the item with the smallest x coordinate
function findFarthestLimitFromItems(direction: 'top' | 'bottom' | 'right' | 'left', items: BoardItem[]): Limit {
    const isPositiveDirection = direction === 'bottom' || direction === 'right';
    const coordinates = direction === 'right' || direction === 'left' ? (['x2', 'x0'] as const) : (['y2', 'y0'] as const);
    const compareFunction = isPositiveDirection ? Math.max : Math.min;
    const initExtent = isPositiveDirection ? -Infinity : Infinity;

    const newLimit = items.reduce<Limit>(
        (prevLimit, item) => {
            const itemExtent = compareFunction(item[coordinates[0]], item[coordinates[1]]);
            const bestExtent = compareFunction(itemExtent, prevLimit.extent);
            if (bestExtent !== itemExtent) return prevLimit;
            return { extent: itemExtent, itemId: item.id };
        },
        { itemId: '', extent: initExtent },
    );

    newLimit.extent += isPositiveDirection ? BOARD_PADDING : -BOARD_PADDING;
    return newLimit;
}

export default getUpdatedBoardLimits;
