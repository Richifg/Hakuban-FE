import React from 'react';

import { TestConnection, Canvas } from '..';
import './App.scss';

const App = (): React.ReactElement => (
    <div className="App">
        <div className="canvas-container">
            <Canvas />
        </div>
        <div className="ui-container">
            <div className="chat-container">
                <TestConnection roomId="test" />
            </div>
            <div className="temp-tools-container">TEMP</div>
        </div>
    </div>
);

export default App;
