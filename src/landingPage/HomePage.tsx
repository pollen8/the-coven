import React from 'react';

import { useMachine } from '@xstate/react';

import { gameMachine } from '../game.machine';
import { AddWitchForm } from './AddWitchForm';

export const HomePage = () => {
  const [state, send, intepreter] = useMachine(gameMachine, {
    devTools: true,
    // services: {
    //   addWitch: () => {
    //     console.log('add witch');
    //     return Promise.resolve();
    //   }
    // }
  });
  console.log('homepage state', state);
  return (
    <>
      <h1>Witches</h1>
      {
        state.matches('landing') &&

        <button
          type="button"
          onClick={() => send('CREATE_WITCH')}>
          Create witch
    </button>
      }
      {
        state.matches('addWitch') &&
        <AddWitchForm intepreter={intepreter} />
      }
    </>
  )
}
