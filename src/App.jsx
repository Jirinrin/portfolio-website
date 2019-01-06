import React, { Component } from 'react';
import store from './store';
import {Provider} from 'react-redux';

import Navbar from './components/Navbar';
import GithubCode from './components/GithubCode';
import LandscapeContainer from './components/LandscapeContainer';

import './App.scss';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <div className="App">
          <Navbar />
          <div id="main">
            <GithubCode />
            <LandscapeContainer />
          </div>
        </div>
      </Provider>
    );
  }
}

export default App;