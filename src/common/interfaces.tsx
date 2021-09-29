// Items created by users
export interface Item {
    id?: string;
    itemType: string;
    content: string;
    coordinates: string;
    from: string;
}

// Messages sent through ws
export interface WSMessage {
    type: 'error' | 'item' | 'collection' | 'id';
    error?: string;
    item?: Item;
    items?: Item[];
    id?: string;
}

export interface ChatMessage {
    content: string;
    from: string;
}
