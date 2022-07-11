import { BoardItem, Line, MainPoint, UpdateData } from '../../interfaces';
import { isConnectableItem } from '../../utils';
import { disconnectItem } from './';

// adds a Line connection to an item and returns the updated item

function connectItem(itemToConnect: BoardItem, line: Line, point: MainPoint, boardX: number, boardY: number): UpdateData[] {
    const updateData: UpdateData[] = [];
    if (isConnectableItem(itemToConnect)) {
        // line may have a previous connection which needs to be removed
        const disconnectUpdate = disconnectItem(line, point);
        disconnectUpdate && updateData.push(disconnectUpdate);

        // get relative connection coordinate
        const { id, x0, y0, x2, y2, connections } = itemToConnect;
        const oldConnections = connections ? connections : [];
        const [minX, minY] = [Math.min(x0, x2), Math.min(y0, y2)];
        const [width, height] = [Math.abs(x2 - x0), Math.abs(y2 - y0)];
        const [x, y] = [parseFloat(((boardX - minX) / width).toFixed(2)), parseFloat(((boardY - minY) / height).toFixed(2))];
        const newConnections = [...oldConnections, [line.id, point, x, y]];
        updateData.push({ id, connections: newConnections });
    }
    return updateData;
}

export default connectItem;
