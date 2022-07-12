// grid variables
export const INIT_GRID_SIZE = 20; //px
export const MIN_GRID_RENDER_SIZE = 20; //px
export const MAX_GRID_RENDER_SIZE = 250; //px

// min padding around all items used to determine the extents of the board
export const BOARD_PADDING = 200; // px

// min distance between the style menu and the selected item
export const MENU_ITEM_OFFSET = 20; // px

// min distance between the style menu and the edge of the board
export const MENU_BOARD_OFFSET = 10; // px

// tolerance around shape for a succesfull click
export const SHAPE_CLICK_TOLERANCE = 0; // px

// tolerance around line for a succesfull click
export const LINE_CLICK_TOLERNACE = 10; // px

// arrow size for 1px line-width Lines (arrow size grows with line-width)
export const ARROW_SIZE = 4; // px

// maximuns for style range sliders
export const MAX_LINE_WIDTH = 30; // px
export const MAX_FONT_SIZE = 100; // px
export const MIN_FONT_SIZE = 5; // px

// line patterns used for the canvas setDashLine function
export const LINE_PATTERNS = {
    0: [],
    1: [20, 5],
    2: [10, 10],
    3: [2, 2],
};

// maximun slots available for adding custom colors to the palette
export const MAX_CUSTOM_COLORS = 8;

// default font colors for text Items
export const TEXT_COLORS = [
    '#ffffff',
    '#D3D3D3',
    '#6d6d6d',
    '#000000',
    '#ffbc00',
    '#f9f037',
    '#bae22d',
    '#3fca1f',
    '#008053',
    '#e63108',
    '#de1e86',
    '#7546b5',
    '#2283d5',
    '#46e0dc',
    '#a1550e',
];

// default stroke and fill colors for Items
export const FILL_STROKE_COLORS = ['transparent', ...TEXT_COLORS];

// default fill colors for Notes
export const NOTE_COLORS = ['#f1f58f', '#dcff46', '#74ed4b', '#7afcff', '#a9edf1', '#ffa930', '#ff32b2', '#ff7eb9'];

// placeholder text Item text
export const PLACE_HOLDER_TEXT = 'Type somenthing here';
