import { useLayoutEffect, useState } from 'react';
import CanvasManager from '../CanvasManager/CanvasManager';
import type { CanvasSize, CanvasTransform, BoardItem } from '../interfaces';

function useCanvas(
    canvasRef: React.RefObject<HTMLCanvasElement>,
    canvasSize: CanvasSize,
    canvasTransform: CanvasTransform,
    showGrid: boolean,
    items: BoardItem[],
    selectedItems: BoardItem[],
): void {
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

    // keep manager variables updated
    if (manager) {
        manager.size = canvasSize;
        manager.transform = canvasTransform;
        manager.items = items;
        manager.showGrid = showGrid;
        manager.selectedItems = selectedItems;
    }
}

export default useCanvas;
