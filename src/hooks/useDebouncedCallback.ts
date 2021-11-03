/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback } from 'react';
import { getDebouncedFunction } from '../utils';

function useDebouncedCallback<F extends (...args: any[]) => void>(
    cb: F,
    delay: number,
    deps: any[],
): (...args: Parameters<F>) => void {
    const debouncedCallback = useCallback(getDebouncedFunction(cb, delay), deps);
    return debouncedCallback;
}

export default useDebouncedCallback;
