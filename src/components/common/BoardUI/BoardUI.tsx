import React, { useLayoutEffect, useMemo } from 'react';
import { useSelector, useDebouncedCallback } from '../../../hooks';
import { boardStateMachine as SM } from '../../../utils';
import type { Point } from '../../../interfaces/items';

import './BoardUI.scss';
import getTransformedPointsFromItem from '../../../utils/getTransformedPoints';

type Points = { [key in Point]: { x: number; y: number } };

const CanvasUI = (): React.ReactElement => {
    const { canvasSize, canvasTransform, cursorPosition, selectedTool, currentAction } = useSelector((s) => s.board);
    const { selectedItem } = useSelector((s) => s.items);
    const { width, height } = canvasSize;
    const tool = selectedTool.toLowerCase();

    const points: Points | undefined = useMemo(
        () => (selectedItem ? getTransformedPointsFromItem(selectedItem, canvasTransform) : undefined),

        [canvasTransform, selectedItem],
    );

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

    return (
        <div
            role="application"
            className={`board-ui ${tool}`}
            style={{ width, height }}
            onMouseMove={handleMouseMove}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
        >
            <p className="temp">EDIT UI TEMP</p>
            <p className="cursor-position">
                X: {cursorPosition.x} Y:{cursorPosition.y} {currentAction}
            </p>
            {points &&
                Object.entries(points).map(([point, { x, y }]) => (
                    <div key={point} id={point} className="edit-point" style={{ left: x, top: y }} />
                ))}
        </div>
    );
};

export default CanvasUI;
