import { BoardItem, Shape, Text } from '../interfaces';
import { isConnectableItem, isTextItem } from '.';

const CONNECTION_KEY: keyof Shape = 'connections';
const TEXT_KEY: keyof Text = 'text';
const PROGRESS_KEY: keyof BoardItem = 'inProgress';

function areKeysValid(key: string | string[], item: BoardItem): boolean {
    const keys = Array.isArray(key) ? key : [key];
    return keys.every(
        (key) =>
            key in item ||
            key === PROGRESS_KEY ||
            (key === CONNECTION_KEY && isConnectableItem(item)) ||
            (key === TEXT_KEY && isTextItem(item)),
    );
}

export default areKeysValid;
