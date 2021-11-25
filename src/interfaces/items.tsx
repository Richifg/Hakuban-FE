export type Point = 'P0' | 'P1' | 'P2' | 'P3';
export type Align = 'start' | 'center' | 'end';
type BoardItemType = 'note' | 'text' | 'shape';
type ItemType = BoardItemType | 'chat';
export type ShapeType = 'rect' | 'circle';

interface ItemBase {
    type: ItemType;
    id?: string;
    creationDate?: Date;
}

export interface ShapeStyle {
    lineWidth: number;
    lineColor: string;
    fillColor: string;
}

export interface TextStyle {
    fontSize: number;
    fontFamily: string;
    hAlign: Align;
    vAlign: Align;
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

interface ShapeBase extends ItemBase, ShapeStyle, Coordinates {
    shapeType: ShapeType;
}

export interface Rect extends ShapeBase {
    type: 'shape';
    shapeType: 'rect';
}

export interface Circle extends ShapeBase {
    type: 'shape';
    shapeType: 'circle';
}

export type Shape = Circle | Rect;

// Items created by users
export type BoardItem = Note | Text | Shape;
export type Item = BoardItem | ChatMessage;
