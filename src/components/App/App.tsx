import React from 'react';
import { Shape } from '../../common/interfaces/shapes';

import { TestConnection, Canvas } from '..';
import './App.scss';

const shapes: Shape[] = [
    { type: 'rect', x: 50, y: 36, width: 38, height: 80 },
    { type: 'rect', x: 1, y: 41, width: 100, height: 20, style: { strokeColor: 'blue' } },
    { type: 'rect', x: 150, y: 80, width: 65, height: 200, style: { strokeColor: 'black', backgroundColor: 'pink' } },
    { type: 'rect', x: 10, y: 201, width: 50, height: 20, style: { backgroundColor: 'green' } },
];

const App = (): React.ReactElement => {
    return (
        <div className="App">
            <div className="ui-container">
                <div className="chat-container">
                    <TestConnection roomId="test" />
                </div>
                <div className="temp-tools-container">TEMP</div>
            </div>
            <div className="canvas-container">
                <Canvas shapes={shapes} />
            </div>
        </div>
    );
};

export default App;
