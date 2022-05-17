import type { BoardItem } from '../interfaces/items';
import type { CanvasTransform, CanvasSize } from '../interfaces/board';
import drawShape from './drawShape';
import drawText from './drawText';
import drawNote from './drawNote';
import drawDrawing from './drawDrawing';
import drawGrid from './drawGrid';
import drawLine from './drawLine';
import drawItemHighlights from './drawItemHighlights';
import { getTextAreaCoordinates, isTextItem } from '../utils';

/*
    Manages the animation cycle of a canvas html element by constantly:
     - clearing screen
     - transforming canvas (scale, translate)
     - and drawing items on screen 
    Uses animationFrames to keep a consistent framerate 
*/

class CanvasManager {
    private ctx: CanvasRenderingContext2D;
    size: CanvasSize;
    transform: CanvasTransform;
    items: BoardItem[];
    selectedItems: BoardItem[];
    showGrid: boolean;
    animationId?: number;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
        this.size = { width: 0, height: 0 };
        this.transform = { scale: 1, dX: 0, dY: 0 };
        this.items = [];
        this.selectedItems = [];
        this.showGrid = true;
    }

    clear(): void {
        const { width, height } = this.size;
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.clearRect(0, 0, width, height);
    }

    transformCanvas(): void {
        const { scale, dX, dY } = this.transform;
        this.ctx.setTransform(scale, 0, 0, scale, dX, dY);
    }

    drawItem(item: BoardItem): void {
        this.ctx.save();

        const { type } = item;
        if (type === 'shape') drawShape(item, this.ctx);
        else if (type === 'note') drawNote(item, this.ctx);
        else if (type === 'drawing') drawDrawing(item, this.ctx);
        else if (type === 'line') drawLine(item, this.ctx);

        if (isTextItem(item) && item.text) {
            const coordinates = getTextAreaCoordinates(item);
            drawText(item.text, coordinates, this.ctx);
        }

        this.ctx.restore();
    }

    animate(): void {
        this.clear();
        this.showGrid && drawGrid(this.transform, this.size, this.ctx);

        this.transformCanvas();
        this.items.forEach((item) => this.drawItem(item));

        this.selectedItems.length && drawItemHighlights(this.selectedItems, this.transform, this.ctx);
        this.animationId = requestAnimationFrame(this.animate.bind(this));
    }

    stop(): void {
        this.animationId && cancelAnimationFrame(this.animationId);
    }
}

export default CanvasManager;
