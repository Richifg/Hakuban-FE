import { useEffect, useRef } from 'react';

const FRICTION = 0.01;
const MIN_SLIDE = 0.5;

const useMovementFriction = (
    currentMovement: { x: number; y: number },
    isActive: boolean,
    updateMovementCB: (x: number, y: number) => void,
    onFinishCB: () => void,
): void => {
    // parameters need to be kept updated on refs so animationFrameCB can read latest values
    const refs = useRef({ currentMovement, isActive });
    refs.current = { currentMovement, isActive };

    useEffect(() => {
        let id: number;
        let previousTimeStamp: DOMHighResTimeStamp;

        const animationFrameCB = (timeStamp: DOMHighResTimeStamp) => {
            const { x, y } = refs.current.currentMovement;
            if ((x !== 0 || y !== 0) && refs.current.isActive) {
                if (!previousTimeStamp) previousTimeStamp = timeStamp;
                const time = timeStamp - previousTimeStamp;
                const newX = x - FRICTION * time * x;
                const finalX = Math.abs(newX) > MIN_SLIDE ? newX : 0;
                const newY = y - FRICTION * time * y;
                const finalY = Math.abs(newY) > MIN_SLIDE ? newY : 0;
                updateMovementCB(finalX, finalY);
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
