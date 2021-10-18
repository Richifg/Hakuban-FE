import React from 'react';
import { Provider } from 'react-redux';

import { store } from '../../store/store';

import { TestChat, Canvas } from '..';
import './App.scss';

const App = (): React.ReactElement => {
    return (
        <Provider store={store}>
            <div className="App">
                <div className="ui-container">
                    <div className="chat-container">
                        <TestChat />
                    </div>
                    <div className="temp-tools-container">TEMP</div>
                </div>
                <div className="canvas-container">
                    <Canvas />
                </div>
            </div>
        </Provider>
    );
};

export default App;
