import type { BoardItem } from '../interfaces/items';
import type { CanvasTransform, CanvasSize } from '../interfaces/board';
import drawShape from './drawShape';
import drawText from './drawText';
import drawNote from './drawNote';
import { getTextAreaCoordinates } from '../utils';

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
    animationId?: number;

    constructor(ctx: CanvasRenderingContext2D, size: CanvasSize, transform: CanvasTransform, items: BoardItem[]) {
        this.ctx = ctx;
        this.size = size;
        this.transform = transform;
        this.items = items;
    }

    drawItem(item: BoardItem): void {
        this.ctx.save();
        const { type, text, x0, x2, y0, y2 } = item;
        if (type === 'text' && !item.text.skipRendering) {
            drawText(item.text, { x0, x2, y0, y2 }, this.ctx);
        } else if (type === 'shape' || type === 'note') {
            if (type === 'shape') drawShape(item, this.ctx);
            else drawNote(item, this.ctx);
            // draw text for shape/note
            if (text && !text.skipRendering) {
                const coordinates = getTextAreaCoordinates(item);
                drawText(text, coordinates, this.ctx);
            }
        }
        this.ctx.restore();
    }
    transformCanvas(): void {
        const { scale, dX, dY } = this.transform;
        this.ctx.setTransform(scale, 0, 0, scale, dX, dY);
    }

    clear(): void {
        const { width, height } = this.size;
        this.ctx.save();
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.clearRect(0, 0, width, height);
        this.ctx.restore();
    }

    animate(): void {
        this.clear();
        this.transformCanvas();
        this.items.forEach((item) => this.drawItem(item));
        this.animationId = requestAnimationFrame(this.animate.bind(this));
    }

    stop(): void {
        this.animationId && cancelAnimationFrame(this.animationId);
    }
}

export default CanvasManager;
