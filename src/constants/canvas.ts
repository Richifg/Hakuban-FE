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

// arrow size for 1px line-width Lines
export const ARROW_SIZE = 4; // px

// maximun line width for all stroke items
export const MAX_LINE_WIDTH = 25; // px

// line patterns used for the canvas setDashLine function
export const LINE_PATTERNS = {
    0: [],
    1: [20, 5],
    2: [10, 10],
    3: [2, 2],
};
