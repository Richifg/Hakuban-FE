// Items created by users
export interface NewItem {
    itemType: string;
    content: string;
    coordinates: string;
    from: string;
}
export interface Item extends NewItem {
    id: string;
}

// Messages sent through ws
export interface WSMessage {
    type: 'error' | 'item' | 'collection';
    error?: string;
    item?: Item;
    items?: Item[];
}

export interface ChatMessage {
    content: string;
    from: string;
}
