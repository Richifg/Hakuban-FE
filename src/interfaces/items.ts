export type Point = 'P0' | 'P1' | 'P2' | 'P3';

export type LineConnections = [lineId: string, point: 'P0' | 'P2', x: number, y: number][];

export type BoardItemType = 'text' | 'shape' | 'note' | 'drawing' | 'line';

export interface Coordinates {
    x0: number;
    y0: number;
    x2: number;
    y2: number;
}

type ItemType = BoardItemType | 'chat';

interface ItemBase {
    type: ItemType;
    id: string;
    creationDate?: Date;
}

// --TEXT
export type Align = 'start' | 'center' | 'end';
export interface TextStyle {
    fontSize: number;
    fontFamily: string;
    textColor: string;
    hAlign: Align;
    vAlign: Align;
    italic: boolean;
    bold: boolean;
    skipRendering?: boolean;
}
export interface TextData extends TextStyle {
    content: string;
}
export interface Text extends ItemBase, Coordinates {
    type: 'text';
    text: TextData;
    connections?: LineConnections;
}

// --SHAPE
export type ShapeType = 'rect' | 'circle' | 'roundedRect' | 'romboid' | 'triangle' | 'bubble';
export interface ShapeStyle {
    lineWidth: number;
    lineColor: string;
    fillColor: string;
}
export interface Shape extends ItemBase, ShapeStyle, Coordinates {
    type: 'shape';
    shapeType: ShapeType;
    text?: TextData;
    connections?: LineConnections;
}

// --NOTE
export interface NoteStyle {
    fillColor: string;
    size: number;
}
export interface Note extends ItemBase, Coordinates, NoteStyle {
    type: 'note';
    text?: TextData;
    connections?: LineConnections;
}

// --DRAWING
export interface DrawingStyle {
    lineColor: string;
    lineWidth: number;
}
export interface Drawing extends ItemBase, Coordinates, DrawingStyle {
    type: 'drawing';
    points: [number, number][];
    inProgress?: boolean;
    connections?: LineConnections;
}

// --LINE
export type ArrowType = 'none' | 'simple' | 'triangle' | 'circle';
export interface LineStyle {
    lineColor: string;
    lineWidth: number;
    arrow0Type: ArrowType;
    arrow2Type: ArrowType;
}
export interface Line extends ItemBase, Coordinates, LineStyle {
    type: 'line';
}

// --CHAT
export interface ChatMessage extends ItemBase {
    type: 'chat';
    content: string;
    from: string;
}

// items drawn on the board with coordinates
export type BoardItem = Note | Text | Shape | Drawing | Line;

// general Item type for any item that users can create
export type Item = BoardItem | ChatMessage;
