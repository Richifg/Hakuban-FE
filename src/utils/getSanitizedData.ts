import { UpdateData, BoardItem, TextData } from '../interfaces';

const PROGRESS_KEY: keyof BoardItem = 'inProgress'; // items are only inProgress when being edited
const SKIP_KEY: keyof TextData = 'skipRendering'; // text has skipRendering only when being written
const NEW_KEY: keyof BoardItem = 'isNew'; // items are only new on their first edit

// removes the optional properties of items that are only used locally on the FE

function getSanitizedData(data: BoardItem): BoardItem;
function getSanitizedData(data: UpdateData[]): UpdateData[];
function getSanitizedData(data: BoardItem | UpdateData[]): BoardItem | UpdateData[] {
    if (!Array.isArray(data)) {
        const sanitizedItem = { ...data } as BoardItem;
        delete sanitizedItem.inProgress;
        delete sanitizedItem.isNew;
        if ('text' in sanitizedItem) delete sanitizedItem.text?.skipRendering;
        return sanitizedItem;
    } else {
        const sanitizedDataArray: UpdateData[] = [];
        data.forEach((updateData) => {
            const sanitizedData = { ...updateData };
            delete sanitizedData[PROGRESS_KEY];
            delete sanitizedData[NEW_KEY];
            if ('text' in sanitizedData) delete sanitizedData.text[SKIP_KEY];
            sanitizedDataArray.push(sanitizedData);
        });
        return sanitizedDataArray;
    }
}

export default getSanitizedData;
