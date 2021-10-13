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

interface ItemBase {
    id?: string;
    creationDate?: Date;
}

interface Note {
    type: 'note';
    content: string;
    coordinates: string;
    height: number;
    width: number;
    color: string;
}

interface Text {
    type: 'text';
    content: string;
    coordinates: string;
    fontSize: string;
    color: string;
}

export interface Chat {
    type: 'chat';
    content: string;
    from: string;
}

// Items created by users
export type Item = ItemBase & (Note | Text | Chat);
