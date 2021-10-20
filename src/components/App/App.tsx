import React from 'react';
import { Provider } from 'react-redux';

import { store } from '../../store/store';
import Router from '../Router/Router';

const App = (): React.ReactElement => {
    return (
        <Provider store={store}>
            <Router />
        </Provider>
    );
};

export default App;
