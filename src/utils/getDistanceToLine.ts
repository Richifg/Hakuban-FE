import { Line } from '../interfaces';

function getDistanceToLine(line: Line, boardX: number, boardY: number): number {
    const { x0, x2, y0, y2 } = line;
    let distance = 0;
    if (line.lineType === 'stepped') {
        if (Math.abs(x2 - x0) > Math.abs(y2 - y0)) {
            const midX = (x2 + x0) / 2;
            distance = Math.min(
                distanceToLine(x0, y0, midX, y0, boardX, boardY),
                distanceToLine(midX, y0, midX, y2, boardX, boardY),
                distanceToLine(midX, y2, x2, y2, boardX, boardY),
            );
        } else {
            const midY = (y2 + y0) / 2;
            distance = Math.min(
                distanceToLine(x0, y0, x0, midY, boardX, boardY),
                distanceToLine(x0, midY, x2, midY, boardX, boardY),
                distanceToLine(x2, midY, x2, y2, boardX, boardY),
            );
        }
    } else {
        // curved lines are asummed to be straight for simplicity
        distance = distanceToLine(x0, y0, x2, y2, boardX, boardY);
    }
    return distance;
}
function distanceToLine(x1: number, y1: number, x2: number, y2: number, pX: number, pY: number) {
    return Math.abs((x2 - x1) * (y1 - pY) - (x1 - pX) * (y2 - y1)) / Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

export default getDistanceToLine;
