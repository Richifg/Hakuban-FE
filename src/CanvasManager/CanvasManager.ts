import type { Circle, Rect, Item, Text } from '../interfaces/items';
import type { CanvasTransform, CanvasSize } from '../interfaces/board';
import { getWrappedTextLines } from '../utils';

const LINE_HEIGHT = 5;

/*
    Manages the animation cycle of a canvas html element, by constantly
     - clearing screen
     - transforming canvas (scale, translate)
     - and drawing items on screen
    Uses animationFrames to make it look smooth 
*/

class CanvasManager {
    private ctx: CanvasRenderingContext2D;
    size: CanvasSize;
    transform: CanvasTransform;
    items: Item[];
    animationId?: number;

    constructor(ctx: CanvasRenderingContext2D, size: CanvasSize, transform: CanvasTransform, items: Item[]) {
        this.ctx = ctx;
        this.size = size;
        this.transform = transform;
        this.items = items;
    }

    drawItem(item: Item): void {
        this.ctx.save();
        if (item.type === 'shape') {
            this.ctx.strokeStyle = item.lineColor;
            this.ctx.fillStyle = item.fillColor;
            this.ctx.lineWidth = item.lineWidth;
            if (item.shapeType === 'circle') this.drawCircle(item);
            if (item.shapeType === 'rect') this.drawRect(item);
        } else if (item.type === 'text') {
            this.drawText(item);
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

    drawText(text: Text): void {
        const { content, x0, y0, x2, y2, fontSize, fontFamily, hAlign, vAlign } = text;
        // initial settings and text split into lines
        this.ctx.font = `${fontSize}px ${fontFamily}`;
        this.ctx.textAlign = hAlign;
        this.ctx.textBaseline = 'top';
        const maxWidth = Math.abs(x2 - x0);
        const maxHeight = Math.abs(y2 - y0);
        const textLines = getWrappedTextLines(content + '/nAnother Line here?', maxWidth, this.ctx);
        // ##TODO posisbly simplify this if every line has the same measured height independent of used characters
        const fullTextHeight =
            textLines.reduce((totalHeight, line) => (totalHeight += this.ctx.measureText(line).actualBoundingBoxDescent), 0) +
            LINE_HEIGHT * (textLines.length - 1);

        // clipping region for rendering text
        this.ctx.beginPath();
        this.ctx.rect(x0, y0, maxWidth, maxHeight);
        this.ctx.clip();

        // calculate x position for all lines of text
        let x: number;
        if (hAlign === 'start') x = Math.min(x0, x2);
        else if (hAlign === 'end') x = Math.max(x0, x2);
        else x = Math.min(x0, x2) + maxWidth / 2;

        // calculate y position for the first line of text
        let y: number;
        if (vAlign === 'start') y = Math.min(y0, y2);
        else if (vAlign === 'end') y = Math.max(y0, y2) - fullTextHeight;
        else y = Math.min(y0, y2) + (maxHeight - fullTextHeight) / 2;

        // draw every line, recalculating each time the next y position
        textLines.forEach((text) => {
            this.ctx.fillText(text, x, y);
            const lineHeight = this.ctx.measureText(text).actualBoundingBoxDescent;
            y += lineHeight + LINE_HEIGHT;
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
