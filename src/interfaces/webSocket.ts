import { BoardItem, ChatMessage } from './items';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type UpdateData = { id: string; [key: string]: any };

export type LockData = { itemIds: string[]; lockState: boolean };

interface WSBaseMessage {
    userId: string;
}

interface WSAddMessage extends WSBaseMessage {
    type: 'add';
    content: BoardItem[];
}

interface WSUpdateMessage extends WSBaseMessage {
    type: 'update';
    content: UpdateData[];
}

interface WSDeleteMessage extends WSBaseMessage {
    type: 'delete';
    content: string[];
}

interface WSIdMessage extends WSBaseMessage {
    type: 'id';
    content: string;
    userId: 'admin';
}

interface WSChatMessage extends WSBaseMessage {
    type: 'chat';
    content: ChatMessage;
}

interface WSLockMessage extends WSBaseMessage {
    type: 'lock';
    content: LockData;
}

interface WSErrorMessage extends WSBaseMessage {
    type: 'error';
    content: string;
    userId: 'admin';
}

// Messages sent via webSocket
export type WSMessage =
    | WSAddMessage
    | WSUpdateMessage
    | WSDeleteMessage
    | WSIdMessage
    | WSChatMessage
    | WSLockMessage
    | WSErrorMessage;
