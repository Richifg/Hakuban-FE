import React, { useLayoutEffect } from 'react';
import { useSelector, useDebouncedCallback } from '../../../hooks';
import { boardStateMachine as SM } from '../../../utils';

import './CanvasUI.scss';

const CanvasUI = (): React.ReactElement => {
    const { canvasSize, cursorPosition } = useSelector((s) => s.board);
    const { width, height } = canvasSize;

    // updated canvas size on every window resize
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

    return (
        <div
            role="application"
            className="edit-ui"
            style={{ width, height }}
            onMouseMove={handleMouseMove}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
        >
            <p className="temp">EDIT UI TEMP</p>
            <p className="cursor-position">
                X: {cursorPosition.x} Y:{cursorPosition.y}
            </p>
        </div>
    );
};

export default CanvasUI;
