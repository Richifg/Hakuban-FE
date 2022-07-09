import React from 'react';
import { useDispatch } from '../../../hooks';
import { setInProgress } from '../../../store/slices/itemsSlice';

// for some reason wasn't not able to style the range input with scss modules so had to use stylesheet
import './RangeInput.scss';

interface RangeInput extends React.HTMLProps<HTMLInputElement> {
    label?: string;
}

const RangeInput = ({ min, max, value, label, ...rest }: RangeInput): React.ReactElement => {
    const dispatch = useDispatch();

    // also, because native html input when styled does not show fill bar
    // had to calculate stuff here to make a custom fillbar
    const fillPercentage = (100 * parseInt(value as string)) / (parseInt(max as string) - parseInt(min as string));
    // manual adjusted to account for native thumb stopping at the edges and not the center
    const adjustedFill = `calc(${fillPercentage}% - ${(-5 + 10 * (fillPercentage / 100)).toFixed(1)}px)`;
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
                <span className="fill" style={{ width: adjustedFill }} />
                <span className="thumb" style={{ left: adjustedFill }} />
            </div>
            {label && <label className="range-label">{label}</label>}
        </>
    );
};

export default RangeInput;
