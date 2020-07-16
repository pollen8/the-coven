import React, { FC } from 'react';
import { Interpreter } from 'xstate';

import { People } from '../People';
import { AddWitchForm } from './AddWitchForm';

interface IProps {
  state: any;
  send: any;
  interpreter: Interpreter<any>;
}

export const HomePage: FC<IProps> = ({
  state,
  send,
  interpreter,
}) => {
  const service = interpreter.children.get('addWitchMachine');
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
      <button onClick={() => send('START_GAME')}>Start...</button>
      <button onClick={() => send('EDIT_GAME')}>Edit ...</button>
    </>
  )
}
