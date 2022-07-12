import { store } from '../store/store';
import { setCanvasSize } from '../store/slices/boardSlice';
import { handleMouseDown, handleMouseMove, handleMouseUp, handleMouseWheel, handleKeyboard } from './userInputHandlers';
import { isMobile } from '../utils';

/* 
    Board is in one of many possible states (IDLE, PAN, DRAG, DRAW, etc)
    State machine does the following:
        - receives user inputs like mouse, wheel and window resize events
        - reads current state and other variables from various store slices (e.g. selectedTool)
        - produces several side effects to create/update items and change board properties
        - sets the next state
*/

const BoardStateMachine = {
    mouseDown: handleMouseDown, // sets initial vars

    mouseMove: handleMouseMove, // modifies items as mouse moves

    mouseUp: handleMouseUp, // wraps up and syncs items with BE

    wheelScroll: handleMouseWheel, // controls board zoom (scale)

    keyPress: handleKeyboard,

    windowResize(): void {
        const [width, height] = isMobile() ? [screen.availWidth, screen.availHeight] : [window.innerWidth, window.innerHeight];
        store.dispatch(setCanvasSize({ width, height }));
    },
};

export default BoardStateMachine;
