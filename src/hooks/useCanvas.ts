import { useLayoutEffect, useEffect, useState } from 'react';
import CanvasManager from '../CanvasManager/CanvasManager';
import type { CanvasSize, CanvasTransform, Item } from '../interfaces';

function useCanvas(
    canvasRef: React.RefObject<HTMLCanvasElement>,
    canvasSize: CanvasSize,
    canvasTransform: CanvasTransform,
    items: Item[],
): void {
    const [manager, setManager] = useState<CanvasManager>();

    // capture the rendering context before first render
    useLayoutEffect(() => {
        const renderingContext = canvasRef.current?.getContext('2d');
        if (renderingContext) {
            const manager = new CanvasManager(renderingContext, canvasSize, canvasTransform, items);
            setManager(manager);
            manager.animate();
        }
        // stop animation when unmounting
        return () => {
            manager?.stop();
        };
    }, []);

    // update manager variables
    useEffect(() => {
        if (manager) {
            manager.size = canvasSize;
            manager.transform = canvasTransform;
            manager.items = items;
        }
    }, [canvasSize, canvasTransform, items]);
}

export default useCanvas;
