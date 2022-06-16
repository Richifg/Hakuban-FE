import React from 'react';
import { ArrowType } from '../../../../../interfaces';

const arrowOptions: { icon: string; style: ArrowType }[] = [
    { style: 'none', icon: '' },
    { style: 'triangle', icon: '' },
    { style: 'simple', icon: '' },
    { style: 'circle', icon: '' },
];

interface ArrowOptions {
    flipIcon?: boolean;
}

const ArrowOptions = ({ flipIcon }: ArrowOptions): React.ReactElement => {
    return (
        <>
            {arrowOptions.map(({ style }) => (
                <option key={style} value={style}>
                    {style} {flipIcon ? 'L' : 'R'}
                </option>
            ))}
        </>
    );
};

export default ArrowOptions;
