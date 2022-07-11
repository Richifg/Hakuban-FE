import { BoardItem, StoreLineConnections } from '../interfaces';

function isItemDraggable(item: BoardItem, lineConnections: StoreLineConnections, connectionIdExceptions: string[] = []): boolean {
    return (
        item.type !== 'line' ||
        !lineConnections[item.id] ||
        Object.values(lineConnections[item.id]).every((id) => connectionIdExceptions.includes(id))
    );
}

export default isItemDraggable;
