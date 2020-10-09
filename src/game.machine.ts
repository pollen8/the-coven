import { Machine } from 'xstate';

import { assign } from '@xstate/immer';

export type GameActions = { type: 'MOVE_DOWN' }
  | { type: 'MOVE_UP' }
  | { type: 'MOVE_RIGHT' }
  | { type: 'MOVE_LEFT' }
  | { type: 'KEY_DOWN'; key: string; speed: number }

export interface GameContext {
  position: [number, number];
}

interface GameSchema {
  states: {
    initial: {};
  };
};

export const gameMachine = Machine<GameContext, GameSchema, GameActions>({
  id: 'gameMachine',
  initial: 'initial',
  context: {
    position: [0, 0],
  },
  states: {
    initial: {
      on: {
        KEY_DOWN: [
          {
            actions: 'moveDown',
            cond: (context, event) => {
              return event.key === 'ArrowDown';
            }
          },
          {
            actions: 'moveUp',
            cond: (context, event) => event.key === 'ArrowUp',
          },
          {
            actions: 'moveRight',
            cond: (context, event) => event.key === 'ArrowRight',
          },
          {
            actions: 'moveLeft',
            cond: (context, event) => event.key === 'ArrowLeft',
          }
        ],
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
      },
    },
  }
}, {
  actions: {
    moveDown: assign((context, event: any) => {
      context.position[1] = context.position[1] - event.speed;
    }),
    moveUp: assign((context, event: any) => {
      context.position[1] = context.position[1] + event.speed;
    }),
    moveRight: assign((context, event: any) => {
      context.position[0] = context.position[0] + event.speed;
    }),
    moveLeft: assign((context, event: any) => {
      context.position[0] = context.position[0] - event.speed;
    }),
  },
});
