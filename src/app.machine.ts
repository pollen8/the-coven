import { Machine } from 'xstate';

import { editorMachine } from './editor/editor.machine';
import { gameMachine } from './game/game.machine';
import { addWitchMachine } from './landingPage/AddWitchForm';

// This machine is completely decoupled from React
export const appMachine = Machine({
  id: 'game',
  initial: 'landing',
  context: {
    grid: [],
    position: { x: 0, y: 0 },
    areaCols: 0,
    areaRows: 0,
    cupboard: {
      capacity: 20,
      items: [],
    },
  },
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
        id: 'gameMachine',
        src: gameMachine,
        data: {
          grid: (context: any) => context.grid,
          center: (context: any) => context.center,
          position: (context: any) => context.position,
          areaRows: (context: any) => context.areaRows,
          areaCols: (context: any) => context.areaCols,
          cupboard: (context: any) => context.cupboard,
        }
      }
    },
    editing: {
      invoke: {
        id: 'editorMachine',
        src: editorMachine,
        data: {
          grid: (context: any) => context.grid,
          center: (context: any) => context.center,
          position: (context: any) => context.position,
          areaRows: (context: any) => context.areaRows,
          areaCols: (context: any) => context.areaCols,
        }
      }
    }
  }
});
