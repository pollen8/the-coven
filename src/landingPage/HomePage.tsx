import React from 'react';

import { useMachine } from '@xstate/react';

import { gameMachine } from '../game.machine';
import { People } from '../People';
import { AddWitchForm } from './AddWitchForm';

export const HomePage = () => {
  const [state, send, intepreter] = useMachine(gameMachine, {
    devTools: true,
  });
  // console.log('homepage state', state);
  const service = intepreter.children.get('addWitchMachine');
  return (
    <>
      <h1>Witches</h1>
      {
        state.matches('landing') &&
        <>
          <People role="witch" />
          <button
            type="button"
            onClick={() => send('CREATE_WITCH')}>
            Create witch
    </button>
        </>
      }
      <h1>Villagers</h1>
      {
        state.matches('landing') &&
        <>
          <People role="villager" />
        </>
      }
      {
        service &&
        state.matches('addWitch') &&
        <AddWitchForm
          service={service} />
      }
    </>
  )
}
