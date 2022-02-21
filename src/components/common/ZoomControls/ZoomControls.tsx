import React from 'react';
import { useSelector, useDispatch } from '../../../hooks';
import { getBoardCoordinates } from '../../../utils';
import { scaleCanvasAndCenter } from '../../../store/slices/boardSlice';

import './ZoomControls.scss';

const ZoomControls = (): React.ReactElement => {
    const dispatch = useDispatch();
    const { canvasTransform, canvasSize, boardLimits } = useSelector((s) => s.board);
    const zoomPercentage = Math.floor(canvasTransform.scale * 100) + '%';

    // zooms out to make all elements fit the screen
    const handleFitScreen = () => {
        const { width, height } = canvasSize;
        const { top, left, bottom, right } = boardLimits;
        // scale so that everything is visible
        const scale = width > height ? height / (bottom - top) : width / (right - left);
        // center at the middle of the board limits
        const x = (right + left) * 0.5;
        const y = (bottom + top) * 0.5;
        dispatch(scaleCanvasAndCenter([scale, x, y]));
    };

    // zooms in or out 1 step
    const handleZoomInOut = (sign: 1 | -1) => {
        const { scale } = canvasTransform;
        // round current scale to nearest 0.1 (10%)
        const roundedScale = Math.round(scale * 10) * 0.1;
        // increase/decrease depends on current scale ##TODO
        const newScale = roundedScale + 0.1 * sign;
        // center at the board coordinates of the middle of the canvas
        const [x, y] = getBoardCoordinates(canvasSize.width * 0.5, canvasSize.height * 0.5, canvasTransform);
        dispatch(scaleCanvasAndCenter([newScale, x, y]));
    };

    return (
        <div className="zoom-controls">
            <button className="fit-button" onClick={handleFitScreen}>
                fit
            </button>
            <button className="zoom-button" onClick={() => handleZoomInOut(1)}>
                +
            </button>
            <p className="zoom-display">{zoomPercentage}</p>
            <button className="zoom-button" onClick={() => handleZoomInOut(-1)}>
                -
            </button>
        </div>
    );
};

export default ZoomControls;
