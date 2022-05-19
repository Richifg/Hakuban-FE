import { useLayoutEffect, useState } from 'react';
import CanvasManager from '../CanvasManager/CanvasManager';
import type { BoardItem } from '../interfaces';

function useCanvas(canvasRef: React.RefObject<HTMLCanvasElement>, items: BoardItem[]): void {
    const [manager, setManager] = useState<CanvasManager>();

    // captures the rendering context before first render
    useLayoutEffect(() => {
        const renderingContext = canvasRef.current?.getContext('2d');
        if (renderingContext) {
            const manager = new CanvasManager(renderingContext);
            setManager(manager);
            manager.animate();
        }
        // stops animation when unmounting
        return () => {
            manager?.stop();
        };
    }, []);

    // keep items updated
    if (manager) manager.items = items;
}

export default useCanvas;
