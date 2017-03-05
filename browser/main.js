// Import stylesheets!
require('./styles/main.scss');

import React from 'react';
import { render } from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';

import Matchup from './components/matchup';
import Rankings from './components/rankings';
import Login from './components/login';

const mainRender = (
    <Router history={browserHistory}>
        <Route path="/" component={Matchup} />
        <Route path="/login" component={Login} />
        <Route path="/rankings" component={Rankings} />
    </Router>
);

render(mainRender, document.getElementById('rh-app'));