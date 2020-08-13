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
import {
  areaCols,
  areaRows,
  grid,
  position,
} from './game/buildMap';
import { GameUI } from './game/GameUI';
import { HomePage } from './landingPage/HomePage';

function App() {
  let context: any = localStorage.getItem('the-coven');
  context = context ? JSON.parse(context) : {
    grid,
    areaCols,
    areaRows,
    position,
  };

  const [current, send, interpreter] = useMachine(appMachine, {
    devTools: true,
    context,
  });

  return (
    <ApolloProvider client={client}>
      <Router>
        <DndProvider backend={HTML5Backend}>
          <div className="App">
            {
              (current.matches('landing') || current.matches('addWitch')) && <HomePage
                state={current}
                send={send}
                interpreter={interpreter} />
            }
            {
              current.matches('playing') && <GameUI
                current={current} />
            }
            {
              current.matches('editing') && <Editor
                interpreter={interpreter} />
            }
          </div>
        </DndProvider>
      </Router>
    </ApolloProvider>
  );
}

export default App;
