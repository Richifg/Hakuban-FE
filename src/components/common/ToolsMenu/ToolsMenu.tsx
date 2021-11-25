import React from 'react';
import { useDispatch, useSelector } from '../../../hooks';
import { setSelectedTool } from '../../../store/slices/toolSlice';
import type { Tool } from '../../../interfaces/board';

import './ToolsMenu.scss';

const tools: { name: Tool; icon: string }[] = [
    {
        name: 'PEN',
        icon: '',
    },
    {
        name: 'SHAPE',
        icon: '',
    },
    {
        name: 'POINTER',
        icon: '',
    },
];

const ToolsMenu = (): React.ReactElement => {
    const dispatch = useDispatch();
    const { selectedTool } = useSelector((s) => s.tools);

    const handleToolClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        const tool = e.currentTarget.value as Tool;
        if (selectedTool !== tool) dispatch(setSelectedTool(tool));
    };

    return (
        <div className="tools-menu">
            {tools.map((tool) => (
                <div className={`tool-container  ${selectedTool === tool.name ? 'selected' : ''}`} key={tool.name}>
                    <button value={tool.name} onClick={handleToolClick} className={'tool-button'}>
                        {tool.name}
                    </button>
                </div>
            ))}
        </div>
    );
};

export default ToolsMenu;
