import React, { useMemo } from 'react';
import { Point, Action } from '../../../interfaces';
import { useSelector, useDispatch } from '../../../hooks';
import { setSelectedPoint, setInProgress } from '../../../store/slices/itemsSlice';
import { setCurrentAction, setIsWriting, setMouseButton } from '../../../store/slices/boardSlice';
import getEditPoints from './getEditPoints';
import './EditPoints.scss';

const EditPointsActions: Action[] = ['EDIT', 'RESIZE'];

const EditPoints = (): React.ReactElement => {
    const dispatch = useDispatch();
    const { items, selectedItemId } = useSelector((s) => s.items);
    const { canvasTransform, currentAction, isWriting } = useSelector((s) => s.board);
    const selectedItem = selectedItemId ? items[selectedItemId] : undefined;

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        const point = e.currentTarget.id as Point;
        dispatch(setMouseButton(e.button));
        dispatch(setSelectedPoint(point));
        dispatch(setCurrentAction('RESIZE'));
        dispatch(setInProgress(true));
        isWriting && dispatch(setIsWriting(false));
    };

    const points = useMemo(
        () => (selectedItem ? getEditPoints(selectedItem, canvasTransform) : []),
        [canvasTransform, selectedItem],
    );

    return (
        <div className="edit-points-container">
            {EditPointsActions.includes(currentAction) &&
                points.map(([point, x, y]) => (
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
