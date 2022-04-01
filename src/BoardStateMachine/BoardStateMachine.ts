import { store } from '../store/store';
import { setCanvasSize } from '../store/slices/boardSlice';
import { handleMouseDown, handleMouseMove, handleMouseUp, handleMouseWheel, handleKeyboard } from './userInputHandlers';

/* 
    Board is in one of many possible states (IDLE, PAN, DRAG, DRAW, etc)
    State machine does the following:
        - receives user inputs like mouse, wheel and window resize events
        - reads current state and other variables from various store slices (e.g. selectedTool)
        - produces several side effects to create/update items and change board properties
        - sets the new state
*/

const BoardStateMachine = {
    mouseDown: handleMouseDown,

    mouseMove: handleMouseMove,

    mouseUp: handleMouseUp,

    wheelScroll: handleMouseWheel,

    keyPress: handleKeyboard,

    windowResize(): void {
        store.dispatch(setCanvasSize({ width: window.innerWidth, height: window.innerHeight }));
    },
};

export default BoardStateMachine;
