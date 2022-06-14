import React from 'react';
import { Route, Switch, BrowserRouter } from 'react-router-dom';

import { LandingPage, RoomPage, NotFoundPage } from '../pages';

interface Router {
    routes: { [key: string]: Route };
}

const Router = (): React.ReactElement => {
    return (
        <BrowserRouter>
            <Switch>
                <Route component={LandingPage} exact path="/" />
                <Route component={RoomPage} path="/room/:roomId" />
                <Route component={NotFoundPage} />
            </Switch>
        </BrowserRouter>
    );
};

export default Router;
