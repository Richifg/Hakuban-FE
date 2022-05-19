import { store } from '../store/store';
import { getBoardCoordinates } from '../utils';

function drawDragSelectArea(ctx: CanvasRenderingContext2D): void {
    const { cursorPosition, canvasTransform } = store.getState().board;
    const { dragOffset } = store.getState().items;
    ctx.save();
    ctx.strokeStyle = '#0000ff';
    ctx.fillStyle = '#4fa7fa33';
    ctx.lineWidth = 2 / canvasTransform.scale;

    ctx.beginPath();
    const [cursorX, cursorY] = getBoardCoordinates(cursorPosition.x, cursorPosition.y, canvasTransform);
    ctx.rect(cursorX, cursorY, dragOffset.x - cursorX, dragOffset.y - cursorY);
    ctx.stroke();
    ctx.fill();

    ctx.restore();
}

export default drawDragSelectArea;
