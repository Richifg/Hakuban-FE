import React from 'react';
import { LineType } from '../../../../../interfaces';

const lineTypeOptions: { icon: string; type: LineType }[] = [
    { type: 'straight', icon: '' },
    { type: 'stepped', icon: '' },
    { type: 'curved', icon: '' },
];

const LineTypeOptions = (): React.ReactElement => {
    return (
        <>
            {lineTypeOptions.map(({ type }) => (
                <option key={type} value={type}>
                    {type}
                </option>
            ))}
        </>
    );
};

export default LineTypeOptions;
