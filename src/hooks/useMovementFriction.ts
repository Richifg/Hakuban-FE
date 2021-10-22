import { useEffect, useRef } from 'react';

const FRICTION = 0.01;
const MIN_DV = 0.5;

const useMovementFriction = (
    currentdV: { x: number; y: number },
    isActive: boolean,
    updateMovementCB: (x: number, y: number) => void,
    onFinishCB: () => void,
): void => {
    // parameters need to be kept updated on refs so animationFrameCB can read latest values
    const refs = useRef({ currentdV, isActive });
    refs.current = { currentdV, isActive };

    useEffect(() => {
        let id: number;
        let previousTimeStamp: DOMHighResTimeStamp;

        const animationFrameCB = (timeStamp: DOMHighResTimeStamp) => {
            const { x, y } = refs.current.currentdV;
            if ((x !== 0 || y !== 0) && refs.current.isActive) {
                if (!previousTimeStamp) previousTimeStamp = timeStamp;
                const time = timeStamp - previousTimeStamp;
                const dVx = x - FRICTION * time * x;
                const dVy = y - FRICTION * time * y;
                updateMovementCB(Math.abs(dVx) > MIN_DV ? dVx : 0, Math.abs(dVy) > MIN_DV ? dVy : 0);
                previousTimeStamp = timeStamp;
                id = window.requestAnimationFrame(animationFrameCB);
            } else {
                onFinishCB();
            }
        };

        if (isActive) {
            id = window.requestAnimationFrame(animationFrameCB);
        }
        return () => window.cancelAnimationFrame(id);
    }, [isActive]);
};

export default useMovementFriction;
