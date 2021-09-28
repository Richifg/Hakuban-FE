import React from 'react';

import { TestConnection } from '..';
import './App.scss';

const App = (): React.ReactElement => (
    <div className="App">
        <h1>Test Chat</h1>
        <TestConnection roomId="test" />
    </div>
);

export default App;
