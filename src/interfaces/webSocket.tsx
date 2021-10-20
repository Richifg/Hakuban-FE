import { Item } from './items';

interface WSItemMessage {
    type: 'item';
    content: Item;
}

interface WSCollectionMessage {
    type: 'collection';
    content: Item[];
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
export type WSMessage = WSItemMessage | WSCollectionMessage | WSIdMessage | WSErrorMessage;
