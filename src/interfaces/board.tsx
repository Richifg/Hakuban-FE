export type Tool = 'POINTER' | 'SHAPE' | 'PEN';

export type Action = 'IDLE' | 'DRAW' | 'DRAG' | 'EDIT' | 'PAN' | 'SLIDE' | 'RESIZE';

export type CanvasTransform = { scale: number; dX: number; dY: number };

export type CanvasSize = { width: number; height: number };
