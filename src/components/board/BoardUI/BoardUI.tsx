import React, { useLayoutEffect } from 'react';
import { useSelector, useDebouncedCallback } from '../../../hooks';
import { EditPoints, TextEditor } from '../';

import SM from '../../../BoardStateMachine/BoardStateMachine';
import styles from './BoardUI.module.scss';

// handle user inputs with BoardStateMachine
const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault(); // stop native drag behaviour
    e.persist();
    SM.mouseDown(e);
};
const handleMouseUp = (e: React.MouseEvent) => {
    e.persist();
    SM.mouseUp(e);
};
const handleWheel = (e: React.WheelEvent) => {
    e.persist();
    SM.wheelScroll(e);
};
// const handleKeyboard = (e: React.KeyboardEvent) => {
//     e.persist();
//     SM.keyPress(e);
// };
const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    return false; // stops context menu from opening
};

const CanvasUI = (): React.ReactElement => {
    const { canvasSize, currentAction } = useSelector((s) => s.board);
    const { selectedTool } = useSelector((s) => s.tools);
    const { width, height } = canvasSize;

    // update canvas size on every window resize
    useLayoutEffect(() => {
        const resizeHandler = () => SM.windowResize();
        window.addEventListener('resize', resizeHandler);
        resizeHandler();
        return () => window.removeEventListener('resize', resizeHandler);
    }, []);

    // 5ms debounce on mouse move
    const handleMouseMove = useDebouncedCallback((e: React.MouseEvent<HTMLDivElement>) => {
        e.persist;
        SM.mouseMove(e);
    }, 5);

    return (
        <div
            role="application"
            className={`${styles.boardUI} ${styles[selectedTool]} ${styles[currentAction]}`}
            style={{ width, height }}
            onPointerMove={handleMouseMove}
            onPointerDown={handleMouseDown}
            onPointerUp={handleMouseUp}
            onPointerLeave={handleMouseUp}
            onWheel={handleWheel}
            onContextMenu={handleContextMenu}
        >
            <EditPoints />
            <TextEditor />
        </div>
    );
};

export default CanvasUI;
