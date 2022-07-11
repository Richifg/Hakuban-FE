import { store } from '../store/store';
import { getMaxCoordinates } from '../utils';

function drawItemHighlights(ctx: CanvasRenderingContext2D): void {
    const { canvasTransform, currentAction } = store.getState().board;
    const { items, selectedItemIds } = store.getState().items;
    const selectedItems = selectedItemIds.map((id) => items[id]);

    // lines should not highlight when resizing
    const highligthableItems = currentAction !== 'RESIZE' ? selectedItems : selectedItems.filter(({ type }) => type !== 'line');

    if (highligthableItems.length) {
        ctx.save();

        // highlight for the whole group
        ctx.strokeStyle = '#008cff';
        ctx.lineWidth = 2 / canvasTransform.scale;
        ctx.beginPath();
        const { maxX, minX, maxY, minY } = getMaxCoordinates(selectedItems);
        ctx.rect(minX, minY, maxX - minX, maxY - minY);
        ctx.stroke();

        // individual items are highlighted only if more than one is selected
        if (selectedItems.length > 1) {
            ctx.strokeStyle = '#3ca4fa';
            ctx.lineWidth = 1 / canvasTransform.scale;
            ctx.beginPath();
            selectedItems.forEach((item) => {
                const { x0, y0, x2, y2 } = item;
                ctx.rect(x0, y0, x2 - x0, y2 - y0);
            });
            ctx.stroke();
        }

        ctx.restore();
    }
}

export default drawItemHighlights;
