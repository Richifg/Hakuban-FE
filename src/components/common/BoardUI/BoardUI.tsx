import React, { useLayoutEffect } from 'react';
import { useSelector, useDebouncedCallback } from '../../../hooks';
import SM from '../../../BoardStateMachine/BoardStateMachine';
import { EditPoints } from '../../common';

import './BoardUI.scss';

const CanvasUI = (): React.ReactElement => {
    const { canvasSize, cursorPosition, currentAction } = useSelector((s) => s.board);
    const { selectedTool } = useSelector((s) => s.tools);
    const { width, height } = canvasSize;
    const tool = selectedTool.toLowerCase();

    // update canvas size on every window resize
    useLayoutEffect(() => {
        const resizeHandler = () => SM.windowResize();
        window.addEventListener('resize', resizeHandler);
        resizeHandler();
        return () => window.removeEventListener('resize', resizeHandler);
    }, []);

    // handle user inputs
    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        e.persist();
        SM.mouseDown(e);
    };
    const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
        e.persist();
        SM.mouseUp(e);
    };
    const handleMouseMove = useDebouncedCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            e.persist;
            SM.mouseMove(e);
        },
        5,
        [],
    );

    const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
        e.persist();
        SM.mouseWheel(e);
    };

    return (
        <div
            role="application"
            className={`board-ui ${tool}`}
            style={{ width, height }}
            onMouseMove={handleMouseMove}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onWheel={handleWheel}
        >
            <p className="temp">Work In Progress!</p>
            <p className="cursor-position">
                X: {cursorPosition.x} Y:{cursorPosition.y} {currentAction}
            </p>
            <EditPoints />
        </div>
    );
};

export default CanvasUI;
