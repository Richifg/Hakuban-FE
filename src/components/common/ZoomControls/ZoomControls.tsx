import React from 'react';
import { useSelector, useDispatch } from '../../../hooks';
import { scaleCanvas } from '../../../store/slices/boardSlice';

import './ZoomControls.scss';

const ZoomControls = (): React.ReactElement => {
    const dispatch = useDispatch();
    const { canvasTransform } = useSelector((s) => s.board);
    const zoomPercentage = Math.floor(canvasTransform.scale * 100) + '%';

    return (
        <div className="zoom-controls">
            <button className="zoom-button" onClick={() => dispatch(scaleCanvas(0.1))}>
                +
            </button>
            <p className="zoom-display">{zoomPercentage}</p>
            <button className="zoom-button" onClick={() => dispatch(scaleCanvas(-0.1))}>
                -
            </button>
        </div>
    );
};

export default ZoomControls;
