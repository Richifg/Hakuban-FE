import { IconName, Tool, ShapeType } from '../../../interfaces';

export const toolOptions: [IconName, Tool][] = [
    ['justifyLeft', 'POINTER'],
    ['pen', 'PEN'],
    ['line', 'LINE'],
    ['note', 'NOTE'],
    ['shapes', 'SHAPE'],
    ['text', 'TEXT'],
];

export const shapeOptions: [IconName, ShapeType][] = [
    ['square', 'rect'],
    ['roundedSquare', 'roundedRect'],
    ['romboid', 'romboid'],
    ['circle', 'circle'],
    ['triangle', 'triangle'],
    ['bubble', 'bubble'],
];
