import { useEffect, useRef } from 'react';

const FRICTION = 0.0075;
const STOP_MIN_DV = FRICTION;

const useMovementFriction = (
    currentdV: { dX: number; dY: number },
    isActive: boolean,
    updateMovementCB: (x: number, y: number) => void,
    onFinishCB: () => void,
): void => {
    // refs needed for use inside animation callback
    const refs = useRef({ isActive, currentdV, preventSlide: false });
    refs.current = { ...refs.current, isActive, currentdV };

    // prevents a slide from happening if currentdV stops changing for a time (user stopped panning the screen)
    useEffect(() => {
        refs.current.preventSlide = false;
        const id = setTimeout(() => (refs.current.preventSlide = true), 100);
        return () => clearTimeout(id);
    }, [currentdV]);

    // starts the slide animation after isActive is triggered (user releases mouse button after panning)
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
                // round to zero if dV left is too small
                updateMovementCB(Math.abs(dVx) > STOP_MIN_DV ? dVx : 0, Math.abs(dVy) > STOP_MIN_DV ? dVy : 0);
                previousTimeStamp = timeStamp;
                id = window.requestAnimationFrame(animationFrameCB);
            } else {
                onFinishCB();
            }
        };

        if (isActive && !refs.current.preventSlide) {
            id = window.requestAnimationFrame(animationFrameCB);
        }
        return () => window.cancelAnimationFrame(id);
    }, [isActive]);
};

export default useMovementFriction;
