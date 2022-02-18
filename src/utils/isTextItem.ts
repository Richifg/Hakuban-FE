import { BoardItem, BoardItemType, Shape, Text, Note } from '../interfaces';

const textTypes: BoardItemType[] = ['note', 'shape', 'text'];

function isTextItem(item?: BoardItem): item is Shape | Text | Note {
    return !!(item && textTypes.includes(item.type));
}

export default isTextItem;
