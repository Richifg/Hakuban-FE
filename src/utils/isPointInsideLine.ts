import { Line } from '../interfaces';
import { isPointInsideArea } from './';

// clicking exactly on a 1px line is not easy
const TOLERANCE = 10; //px

function isPointInsideLine(boardX: number, boardY: number, line: Line, tolerance = TOLERANCE): boolean {
    const { x0, x2, y0, y2, lineWidth } = line;
    let distance = Infinity;

    const linePoints: [number, number, number, number][] = [];
    if (line.lineType === 'stepped') {
        if (Math.abs(x2 - x0) > Math.abs(y2 - y0)) {
            const midX = (x2 + x0) / 2;
            linePoints.push([x0, y0, midX, y0]);
            linePoints.push([midX, y0, midX, y2]);
            linePoints.push([midX, y2, x2, y2]);
        } else {
            const midY = (y2 + y0) / 2;
            linePoints.push([x0, y0, x0, midY]);
            linePoints.push([x0, midY, x2, midY]);
            linePoints.push([x2, midY, x2, y2]);
        }
    } else {
        // curved lines are asummed to be straight for simplicity
        linePoints.push([x0, y0, x2, y2]);
    }

    linePoints.forEach(([x0, y0, x2, y2]) => {
        // first check point is inside the area formed by the line points
        if (isPointInsideArea(boardX, boardY, { x0, y0, x2, y2 }, tolerance)) {
            distance = Math.min(distance, distanceToLine(x0, y0, x2, y2, boardX, boardY));
        }
    });

    return distance <= tolerance + lineWidth;
}

// this formula gets the distance to an inifnite line defined by x1,y1 and x2,y2 points
// so have to make sure point is withing the two points first
function distanceToLine(x1: number, y1: number, x2: number, y2: number, pX: number, pY: number) {
    return Math.abs((x2 - x1) * (y1 - pY) - (x1 - pX) * (y2 - y1)) / Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

export default isPointInsideLine;
