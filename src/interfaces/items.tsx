export type Point = 'P0' | 'P1' | 'P2' | 'P3';

type BoardItemType = 'note' | 'text' | 'shape';
type ItemType = BoardItemType | 'chat';
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

export type Align = 'start' | 'center' | 'end';
export interface TextStyle {
    fontSize: number;
    fontFamily: string;
    color: string;
    hAlign: Align;
    vAlign: Align;
    italic?: boolean;
    bold?: boolean;
    skipRendering?: boolean;
}

export interface Coordinates {
    x0: number;
    y0: number;
    x2: number;
    y2: number;
}

export interface TextData extends TextStyle {
    content: string;
}

export interface Note extends ItemBase, Coordinates {
    type: 'note';
    color: string;
    text?: TextData;
}

export interface Text extends ItemBase, Coordinates {
    type: 'text';
    text: TextData;
}

export type ShapeType = 'rect' | 'circle' | 'roundedRect' | 'star' | 'romboid' | 'triangle' | 'bubble';
export interface Shape extends ItemBase, ShapeStyle, Coordinates {
    type: 'shape';
    shapeType: ShapeType;
    text?: TextData;
}

export interface ChatMessage extends ItemBase {
    type: 'chat';
    content: string;
    from: string;
}

// Items created by users
export type BoardItem = Note | Text | Shape;
export type Item = BoardItem | ChatMessage;
