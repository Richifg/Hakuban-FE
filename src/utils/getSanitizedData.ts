import { UpdateData, BoardItem, TextData, Drawing } from '../interfaces';
import { isTextItem } from '../utils';

const ABSOLUTE_KEY: keyof Drawing = 'isAbsolute'; // drawings are use absolute coordinates only while being drawn
const SKIP_KEY: keyof TextData = 'skipRendering'; // text has skipRendering only when being written

// removes the optional properties of items that are only used locally on the FE

function getSanitizedData(data: BoardItem[]): BoardItem[];
function getSanitizedData(data: UpdateData[]): UpdateData[];
function getSanitizedData(data: BoardItem[] | UpdateData[]): BoardItem[] | UpdateData[] {
    if (!data.length) return [];
    const firstItem = data[0];
    if (firstItem.creationDate) {
        const items = data as BoardItem[];
        return items.map((item) => {
            const sanitizedItem = { ...item };
            if (sanitizedItem.type === 'drawing') delete sanitizedItem.isAbsolute;
            if (isTextItem(sanitizedItem)) delete sanitizedItem.text?.skipRendering;
            return sanitizedItem;
        });
    } else {
        return data.map((updateData) => {
            const sanitizedData = { ...updateData } as UpdateData;
            delete sanitizedData[ABSOLUTE_KEY];
            if ('text' in sanitizedData) delete sanitizedData.text[SKIP_KEY];
            return sanitizedData;
        });
    }
}

export default getSanitizedData;
