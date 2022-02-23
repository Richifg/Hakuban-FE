import { CanvasTransform, CanvasSize } from '../interfaces';

const GRID_SIZE = 100; //px
function drawGrid(transform: CanvasTransform, size: CanvasSize, ctx: CanvasRenderingContext2D): void {
    const { width, height } = size;
    const { scale, dX, dY } = transform;

    const [initX, initY] = [-GRID_SIZE - dX / scale, -GRID_SIZE - dY / scale];
    const [endX, endY] = [GRID_SIZE + (width - dX) / scale, GRID_SIZE + (height - dY) / scale];
    const [offsetX, offsetY] = [(dX / scale) % GRID_SIZE, (dY / scale) % GRID_SIZE];

    ctx.restore();
    ctx.beginPath();
    ctx.strokeStyle = '#f0f0f0';
    for (let x = initX + offsetX; x < endX; x += GRID_SIZE) {
        ctx.moveTo(x, initY);
        ctx.lineTo(x, endY);
    }
    for (let y = initY + offsetY; y < endY; y += GRID_SIZE) {
        ctx.moveTo(initX, y);
        ctx.lineTo(endX, y);
    }
    ctx.stroke();
}

export default drawGrid;
