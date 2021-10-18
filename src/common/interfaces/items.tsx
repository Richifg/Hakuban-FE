interface ItemBase {
    id?: string;
    creationDate?: Date;
}

export interface Note extends ItemBase {
    type: 'note';
    content: string;
    x: number;
    y: number;
    height: number;
    width: number;
    color: string;
}

export interface Text extends ItemBase {
    type: 'text';
    content: string;
    x: number;
    y: number;
    fontSize: string;
    color: string;
}

export interface ChatMessage extends ItemBase {
    type: 'chat';
    content: string;
    from: string;
}

interface Style {
    strokeWidth?: number;
    strokeColor?: string;
    backgroundColor?: string;
}

export interface Rect extends Style {
    type: 'shape';
    shapeType: 'rect';
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface Circle extends Style {
    type: 'shape';
    shapeType: 'circle';
    cX: number;
    cY: number;
    rX: number;
    rY: number;
}

export type Shape = ItemBase & (Circle | Rect);

// Items created by users
export type Item = Note | Text | Shape | ChatMessage;
