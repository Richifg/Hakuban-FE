import { BoardItem, StoreLineConnections } from '../interfaces';

function isItemDraggable(item: BoardItem, lineConnections: StoreLineConnections): boolean {
    return item.type !== 'line' || !lineConnections[item.id];
}

export default isItemDraggable;
