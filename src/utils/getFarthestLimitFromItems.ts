import { BoardItem, Limit } from '../interfaces';
import { BOARD_PADDING } from '../constants';

// finds the item with the farthest extent in the provided direction
// for example, direction === left, finds the item with the smallest x coordinate
function getFarthestLimitFromItems(direction: 'top' | 'bottom' | 'right' | 'left', items: BoardItem[]): Limit {
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

export default getFarthestLimitFromItems;
