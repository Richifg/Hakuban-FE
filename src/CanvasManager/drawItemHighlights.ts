import { store } from '../store/store';
import { getMaxCoordinates } from '../utils';

function drawItemHighlights(ctx: CanvasRenderingContext2D): void {
    const { canvasTransform } = store.getState().board;
    const { items, selectedItemIds } = store.getState().items;
    const selectedItems = selectedItemIds.map((id) => items[id]);

    ctx.save();
    ctx.strokeStyle = '#008cff';
    ctx.lineWidth = 2 / canvasTransform.scale;

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
