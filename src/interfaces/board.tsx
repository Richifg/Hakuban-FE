export type Tool = 'POINTER' | 'SHAPE' | 'PEN' | 'TEXT';

export type Action = 'IDLE' | 'DRAW' | 'DRAG' | 'EDIT' | 'PAN' | 'SLIDE' | 'RESIZE' | 'WRITE';

export type CanvasTransform = { scale: number; dX: number; dY: number };

export type CanvasSize = { width: number; height: number };
