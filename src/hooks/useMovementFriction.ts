import { useEffect, useRef } from 'react';

const FRICTION = 0.01;
const MIN_DV = 0.5;

const useMovementFriction = (
    currentdV: { dX: number; dY: number },
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
            const { dX, dY } = refs.current.currentdV;
            if ((dX !== 0 || dY !== 0) && refs.current.isActive) {
                if (!previousTimeStamp) previousTimeStamp = timeStamp;
                const time = timeStamp - previousTimeStamp;
                const dVx = dX - FRICTION * time * dX;
                const dVy = dY - FRICTION * time * dY;
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
