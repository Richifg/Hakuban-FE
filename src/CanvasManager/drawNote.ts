import { Note } from '../interfaces';

function drawNote(note: Note, ctx: CanvasRenderingContext2D): void {
    const { x0, y0, x2, y2, size, color } = note;

    // note body shadow
    ctx.shadowColor = 'rgba(0,0,0,0.2)';
    ctx.shadowBlur = 5;
    ctx.shadowOffsetY = size * 0.04;

    // sticky note
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.moveTo(x0, y0);
    ctx.lineTo(x2, y0);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x0, y2);
    ctx.closePath();
    ctx.fill();

    // glue part shadow
    ctx.beginPath();
    const glueHeight = 0.2 * size;
    const shadowGradient = ctx.createLinearGradient(x0, 0, x2, glueHeight);
    shadowGradient.addColorStop(0, 'rgba(0,0,0,0.001)');
    shadowGradient.addColorStop(1, 'rgba(0,0,0,0.01)');
    ctx.fillStyle = shadowGradient;
    ctx.moveTo(x0, y0);
    ctx.lineTo(x2, y0);
    ctx.lineTo(x2, y0 + glueHeight);
    ctx.lineTo(x0, y0 + glueHeight);
    ctx.closePath();
    ctx.fill();
}

export default drawNote;
