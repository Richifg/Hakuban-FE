import React from 'react';
import { useSelector, useDispatch } from '../../../hooks';
import { getBoardCoordinates } from '../../../utils';
import { setCanvasScale, centerCanvasAt } from '../../../store/slices/boardSlice';

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
            if (stepIndex < STEPS) requestAnimationFrame(() => animateStep(stepIndex + 1));
        };
        animateStep(0);
    };

    const handleFitScreen = () => {
        const { width, height } = canvasSize;
        const { top, left, bottom, right } = boardLimits;
        // scale canvas so that everything is visible
        const scale = width > height ? height / (bottom - top) : width / (right - left);
        // center canvas at the middle of the board limits
        const x = (right + left) * 0.5;
        const y = (bottom + top) * 0.5;
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
