import React, { useLayoutEffect } from 'react';
import { useSelector, useDebouncedCallback } from '../../../hooks';
import { EditPoints, TextEditor, StylesMenu } from '../../common';

import SM from '../../../BoardStateMachine/BoardStateMachine';
import './BoardUI.scss';

const CanvasUI = (): React.ReactElement => {
    const { canvasSize, cursorPosition, currentAction } = useSelector((s) => s.board);
    const { isWriting } = useSelector((s) => s.board);
    const { selectedTool } = useSelector((s) => s.tools);
    const { width, height } = canvasSize;
    const tool = selectedTool.toLowerCase();
    const action = currentAction.toLowerCase();

    // update canvas size on every window resize
    useLayoutEffect(() => {
        const resizeHandler = () => SM.windowResize();
        window.addEventListener('resize', resizeHandler);
        resizeHandler();
        return () => window.removeEventListener('resize', resizeHandler);
    }, []);

    // handle user with BoardStateMachine
    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault(); // stop native drag behaviour
        e.persist();
        SM.mouseDown(e);
    };
    const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
        e.persist();
        SM.mouseUp(e);
    };
    const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
        e.persist();
        SM.wheelScroll(e);
    };
    const handleKeyboard = (e: React.KeyboardEvent<HTMLDivElement>) => {
        e.persist();
        SM.keyPress(e);
    };
    // 5ms debounc on mouse move
    const handleMouseMove = useDebouncedCallback((e: React.MouseEvent<HTMLDivElement>) => {
        e.persist;
        SM.mouseMove(e);
    }, 5);

    return (
        <div
            role="application"
            className={`board-ui ${tool} ${action}`}
            style={{ width, height }}
            onMouseMove={handleMouseMove}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onKeyDown={handleKeyboard}
            onKeyDownCapture={handleKeyboard}
            onKeyPressCapture={handleKeyboard}
            onKeyPress={handleKeyboard}
            onWheel={handleWheel}
        >
            <p className="temp">Work In Progress!</p>
            <p className="cursor-position">
                X: {cursorPosition.x} Y:{cursorPosition.y} {currentAction} {isWriting.toString()}
            </p>
            <EditPoints />
            <TextEditor />
            <StylesMenu />
        </div>
    );
};

export default CanvasUI;
