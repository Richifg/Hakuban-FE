import { MainPoint, Point } from '../interfaces';

function isMainPoint(point?: Point): point is MainPoint {
    return point === 'P0' || point === 'P2';
}

export default isMainPoint;
