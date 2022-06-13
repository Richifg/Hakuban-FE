import React from 'react';
import { LinePattern } from '../../../../../interfaces';

const optoins: { icon: string; pattern: LinePattern }[] = [
    { pattern: 0, icon: '' },
    { pattern: 1, icon: '' },
    { pattern: 2, icon: '' },
    { pattern: 3, icon: '' },
];

const LinePatternOptions = (): React.ReactElement => {
    return (
        <>
            {optoins.map(({ pattern }) => (
                <option key={pattern} value={pattern}>
                    {pattern}
                </option>
            ))}
        </>
    );
};

export default LinePatternOptions;
