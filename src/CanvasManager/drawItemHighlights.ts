import { BoardItem, CanvasTransform } from '../interfaces';
import { getMaxCoordinates } from '../utils';

function drawItemHighlights(selectedItems: BoardItem[], transform: CanvasTransform, ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.strokeStyle = '#008cff';
    ctx.lineWidth = 2 / transform.scale;

    ctx.beginPath();
    // highlight for each item
    selectedItems.forEach((item) => {
        const { x0, y0, x2, y2 } = item;
        ctx.rect(x0, y0, x2 - x0, y2 - y0);
    });

    // highlight for whole selection
    if (selectedItems.length > 1) {
        const { maxX, minX, maxY, minY } = getMaxCoordinates(selectedItems);
        ctx.rect(minX, minY, maxX - minX, maxY - minY);
    }
    ctx.stroke();
    ctx.restore();
}

export default drawItemHighlights;
