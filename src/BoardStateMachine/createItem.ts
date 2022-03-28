import { store } from '../store/store';
import { BoardItem } from '../interfaces';
import { setCurrentAction, setBoardLimits } from '../store/slices/boardSlice';
import { addItem, setSelectedItem, setSelectedPoint } from '../store/slices/itemsSlice';
import { isPointInsideItem, getBoardCoordinates, getNewItem, getUpdatedBoardLimits } from '../utils';
import connectItem from './connectItem';

function createItem(x: number, y: number): void {
    const { dispatch } = store;
    const { canvasTransform } = store.getState().board;
    const { selectedTool } = store.getState().tools;

    const [boardX, boardY] = getBoardCoordinates(x, y, canvasTransform);
    let newItem: BoardItem | undefined = undefined;

    if (selectedTool === 'SHAPE') {
        newItem = getNewItem(boardX, boardY, 0, 'shape');
        dispatch(setSelectedPoint('P2'));
        dispatch(setCurrentAction('RESIZE'));
    } else if (selectedTool === 'NOTE') {
        newItem = getNewItem(boardX, boardY, 0, 'note');
        dispatch(setCurrentAction('EDIT'));
    } else if (selectedTool === 'PEN') {
        newItem = getNewItem(boardX, boardY, 0, 'drawing');
        dispatch(setCurrentAction('DRAW'));
    } else if (selectedTool === 'LINE') {
        const { items } = store.getState().items;
        const [boardX, boardY] = getBoardCoordinates(x, y, canvasTransform);
        newItem = getNewItem(boardX, boardY, 0, 'line');
        dispatch(setSelectedPoint('P2'));
        dispatch(setCurrentAction('RESIZE'));
        // when creating a line it could be connected to an item right away
        const clickedItem = Object.values(items).find((item) => isPointInsideItem(boardX, boardY, item));
        if (clickedItem) connectItem(clickedItem, newItem, 'P0', boardX, boardY);
    }
    if (newItem) {
        dispatch(addItem(newItem));
        dispatch(setSelectedItem(newItem));
        dispatch(setBoardLimits(getUpdatedBoardLimits(newItem)));
    }
}

export default createItem;
