import { store } from '../../store/store';
import { BoardItem, Tool } from '../../interfaces';
import { setCurrentAction } from '../../store/slices/boardSlice';
import { addItem, setSelectedItemId, setSelectedPoint } from '../../store/slices/itemsSlice';
import { isPointInsideArea, getNewItem } from '../../utils';
import connectItem from './connectItem';
import updateBoardLimits from './updateBoardLimits';

// TODO possibly simplify this function and let stateMachine handle state changes

function createItem(boardX: number, boardY: number, tool: Tool): void {
    const { dispatch } = store;
    let newItem: BoardItem | undefined = undefined;

    if (tool === 'SHAPE') {
        newItem = getNewItem(boardX, boardY, 0, 'shape');
        dispatch(setSelectedPoint('P2'));
        dispatch(setCurrentAction('RESIZE'));
    } else if (tool === 'NOTE') {
        newItem = getNewItem(boardX, boardY, 0, 'note');
        dispatch(setCurrentAction('EDIT'));
    } else if (tool === 'PEN') {
        newItem = getNewItem(boardX, boardY, 0, 'drawing');
        dispatch(setCurrentAction('DRAW'));
    } else if (tool === 'LINE') {
        const { items } = store.getState().items;
        newItem = getNewItem(boardX, boardY, 0, 'line');
        dispatch(setSelectedPoint('P2'));
        dispatch(setCurrentAction('RESIZE'));
        // when creating a line it could be connected to an item right away
        const clickedItem = Object.values(items).find((item) => isPointInsideArea(boardX, boardY, item));
        if (clickedItem) connectItem(clickedItem, newItem, 'P0', boardX, boardY);
    }
    if (newItem) {
        dispatch(addItem(newItem));
        dispatch(setSelectedItemId(newItem.id));
        updateBoardLimits(newItem);
    }
}

export default createItem;
