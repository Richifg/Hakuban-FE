import { store } from '../store/store';

function drawLockHighlights(ctx: CanvasRenderingContext2D): void {
    const { canvasTransform } = store.getState().board;
    const { itemsLock, userId: ownId } = store.getState().connection;
    const { users } = store.getState().users;
    const { items } = store.getState().items;

    ctx.save();
    ctx.lineWidth = 2 / canvasTransform.scale;

    Object.entries(itemsLock).forEach(([itemId, userId]) => {
        if (userId !== ownId) {
            ctx.beginPath();
            const user = users[userId];
            const item = items[itemId];
            if (user && item) {
                ctx.strokeStyle = user.color;
                const { x0, y0, x2, y2 } = item;
                ctx.rect(x0, y0, x2 - x0, y2 - y0);
                ctx.stroke();
            }
        }
    });

    ctx.restore();
}

export default drawLockHighlights;
