import React, { useMemo } from 'react';
import { useSelector } from '../../../hooks';
import { getBoardCoordinates, getPositionCSSVars } from '../../../utils';
import './DragSelectArea.scss';

const DragSelectArea = (): React.ReactElement => {
    const { dragOffset } = useSelector((s) => s.items);
    const { currentAction, cursorPosition, canvasTransform } = useSelector((s) => s.board);

    const { left, top, width, height } = useMemo(() => {
        if (currentAction !== 'DRAGSELECT') return { left: -500, top: -500, width: 0, height: 0 };
        const [boardCursorX, boardCursorY] = getBoardCoordinates(cursorPosition.x, cursorPosition.y, canvasTransform);
        return getPositionCSSVars(
            canvasTransform,
            {
                x0: dragOffset.x,
                y0: dragOffset.y,
                x2: boardCursorX,
                y2: boardCursorY,
            },
            true,
        );
    }, [dragOffset, currentAction, cursorPosition, canvasTransform]);

    return <span className="drag-select-area" style={{ left, top, width, height }} />;
};

export default DragSelectArea;
