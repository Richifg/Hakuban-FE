import React from 'react';
import { useDispatch, useSelector } from '../../../hooks';
import { setSelectedTool } from '../../../store/slices/toolSlice';
import { setCurrentAction } from '../../../store/slices/boardSlice';
import { selectItems } from '../../../BoardStateMachine/BoardStateMachineUtils';
import type { Tool } from '../../../interfaces/board';
import tools from './tools';

import './ToolsMenu.scss';

const ToolsMenu = (): React.ReactElement => {
    const dispatch = useDispatch();
    const { selectedTool } = useSelector((s) => s.tools);

    const handleToolClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        const tool = e.currentTarget.value as Tool;
        if (selectedTool !== tool) {
            dispatch(setSelectedTool(tool));
            dispatch(setCurrentAction('IDLE'));
            selectItems();
        }
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
