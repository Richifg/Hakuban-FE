import React from 'react';
import { Route, Switch, BrowserRouter } from 'react-router-dom';

import { HomePage, RoomPage, NotFoundPage } from '../pages';

interface Router {
    routes: { [key: string]: Route };
}

const Router = (): React.ReactElement => {
    return (
        <BrowserRouter>
            <Switch>
                <Route component={HomePage} exact path="/" />
                <Route component={RoomPage} path="/room" />
                <Route component={NotFoundPage} />
            </Switch>
        </BrowserRouter>
    );
};

export default Router;