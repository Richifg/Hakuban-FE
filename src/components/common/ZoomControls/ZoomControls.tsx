import React from 'react';
import { useSelector, useDispatch } from '../../../hooks';
import { getBoardCoordinates } from '../../../utils';
import { setCanvasScale, centerCanvasAt, toggleGrid } from '../../../store/slices/boardSlice';

import './ZoomControls.scss';

// steps for a smooth zoom to fit animation
const STEPS = 20;

const ZoomControls = (): React.ReactElement => {
    const dispatch = useDispatch();
    const { canvasTransform, canvasSize, boardLimits } = useSelector((s) => s.board);
    const zoomPercentage = Math.floor(canvasTransform.scale * 100) + '%';

    const smoothScaleAndCenter = (finalScale: number, finalX: number, finalY: number) => {
        let currentScale = canvasTransform.scale;
        // find center of screen in board coordinates
        let [currentX, currentY] = getBoardCoordinates(canvasSize.width * 0.5, canvasSize.height * 0.5, canvasTransform);
        // smooth scale-and-center by doing several steps
        const scaleStep = (finalScale - currentScale) / STEPS;
        const xStep = (finalX - currentX) / STEPS;
        const yStep = (finalY - currentY) / STEPS;
        const animateStep = (stepIndex: number) => {
            currentScale += scaleStep;
            currentX += xStep;
            currentY += yStep;
            dispatch(setCanvasScale(currentScale));
            dispatch(centerCanvasAt([currentX, currentY]));
            if (stepIndex < STEPS - 1) requestAnimationFrame(() => animateStep(stepIndex + 1));
        };
        animateStep(0);
    };

    const handleFitScreen = () => {
        const { width: canvasWidth, height: canvasHeight } = canvasSize;
        const { top, left, bottom, right } = boardLimits;
        const [limitWidth, limitHeight] = [right.extent - left.extent, bottom.extent - top.extent];
        // scale canvas so that everything is visible
        const scale = limitWidth < limitHeight ? canvasHeight / limitHeight : canvasWidth / limitWidth;
        // center canvas at the middle of the board limits
        const x = (right.extent + left.extent) * 0.5;
        const y = (bottom.extent + top.extent) * 0.5;
        smoothScaleAndCenter(scale, x, y);
    };

    const handleZoomInOrOut = (sign: 1 | -1) => {
        const { scale } = canvasTransform;
        // round current scale to nearest 0.1 (10%)
        const roundedScale = Math.round(scale * 10) * 0.1;
        // increase/decrease depends on current scale ##TODO
        const newScale = roundedScale + 0.1 * sign;
        dispatch(setCanvasScale(newScale));
        // center canvas at the board coordinates of the middle of the canvas
        const [x, y] = getBoardCoordinates(canvasSize.width * 0.5, canvasSize.height * 0.5, canvasTransform);
        dispatch(centerCanvasAt([x, y]));
    };

    return (
        <div className="zoom-controls">
            <button onClick={() => dispatch(toggleGrid())}>GRID</button>
            <button className="fit-button" onClick={handleFitScreen}>
                fit
            </button>
            <button className="zoom-button" onClick={() => handleZoomInOrOut(1)}>
                +
            </button>
            <p className="zoom-display">{zoomPercentage}</p>
            <button className="zoom-button" onClick={() => handleZoomInOrOut(-1)}>
                -
            </button>
        </div>
    );
};

export default ZoomControls;
