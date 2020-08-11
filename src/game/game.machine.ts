import { Machine } from 'xstate';

import { assign } from '@xstate/immer';

import { cupboardMachine } from './cupboard.machine';

const tileHasProp = (context: any, event: any) => {
  const { grid, position } = context;
  const tile = grid[position.y][position.x];
  return tile.propImg;
}

export const gameMachine = Machine({
  id: 'gameMachine',
  initial: 'initial',
  states: {
    initial: {
      on: {
        MOVE_DOWN: {
          actions: 'moveDown',
        },
        MOVE_UP: {
          actions: 'moveUp',
        },
        MOVE_RIGHT: {
          actions: 'moveRight',
        },
        MOVE_LEFT: {
          actions: 'moveLeft',
        },
        CHECK_PICKUP_PROP: [{
          target: 'openCupboard',
          cond: tileHasProp,
        },
        {
          target: 'initial',
        }
        ],
      }
    },
    openCupboard: {
      invoke: {
        id: 'cupboardMachine',
        src: cupboardMachine,
        data: {
          cupboard: (context: any) => context.cupboard,
        },
        onDone: 'initial',
      }
    },


  }
}, {
  actions: {
    moveDown: assign((context: any, event: any) => {
      context.position = {
        ...context.position,
        y: Math.min(context.areaRows, context.position.y + 1),
        direction: 'down',
      }
    }),
    moveUp: assign((context: any, event: any) => {
      context.position = {
        ...context.position,
        y: Math.max(0, context.position.y - 1),
        direction: 'up',
      }
    }),
    moveRight: assign((context: any, event: any) => {
      context.position = {
        ...context.position,
        x: Math.min(context.areaCols, context.position.x + 1),
        direction: 'right',
      }
    }),
    moveLeft: assign((context: any, event: any) => {
      context.position = {
        ...context.position,
        x: Math.max(0, context.position.x - 1),
        direction: 'left',
      }
    }),


  },
});
