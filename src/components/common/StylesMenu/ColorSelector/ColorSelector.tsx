import React from 'react';
import { ShapeStyle, TextStyle } from '../../../../interfaces';
import colorOptions from './colorOptions';
import './ColorSelector.scss';

interface ColorSelector {
    styleKey: keyof ShapeStyle | keyof TextStyle;
    onChange(value: string, key: string): void;
}

const ColorSelector = ({ onChange, styleKey }: ColorSelector): React.ReactElement => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        const { value } = e.currentTarget;
        onChange(value, styleKey);
    };

    return (
        <div className="color-selector">
            {styleKey}
            <div className="color-options">
                {colorOptions.map((color) => (
                    <button
                        className="color-button"
                        style={{ backgroundColor: color }}
                        key={color}
                        onClick={handleClick}
                        value={color}
                    ></button>
                ))}
            </div>
        </div>
    );
};

export default ColorSelector;
