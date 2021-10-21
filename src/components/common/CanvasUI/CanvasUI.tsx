import React, { useEffect, useLayoutEffect, useRef } from 'react';

import { setCurrentAction, setCanvasSize, setCursorMovement } from '../../../store/slices/boardSlice';
import { useSelector, useDispatch } from '../../../hooks';

import './CanvasUI.scss';

const FRICTION_INTERVAL = 5; //16.66 #TODO fine tune this
const FRICTION = 0.9;

const CanvasUI = (): React.ReactElement => {
    const dispatch = useDispatch();
    const { canvasSize, currentAction, cursorMovement } = useSelector((s) => s.board);
    const { width, height } = canvasSize;
    const tempRefs = useRef({ currentAction, cursorMovement });
    tempRefs.current = { currentAction, cursorMovement };

    useLayoutEffect(() => {
        const resizeHandler = () => dispatch(setCanvasSize({ width: window.innerWidth, height: window.innerHeight }));
        window.addEventListener('resize', resizeHandler);
        resizeHandler();
        return () => window.removeEventListener('resize', resizeHandler);
    }, []);

    // TEMP TEMP, friction and stuff should be handlded by requestAnimationFrame
    useEffect(() => {
        let id: NodeJS.Timeout;
        if (currentAction === 'SLIDE') {
            id = setInterval(() => {
                const { x, y } = tempRefs.current.cursorMovement;
                if ((x !== 0 || y !== 0) && tempRefs.current.currentAction === 'SLIDE') {
                    dispatch(
                        setCursorMovement({
                            x: Math.abs(x) > 0.1 ? FRICTION * x : 0,
                            y: Math.abs(y) > 0.1 ? FRICTION * y : 0,
                        }),
                    );
                } else {
                    clearInterval(id);
                    dispatch(setCurrentAction('IDLE'));
                }
            }, FRICTION_INTERVAL);
        }
        return () => clearInterval(id);
    }, [currentAction]);

    // ##TODO potentially call the same function with all 3 handles and create state machine
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
            <p>EDIT UI</p>
        </div>
    );
};

export default CanvasUI;
