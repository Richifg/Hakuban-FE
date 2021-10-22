import React, { useLayoutEffect } from 'react';

import { setCurrentAction, setCanvasSize, setCursorMovement } from '../../../store/slices/boardSlice';
import { useSelector, useDispatch, useMovementFriction } from '../../../hooks';

import './CanvasUI.scss';

const CanvasUI = (): React.ReactElement => {
    const dispatch = useDispatch();
    const { canvasSize, currentAction, cursorMovement } = useSelector((s) => s.board);
    const { width, height } = canvasSize;

    // updated canvas size on every window resize
    useLayoutEffect(() => {
        const resizeHandler = () => dispatch(setCanvasSize({ width: window.innerWidth, height: window.innerHeight }));
        window.addEventListener('resize', resizeHandler);
        resizeHandler();
        return () => window.removeEventListener('resize', resizeHandler);
    }, []);

    // continue sliding with friction after user pans the camera
    useMovementFriction(
        cursorMovement,
        currentAction === 'SLIDE',
        (x: number, y: number) => dispatch(setCursorMovement({ x, y })),
        () => dispatch(setCurrentAction('IDLE')),
    );

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
        if (currentAction === 'PAN') {
            const { movementX: x, movementY: y } = e;
            dispatch(setCursorMovement({ x, y }));
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
            <p>EDIT UI TEMP</p>
        </div>
    );
};

export default CanvasUI;
