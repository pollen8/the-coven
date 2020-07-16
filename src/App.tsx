import './App.css';

import React from 'react';
import {
  BrowserRouter as Router,
  Link,
  Route,
  Switch,
} from 'react-router-dom';

import { ApolloProvider } from '@apollo/react-hooks';
// import { useMachine } from '../path/to/useMachine';
import { useMachine } from '@xstate/react';

import { client } from './client';
import { gameMachine } from './game.machine';
import { HomePage } from './landingPage/HomePage';
import { People } from './People';

function App() {
  const [current, send] = useMachine(gameMachine);
  // console.log('current', current);
  return (
    <ApolloProvider client={client}>
      <Router>
        <div className="App">
          <HomePage />
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
