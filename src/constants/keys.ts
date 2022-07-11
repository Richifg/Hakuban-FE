import { BoardItem, Shape, Drawing, Text } from '../interfaces';

// key constants are used to check key vadility on UpdateData which can have any key

const X0: keyof BoardItem = 'x0' as const;
const X2: keyof BoardItem = 'x2' as const;
const Y0: keyof BoardItem = 'y0' as const;
const Y2: keyof BoardItem = 'y2' as const;
export const COORDINATE_KEYS = [X0, X2, Y0, Y2];

export const ZINDEX_KEY: keyof BoardItem = 'zIndex';

export const CONNECTIONS_KEY: keyof Shape = 'connections' as const;

export const ABSOLUTE_KEY: keyof Drawing = 'isAbsolute' as const;

export const TEXT_KEY: keyof Text = 'text' as const;
