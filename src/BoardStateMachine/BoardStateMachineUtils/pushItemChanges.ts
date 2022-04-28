import { store } from '../../store/store';
import { BoardItem, UpdateData } from '../../interfaces';
import { updateItem, addItem, addSyncData, syncData } from '../../store/slices/itemsSlice';
import { areKeysValid } from '../../utils';

function pushItemChanges(data: BoardItem | UpdateData | (BoardItem | UpdateData)[]): void {
    const { getState, dispatch } = store;
    const { items, inProgress } = getState().items;
    // data is valid if it is a full item (has creationDate) or its keys are valid
    const dataArr = Array.isArray(data)
        ? data
        : [data].filter((data) => data.creationDate || areKeysValid(Object.keys(data), items[data.id]));
    dataArr.forEach((data) => {
        if (data.creationDate) dispatch(addItem(data as BoardItem));
        else dispatch(updateItem(data));
        dispatch(addSyncData(data));
    });
    if (!inProgress) dispatch(syncData());
}

export default pushItemChanges;
