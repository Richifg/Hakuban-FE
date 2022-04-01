import { BoardItem } from '../interfaces';

function isItemDraggable(item: BoardItem, lineConnections: { [id: string]: { [point: string]: string } }): boolean {
    return item.type !== 'line' || !lineConnections[item.id];
}

export default isItemDraggable;
