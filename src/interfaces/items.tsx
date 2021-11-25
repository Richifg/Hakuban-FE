export type Point = 'P0' | 'P1' | 'P2' | 'P3';
export type Align = 'start' | 'center' | 'end';

interface ItemBase {
    type: string;
    id?: string;
    creationDate?: Date;
}

export interface ShapeStyle {
    lineWidth?: number;
    lineColor?: string;
    fillColor?: string;
}

export interface TextStyle {
    fontSize?: number;
    fontFamily?: string;
    hAlign?: Align;
    vAlign?: Align;
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

export interface Text extends ItemBase, TextStyle, Coordinates {
    type: 'text';
    content: string;
}

export interface ChatMessage extends ItemBase {
    type: 'chat';
    content: string;
    from: string;
}

export interface Rect extends ItemBase, ShapeStyle, Coordinates {
    type: 'shape';
    shapeType: 'rect';
}

export interface Circle extends ItemBase, ShapeStyle, Coordinates {
    type: 'shape';
    shapeType: 'circle';
}

export type Shape = Circle | Rect;

// Items created by users
export type BoardItem = Note | Text | Shape;
export type Item = BoardItem | ChatMessage;
