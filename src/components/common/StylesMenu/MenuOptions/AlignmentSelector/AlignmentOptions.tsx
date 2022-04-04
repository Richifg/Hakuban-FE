import React from 'react';
import { Align } from '../../../../../interfaces';

const options: { align: Align }[] = [{ align: 'start' }, { align: 'center' }, { align: 'end' }];

const AligmentOptions = (): React.ReactElement => {
    return (
        <>
            {options.map(({ align }) => (
                <option key={align} value={align}>
                    {align}
                </option>
            ))}
        </>
    );
};

export default AligmentOptions;
