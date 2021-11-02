import React, { useLayoutEffect } from 'react';
import { setCurrentAction, setCanvasSize, setCursorPosition, translateCanvas } from '../../../store/slices/boardSlice';
import { useSelector, useDispatch } from '../../../hooks';

import './CanvasUI.scss';

const CanvasUI = (): React.ReactElement => {
    const dispatch = useDispatch();
    const { canvasSize, currentAction, cursorPosition } = useSelector((s) => s.board);
    const { width, height } = canvasSize;

    // updated canvas size on every window resize
    useLayoutEffect(() => {
        const resizeHandler = () => dispatch(setCanvasSize({ width: window.innerWidth, height: window.innerHeight }));
        window.addEventListener('resize', resizeHandler);
        resizeHandler();
        return () => window.removeEventListener('resize', resizeHandler);
    }, []);

    // ##TODO potentially call the same function with all 3 handles and create state machine
    // handle user inputs
    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (currentAction === 'IDLE') dispatch(setCurrentAction('PAN'));
        if (currentAction === 'SLIDE') dispatch(setCurrentAction('PAN'));
    };
    const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
        if (currentAction === 'PAN') dispatch(setCurrentAction('SLIDE'));
    };
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        dispatch(setCursorPosition([e.clientX, e.clientY]));
        if (currentAction === 'PAN') {
            console.log(e.movementX, e.movementY);
            dispatch(translateCanvas([e.movementX, e.movementY]));
        }
    };

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
