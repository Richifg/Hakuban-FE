import React, { memo } from 'react';
import { useDispatch } from '../../../hooks';
import { setInProgress } from '../../../store/slices/itemsSlice';

// for some reason wasn't not able to style the range input with scss modules so had to use stylesheet
import './RangeInput.scss';

interface RangeInput extends React.HTMLProps<HTMLInputElement> {
    label?: string;
    min: number;
    max: number;
    value: number;
}

const RangeInput = ({ min, max, value, label, ...rest }: RangeInput): React.ReactElement => {
    const dispatch = useDispatch();

    // also, because native html input when styled does not show fill bar
    // had to calculate stuff here to make a custom fillbar
    const fillPercentage = (100 * (value - min)) / (max - min);

    // adjust position depending on fill (native thumb stops at edges and not at center)
    const left = `calc(${fillPercentage}% - ${(-5 + 10 * (fillPercentage / 100)).toFixed(1)}px)`;

    return (
        <>
            <div className="range-input">
                <input
                    type="range"
                    className="input"
                    min={min}
                    max={max}
                    value={value}
                    onPointerDown={() => dispatch(setInProgress(true))}
                    onPointerUp={() => dispatch(setInProgress(false))}
                    {...rest}
                />
                <span className="fill" style={{ width: left }} />
                <span className="thumb" style={{ left }} />
            </div>
            {label && <label className="range-label">{label}</label>}
        </>
    );
};

export default memo(RangeInput);
