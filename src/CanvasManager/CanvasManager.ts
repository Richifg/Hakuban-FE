import type { BoardItem } from '../interfaces/items';
import { store } from '../store/store';
import drawShape from './drawShape';
import drawText from './drawText';
import drawNote from './drawNote';
import drawDrawing from './drawDrawing';
import drawGrid from './drawGrid';
import drawLine from './drawLine';
import drawItemHighlights from './drawItemHighlights';
import drawLockHighlights from './drawLockHighlights';
import drawDragSelectArea from './drawDragSelectArea';
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
    items: BoardItem[];
    animationId?: number;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
        this.items = [];
    }

    clear(): void {
        const { width, height } = store.getState().board.canvasSize;
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.clearRect(0, 0, width, height);
    }

    transformCanvas(): void {
        const { scale, dX, dY } = store.getState().board.canvasTransform;
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
        const { showGrid, currentAction } = store.getState().board;
        const { selectedItemIds } = store.getState().items;
        const { itemsLock } = store.getState().connection;

        this.clear();
        showGrid && drawGrid(this.ctx);

        this.transformCanvas();
        this.items.forEach((item) => this.drawItem(item));

        selectedItemIds.length && drawItemHighlights(this.ctx);
        currentAction === 'DRAGSELECT' && drawDragSelectArea(this.ctx);
        Object.keys(itemsLock).length && drawLockHighlights(this.ctx);

        this.animationId = requestAnimationFrame(this.animate.bind(this));
    }

    stop(): void {
        this.animationId && cancelAnimationFrame(this.animationId);
    }
}

export default CanvasManager;
