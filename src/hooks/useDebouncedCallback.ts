/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback } from 'react';
import { getDebouncedFunction } from '../utils';

function useDebouncedCallback<F extends (...args: any[]) => void>(
    cb: F,
    delay: number,
    dependencies?: any[],
): (...args: Parameters<F>) => void {
    const deps = dependencies || [];
    const debouncedCallback = useCallback(getDebouncedFunction(cb, delay), deps);
    return debouncedCallback;
}

export default useDebouncedCallback;
