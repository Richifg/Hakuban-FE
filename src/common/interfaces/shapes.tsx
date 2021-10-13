// possible shapes that can be drawn

export interface Style {
    strokeWidth?: number;
    strokeColor?: string;
    backgroundColor?: string;
}

// possible square store scheme
// "x,y,width,height,strokeWidth,strokeColor,backgroundColor"
export interface Rect {
    type: 'rect';
    x: number;
    y: number;
    width: number;
    height: number;
    style?: Style;
}

export interface Circle {
    type: 'circle';
    cX: number;
    cY: number;
    rX: number;
    rY: number;
    style?: Style;
}

export type Shape = Circle | Rect;
