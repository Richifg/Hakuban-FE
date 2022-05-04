import { BoardItem, BoardItemType, BoardTextItem } from '../interfaces';

const textTypes: BoardItemType[] = ['note', 'shape', 'text'];

function isTextItem(item?: BoardItem): item is BoardTextItem {
    return !!(item && textTypes.includes(item.type));
}

export default isTextItem;
