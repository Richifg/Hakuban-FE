import { BoardItem } from '../interfaces';
import { isPointInsideArea, getDistanceToLine } from '.';

// clicking exactly on a 1px line is not easy
const LINE_DISTANCE_THRESHOLD = 10; //px

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
        item.type === 'line'
            ? getDistanceToLine(item, boardX, boardY) <= LINE_DISTANCE_THRESHOLD + item.lineWidth
            : isPointInsideArea(boardX, boardY, item),
    );
}

export default getItemAtPosition;
