import { BoardItem } from '../interfaces';
import { isPointInsideArea, isPointInsideLine } from '.';

function getItemAtPosition(
    boardX: number,
    boardY: number,
    includeItems: BoardItem[],
    excludeItems: (BoardItem | undefined)[] = [],
): BoardItem | undefined {
    const excludeItemIds = excludeItems.map((item) => item?.id);
    const items = includeItems
        .filter((item) => !excludeItemIds.includes(item.id))
        .sort((a, b) => (a.zIndex > b.zIndex || (a.zIndex === b.zIndex && a.creationDate > b.creationDate) ? -1 : 1));

    return items.find((item) =>
        item.type === 'line' ? isPointInsideLine(boardX, boardY, item) : isPointInsideArea(boardX, boardY, item),
    );
}

export default getItemAtPosition;
