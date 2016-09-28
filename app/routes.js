import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './components/App';
import Home from './components/Home';
import About from './components/About';
import Articles from './components/Articles';
import Talks from './components/Talks';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Home} />
    <Route path="/about" component={About} />
    <Route path="/articles" component={Articles} />
    <Route path="/talks" component={Talks} />
  </Route>
);
