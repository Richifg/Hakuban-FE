import { BoardItem, UpdateData } from '../interfaces';
import { isConnectableItem, isTextItem } from '.';
import { CONNECTIONS_KEY, ABSOLUTE_KEY, TEXT_KEY } from '../constants';

function isUpdateDataValid(updateData: UpdateData, item: BoardItem): boolean {
    const keys = Object.keys(updateData);
    return keys.every(
        (key) =>
            key in item ||
            (key === CONNECTIONS_KEY && isConnectableItem(item)) ||
            (key === TEXT_KEY && isTextItem(item)) ||
            (key === ABSOLUTE_KEY && item.type === 'drawing'),
    );
}

export default isUpdateDataValid;
