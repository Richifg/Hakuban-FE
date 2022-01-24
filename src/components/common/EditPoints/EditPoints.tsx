import React, { useMemo } from 'react';
import type { Point } from '../../../interfaces/items';
import { getItemTransformedPoints } from '../../../utils';
import { useSelector, useDispatch } from '../../../hooks';
import { setSelectedPoint } from '../../../store/slices/itemsSlice';
import { setCurrentAction } from '../../../store/slices/boardSlice';
import './EditPoints.scss';

type Points = { [key in Point]: { x: number; y: number } };

const EditPoints = (): React.ReactElement => {
    const dispatch = useDispatch();
    const { selectedItem } = useSelector((s) => s.items);
    const { canvasTransform } = useSelector((s) => s.board);

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        const point = e.currentTarget.id as Point;
        dispatch(setSelectedPoint(point));
        dispatch(setCurrentAction('RESIZE'));
    };

    const points: Points | undefined = useMemo(
        () => (selectedItem ? getItemTransformedPoints(selectedItem, canvasTransform) : undefined),
        [canvasTransform, selectedItem],
    );

    return (
        <div className="edit-points-container">
            {points &&
                Object.entries(points).map(([point, { x, y }]) => (
                    <div
                        key={point}
                        id={point}
                        className="edit-point"
                        style={{ left: x, top: y }}
                        onMouseDown={handleMouseDown}
                    />
                ))}
        </div>
    );
};

export default EditPoints;
