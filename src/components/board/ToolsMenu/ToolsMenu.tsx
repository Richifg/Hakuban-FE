import React from 'react';
import { useDispatch, useSelector } from '../../../hooks';
import { setSelectedShapeType, setSelectedTool } from '../../../store/slices/toolSlice';
import { setCurrentAction } from '../../../store/slices/boardSlice';
import { selectItems } from '../../../BoardStateMachine/BoardStateMachineUtils';
import { MenuContainer, MenuItem, Icon } from '../../common';
import type { Tool, ShapeType } from '../../../interfaces';

import { toolOptions, shapeOptions } from './options';
import styles from './ToolsMenu.module.scss';

const ToolsMenu = (): React.ReactElement => {
    const dispatch = useDispatch();
    const { selectedTool, selectedShapeType } = useSelector((s) => s.tools);

    const handleToolSelect = (tool: Tool) => {
        if (selectedTool !== tool) dispatch(setSelectedTool(tool));
        else dispatch(setSelectedTool('POINTER'));
        dispatch(setCurrentAction('IDLE'));
        selectItems();
    };

    const handleShapeSelect = (shape: ShapeType) => {
        if (selectedShapeType !== shape) {
            dispatch(setSelectedTool('SHAPE'));
            dispatch(setSelectedShapeType(shape));
        }
    };

    return (
        <MenuContainer className={styles.toolsMenu}>
            {toolOptions.map(([toolIcon, tool]) => (
                <MenuItem
                    key={tool}
                    type={tool === 'SHAPE' ? 'sub' : 'button'}
                    iconName={toolIcon}
                    onClick={tool === 'SHAPE' ? undefined : () => handleToolSelect(tool)}
                    selected={selectedTool === tool}
                >
                    {tool === 'SHAPE' && (
                        <div className={styles.shapesMenu}>
                            {shapeOptions.map(([shapeIcon, shape]) => (
                                <div
                                    tabIndex={0}
                                    key={shape}
                                    className={`${styles.shapeOption} ${shape === selectedShapeType ? styles.selected : ''}`}
                                    onClick={() => handleShapeSelect(shape)}
                                >
                                    <Icon name={shapeIcon} />
                                </div>
                            ))}
                        </div>
                    )}
                </MenuItem>
            ))}
        </MenuContainer>
    );
};

export default ToolsMenu;
