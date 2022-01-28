import type { Circle, Rect, BoardItem, TextData, Coordinates } from '../interfaces/items';
import type { CanvasTransform, CanvasSize } from '../interfaces/board';
import { getWrappedTextLines } from '../utils';

const LINE_HEIGHT = 1.1; // em

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
        const { type, x0, x2, y0, y2 } = item;
        if (type === 'shape') {
            const { shapeType, text } = item;
            this.ctx.strokeStyle = item.lineColor;
            this.ctx.fillStyle = item.fillColor;
            this.ctx.lineWidth = item.lineWidth;
            if (shapeType === 'circle') this.drawCircle(item);
            else if (shapeType === 'rect') this.drawRect(item);
            if (text) this.drawText(text, { x0, x2, y0, y2 });
        } else if (type === 'text') {
            this.drawText(item.text, { x0, x2, y0, y2 });
        }
        this.ctx.restore();
    }

    drawCircle(circle: Circle): void {
        const { x0, y0, x2, y2 } = circle;
        this.ctx.beginPath();
        const [cX, cY] = [Math.floor((x0 + x2) / 2), Math.floor((y0 + y2) / 2)];
        const [rX, rY] = [Math.abs(x2 - cX), Math.abs(y2 - cY)];
        this.ctx.ellipse(cX, cY, rX, rY, 0, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();
    }

    drawRect(rect: Rect): void {
        const { x0, y0, x2, y2 } = rect;
        this.ctx.beginPath();
        this.ctx.rect(x0, y0, x2 - x0, y2 - y0);
        this.ctx.fill();
        this.ctx.stroke();
    }

    drawText(text: TextData, coordinates: Coordinates): void {
        const { content, color, fontFamily, fontSize, vAlign, hAlign } = text;
        const { x0, y0, x2, y2 } = coordinates;
        // initial settings
        this.ctx.font = `bold ${fontSize}px ${fontFamily}`;
        this.ctx.fillStyle = color;
        this.ctx.textAlign = hAlign;
        this.ctx.textBaseline = 'top';
        const [maxWidth, maxHeight] = [Math.abs(x2 - x0), Math.abs(y2 - y0)];
        const [minX, minY] = [Math.min(x0, x2), Math.min(y0, y2)];

        // cut text into wrapped lines
        const textLines = getWrappedTextLines(content, maxWidth, this.ctx);
        const lineHeight = fontSize * LINE_HEIGHT;
        const fullTextHeight = lineHeight * textLines.length;

        // clipping region for rendering text
        this.ctx.beginPath();
        this.ctx.rect(minX, minY, maxWidth, maxHeight);
        this.ctx.clip();

        // calculate x position for all lines of text
        let x: number;
        if (hAlign === 'start') x = minX;
        else if (hAlign === 'end') x = Math.max(x0, x2);
        else x = minX + maxWidth / 2;

        // calculate y position for the first line of text
        let y: number;
        if (vAlign === 'start') y = minY;
        else if (vAlign === 'end') y = Math.max(y0, y2) - fullTextHeight;
        else y = minY + (maxHeight - fullTextHeight) / 2;

        // draw each line
        textLines.forEach((text) => {
            this.ctx.fillText(text, x, y);
            y += lineHeight;
        });
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
