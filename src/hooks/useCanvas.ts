import { useLayoutEffect, useEffect, useState } from 'react';
import CanvasManager from '../CanvasManager/CanvasManager';
import type { CanvasSize, CanvasTransform, BoardItem } from '../interfaces';

function useCanvas(
    canvasRef: React.RefObject<HTMLCanvasElement>,
    canvasSize: CanvasSize,
    canvasTransform: CanvasTransform,
    items: BoardItem[],
): void {
    const [manager, setManager] = useState<CanvasManager>();

    // captures the rendering context before first render
    useLayoutEffect(() => {
        const renderingContext = canvasRef.current?.getContext('2d');
        if (renderingContext) {
            const manager = new CanvasManager(renderingContext, canvasSize, canvasTransform, items);
            setManager(manager);
            manager.animate();
        }
        // stops animation when unmounting
        return () => {
            manager?.stop();
        };
    }, []);

    // keeps manager variables updated
    useEffect(() => {
        if (manager) {
            manager.size = canvasSize;
            manager.transform = canvasTransform;
            manager.items = items;
        }
    }, [canvasSize, canvasTransform, items]);
}

export default useCanvas;
