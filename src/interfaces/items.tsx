export type Point = 'P0' | 'P1' | 'P2' | 'P3';

export type BoardItemType = 'text' | 'shape' | 'note' | 'drawing';
type ItemType = BoardItemType | 'chat';
interface ItemBase {
    type: ItemType;
    id?: string;
    creationDate?: Date;
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

export interface ShapeStyle {
    lineWidth: number;
    lineColor: string;
    fillColor: string;
}

export interface NoteStyle {
    color: string;
    size: number;
}

export interface DrawingStyle {
    color: string;
    width: number;
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

export interface Text extends ItemBase, Coordinates {
    type: 'text';
    text: TextData;
}

export interface Note extends ItemBase, Coordinates, NoteStyle {
    type: 'note';
    text?: TextData;
}

export type ShapeType = 'rect' | 'circle' | 'roundedRect' | 'romboid' | 'triangle' | 'bubble';
export interface Shape extends ItemBase, ShapeStyle, Coordinates {
    type: 'shape';
    shapeType: ShapeType;
    text?: TextData;
}

export interface Drawing extends ItemBase, Coordinates, DrawingStyle {
    type: 'drawing';
    points: [number, number][];
}

export interface ChatMessage extends ItemBase {
    type: 'chat';
    content: string;
    from: string;
}

// Items created by users
export type BoardItem = Note | Text | Shape | Drawing;
export type Item = BoardItem | ChatMessage;
