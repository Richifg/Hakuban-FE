export type Tool = 'POINTER' | 'SHAPE' | 'PEN' | 'TEXT' | 'NOTE';

export type Action = 'IDLE' | 'DRAW' | 'DRAG' | 'EDIT' | 'PAN' | 'SLIDE' | 'RESIZE';

export type CanvasTransform = { scale: number; dX: number; dY: number };

export type CanvasSize = { width: number; height: number };

export type Limit = { extent: number; itemId?: string };
export type BoardLimits = { top: Limit; right: Limit; bottom: Limit; left: Limit };
