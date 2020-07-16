import { Machine } from 'xstate';

import { gameMachine } from './game/game.machine';
import { addWitchMachine } from './landingPage/AddWitchForm';

// This machine is completely decoupled from React
export const appMachine = Machine({
  id: 'game',
  initial: 'landing',
  states: {
    landing: {
      id: 'landing',
      on: {
        CREATE_WITCH: 'addWitch',
        START_GAME: 'playing',
        EDIT_GAME: 'editing',
      }
    },
    addWitch: {
      invoke: {
        src: addWitchMachine,
        id: 'addWitchMachine',
        onDone: '#landing',
      },
    },
    playing: {
      invoke: {
        src: gameMachine,
      }
    },
    editing: {

    }
  }
});
