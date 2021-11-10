export type Point = 'P0' | 'P1' | 'P2' | 'P3';

interface ItemBase {
    type: string;
    id?: string;
    creationDate?: Date;
}

export interface Note extends ItemBase {
    type: 'note';
    content: string;
    x0: number;
    y0: number;
    height: number;
    width: number;
    color: string;
}

export interface Text extends ItemBase {
    type: 'text';
    content: string;
    x0: number;
    y0: number;
    fontSize: string;
    color: string;
}

export interface ChatMessage extends ItemBase {
    type: 'chat';
    content: string;
    from: string;
}

interface Style {
    lineWidth?: number;
    lineColor?: string;
    fillColor?: string;
}

interface BasicShape {
    x0: number;
    y0: number;
    x2: number;
    y2: number;
}

export interface Rect extends Style, BasicShape {
    type: 'shape';
    shapeType: 'rect';
}

export interface Circle extends Style, BasicShape {
    type: 'shape';
    shapeType: 'circle';
}

export type Shape = ItemBase & (Circle | Rect);

// Items created by users
export type BoardItem = Note | Text | Shape;
export type Item = BoardItem | ChatMessage;
