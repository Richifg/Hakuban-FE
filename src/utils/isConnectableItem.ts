import { BoardItem, BoardItemType, Shape, Text, Note, Drawing } from '../interfaces';

const connectableItemTypes: BoardItemType[] = ['note', 'shape', 'text', 'drawing'];

function isConnectableItem(item?: BoardItem): item is Shape | Text | Note | Drawing {
    return !!(item && connectableItemTypes.includes(item.type));
}

export default isConnectableItem;
