import { Coordinates } from '../interfaces/items';

function getTranslatedCoordinates(
    coordinates: Coordinates,
    offset: { x: number; y: number },
    boardX: number,
    boardY: number,
): Coordinates {
    const [width, height] = [coordinates.x2 - coordinates.x0, coordinates.y2 - coordinates.y0];
    const [x0, y0] = [boardX - offset.x, boardY - offset.y];
    const [x2, y2] = [x0 + width, y0 + height];
    return { x0, y0, x2, y2 };
}

export default getTranslatedCoordinates;
