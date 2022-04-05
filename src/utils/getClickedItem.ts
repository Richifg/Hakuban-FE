import { BoardItem } from '../interfaces';
import { isPointInsideArea, getDistanceToLine } from '../utils';

const LINE_CLICK_DISTANCE = 10; //px

function getClickedItem(boardX: number, boardY: number, items: BoardItem[]): BoardItem | undefined {
    const sortedItems = items.sort((a, b) =>
        a.zIndex > b.zIndex || (a.zIndex === b.zIndex && a.creationDate > b.creationDate) ? -1 : 1,
    );
    return sortedItems.find((item) =>
        item.type === 'line'
            ? getDistanceToLine(item, boardX, boardY) <= LINE_CLICK_DISTANCE + item.lineWidth
            : isPointInsideArea(boardX, boardY, item),
    );
}

export default getClickedItem;
