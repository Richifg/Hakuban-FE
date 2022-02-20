import React from 'react';
import { useSelector, useDispatch } from '../../../hooks';
import { scaleCanvasTo } from '../../../store/slices/boardSlice';

import './ZoomControls.scss';

const ZoomControls = (): React.ReactElement => {
    const dispatch = useDispatch();
    const { canvasTransform, canvasSize } = useSelector((s) => s.board);
    const zoomPercentage = Math.floor(canvasTransform.scale * 100) + '%';

    const handleClick = (sign: 1 | -1) => {
        const { scale } = canvasTransform;
        // round current scale to nearest 0.1 (10%)
        const roundedScale = Math.round(scale * 10) * 0.1;
        // increase/decrease depends on current scale
        const newScale = roundedScale + 0.1 * sign;
        // zoom as if cursor was on the middle of the screen
        const x = canvasSize.width * 0.5;
        const y = canvasSize.height * 0.5;
        dispatch(scaleCanvasTo([newScale, x, y]));
    };

    return (
        <div className="zoom-controls">
            <button className="zoom-button" onClick={() => handleClick(1)}>
                +
            </button>
            <p className="zoom-display">{zoomPercentage}</p>
            <button className="zoom-button" onClick={() => handleClick(-1)}>
                -
            </button>
        </div>
    );
};

export default ZoomControls;
