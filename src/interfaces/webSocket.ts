import { Item } from './items';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type UpdateData = { id: string; [key: string]: any };

interface WSInitMessage {
    type: 'init';
    content: Item[];
}

interface WSAddMessage {
    type: 'add';
    content: Item;
}

interface WSUpdateMessage {
    type: 'update';
    content: UpdateData[];
}

interface WSDeleteMessage {
    type: 'delete';
    content: string[];
}

interface WSIdMessage {
    type: 'id';
    content: string;
}

interface WSErrorMessage {
    type: 'error';
    content: string;
}

// Messages sent via webSocket
export type WSMessage = WSInitMessage | WSAddMessage | WSUpdateMessage | WSDeleteMessage | WSIdMessage | WSErrorMessage;
