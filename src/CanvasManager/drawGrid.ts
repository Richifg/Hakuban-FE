import { CanvasTransform, CanvasSize } from '../interfaces';

const INIT_GRID_SIZE = 100; //px
const MIN_GRID_RENDER_SIZE = 25; //px

function drawGrid(transform: CanvasTransform, size: CanvasSize, ctx: CanvasRenderingContext2D): void {
    const { width, height } = size;
    const { scale, dX, dY } = transform;

    let smallGridSize = INIT_GRID_SIZE;
    while (smallGridSize * scale < MIN_GRID_RENDER_SIZE) {
        smallGridSize *= 5;
    }

    const [translateToScaleX, translateToScaleY] = [dX / scale, dY / scale];
    const [widthToScale, heightToScale] = [(width - dX) / scale, (height - dY) / scale];

    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = '#f0f0f0';

    // draw grid lines for small and big grid
    [smallGridSize, smallGridSize * 5].forEach((gridSize) => {
        const [offsetX, offsetY] = [translateToScaleX % gridSize, translateToScaleY % gridSize];
        const [initX, initY] = [offsetX - translateToScaleX - gridSize, offsetY - translateToScaleY - gridSize];
        const [endX, endY] = [widthToScale + gridSize, heightToScale + gridSize];

        for (let x = initX; x < endX; x += gridSize) {
            ctx.moveTo(x, initY);
            ctx.lineTo(x, endY);
        }
        for (let y = initY; y < endY; y += gridSize) {
            ctx.moveTo(initX, y);
            ctx.lineTo(endX, y);
        }
    });
    ctx.stroke();
    ctx.restore();
}

export default drawGrid;
