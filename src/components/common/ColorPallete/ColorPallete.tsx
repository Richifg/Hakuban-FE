import React from 'react';
import { useSelector, useDispatch } from '../../../hooks';
import { updateNewColorIndex, addCustomColor } from '../../../store/slices/toolSlice';
import { Icon } from '..';

import styles from './ColorPallete.module.scss';

interface ColorSelector {
    color: string;
    defaultOptions: string[];
    onChange(color: string): void;
}

const ColorSelector = ({ color, defaultOptions, onChange }: ColorSelector): React.ReactElement => {
    const dispatch = useDispatch();
    const { customColors } = useSelector((s) => s.tools);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        const color = e.currentTarget.value;
        onChange(color);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const color = e.currentTarget.value;
        dispatch(addCustomColor(color));
    };

    return (
        <div className={styles.colorPallete}>
            {[...defaultOptions, ...customColors].map((colorOption) => (
                <div
                    key={colorOption}
                    className={`${styles.colorContainer} ${color === colorOption ? styles.selected : ''} ${
                        colorOption === 'transparent' ? styles.transparent : ''
                    }`}
                    style={{ backgroundColor: colorOption }}
                >
                    <button className={`${styles.button} `} onClick={handleClick} value={colorOption} />
                </div>
            ))}
            <div className={styles.colorContainer}>
                <button className={`${styles.button} ${styles.newColor}`} onClick={() => dispatch(updateNewColorIndex())}>
                    <Icon name="plus" />
                    <input className={styles.colorInput} type="color" onInput={handleChange} onChange={handleChange} />
                </button>
            </div>
        </div>
    );
};

export default ColorSelector;
