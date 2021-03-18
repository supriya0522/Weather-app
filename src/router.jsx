import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import {Weather, Weathers} from './apps';

class Routes extends Component {
  render() {
    return (
      <BrowserRouter>
        <React.Suspense>
          <Switch>
            <Route exact path='/' component={Weather} />
            <Route exact path='/weather' component={Weathers} />
          </Switch>
        </React.Suspense>
      </BrowserRouter>
    );
  }
}

export default (Routes);
