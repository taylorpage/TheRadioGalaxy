import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, hashHistory, browserHistory, IndexRoute, Redirect} from 'react-router';
import Main from './containers/main/Main';
import Login from './components/login/Login';
import Signup from './components/signup/Signup';
import Articles from './components/articles/Articles';
import TopTracks from './components/topTracks/TopTracks';

export default(
  <Router>
    <Route path='/' component={ Main }/>
    <Route path='/login' component={ Login }/>
    <Route path='/signup' component={ Signup }/>
    <Route path='/articles' component={ Articles }/>
    <Route path='/TopTracks' component={ TopTracks }/>
  </Router>
)