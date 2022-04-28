import { BoardItem, Shape, Text, Drawing } from '../interfaces';
import { isConnectableItem, isTextItem } from '.';

const ABSOLUTE_KEY: keyof Drawing = 'isAbsolute';
const CONNECTION_KEY: keyof Shape = 'connections';
const TEXT_KEY: keyof Text = 'text';

function areKeysValid(key: string | string[], item: BoardItem): boolean {
    const keys = Array.isArray(key) ? key : [key];
    return keys.every(
        (key) =>
            key in item ||
            (key === CONNECTION_KEY && isConnectableItem(item)) ||
            (key === TEXT_KEY && isTextItem(item)) ||
            (key === ABSOLUTE_KEY && item.type === 'drawing'),
    );
}

export default areKeysValid;
