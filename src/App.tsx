import './App.css';

import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { BrowserRouter as Router } from 'react-router-dom';

import { ApolloProvider } from '@apollo/react-hooks';
import { useMachine } from '@xstate/react';

import { appMachine } from './app.machine';
import { client } from './client';
import { Editor } from './editor/Editor';
import { GameUI } from './game/GameUI';
import { HomePage } from './landingPage/HomePage';

function App() {
  const [current, send, interpreter] = useMachine(appMachine, {
    devTools: true,
  });
  console.log('current', current);
  return (
    <ApolloProvider client={client}>
      <Router>
        <DndProvider backend={HTML5Backend}>
          <div className="App">
            {
              current.matches('landing') && <HomePage
                state={current}
                send={send}
                interpreter={interpreter} />
            }
            {
              current.matches('playing') && <GameUI />
            }
            {
              current.matches('editing') && <Editor />
            }
          </div>
        </DndProvider>
      </Router>
    </ApolloProvider>
  );
}

export default App;
