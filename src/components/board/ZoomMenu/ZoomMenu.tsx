import React from 'react';
import { getBoardCoordinates } from '../../../utils';
import { useSelector, useDispatch } from '../../../hooks';
import { setCanvasScale, centerCanvasAt } from '../../../store/slices/boardSlice';
import { MenuContainer, MenuItem, MenuSeparator } from '../../common';

import styles from './ZoomMenu.module.scss';

// steps for a smooth zoom to fit animation
const STEPS = 20;

const ZoomMenu = (): React.ReactElement => {
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
        const [limitWidth, limitHeight] = [Math.abs(right.extent - left.extent), Math.abs(bottom.extent - top.extent)];

        // scale canvas so that everything is visible
        const scale = Math.min(canvasHeight / limitHeight, canvasWidth / limitWidth);
        // center canvas at the middle of the board limits
        const x = (right.extent + left.extent) * 0.5;
        const y = (bottom.extent + top.extent) * 0.5;
        smoothScaleAndCenter(scale, x, y);
    };

    const handleZoomInOrOut = (sign: 1 | -1) => () => {
        const { scale } = canvasTransform;
        // round current scale to nearest 0.1 (10%)
        const roundedScale = Math.round(scale * 10) * 0.1;
        // increase/decrease depends on current scale
        const newScale = roundedScale + 0.1 * sign;
        dispatch(setCanvasScale(newScale));
        // center canvas at the board coordinates of the middle of the canvas
        const [x, y] = getBoardCoordinates(canvasSize.width * 0.5, canvasSize.height * 0.5, canvasTransform);
        dispatch(centerCanvasAt([x, y]));
    };

    return (
        <MenuContainer className={styles.zoomMenu}>
            <MenuItem type="button" iconName="zoomIn" onClick={handleZoomInOrOut(1)} />
            <MenuItem type="misc" className={styles.zoomPercentage}>
                {zoomPercentage}
            </MenuItem>
            <MenuItem type="button" iconName="zoomOut" onClick={handleZoomInOrOut(-1)} />
            <MenuSeparator />
            <MenuItem type="button" iconName="zoomFit" onClick={handleFitScreen} />
        </MenuContainer>
    );
};

export default ZoomMenu;
