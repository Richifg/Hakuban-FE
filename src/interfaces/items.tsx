export type Point = 'P0' | 'P1' | 'P2' | 'P3';

interface ItemBase {
    type: string;
    id?: string;
    creationDate?: Date;
}

interface Style {
    lineWidth?: number;
    lineColor?: string;
    fillColor?: string;
}

interface Coordinates {
    x0: number;
    y0: number;
    x2: number;
    y2: number;
}

export interface Note extends ItemBase, Coordinates {
    type: 'note';
    content: string;
    height: number;
    width: number;
    color: string;
}

export interface Text extends ItemBase, Coordinates {
    type: 'text';
    content: string;
    fontSize: string;
}

export interface ChatMessage extends ItemBase {
    type: 'chat';
    content: string;
    from: string;
}

export interface Rect extends ItemBase, Style, Coordinates {
    type: 'shape';
    shapeType: 'rect';
}

export interface Circle extends ItemBase, Style, Coordinates {
    type: 'shape';
    shapeType: 'circle';
}

export type Shape = Circle | Rect;

// Items created by users
export type BoardItem = Note | Text | Shape;
export type Item = BoardItem | ChatMessage;
