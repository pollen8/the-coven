import { Machine } from 'xstate';

import { assign } from '@xstate/immer';

export interface IPosition {
  x: number;
  y: number;
};

export type GameActions = { type: 'MOVE_DOWN' }
  | { type: 'MOVE_UP' }
  | { type: 'MOVE_RIGHT' }
  | { type: 'MOVE_LEFT' }
  | { type: 'KEY_DOWN'; key: string; }

export interface GameContext {
  position: IPosition;
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
    position: { x: 0, y: 0 },
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
    moveDown: assign((context) => {
      context.position = {
        ...context.position,
        y: Math.max(0, context.position.y - 1),
      }
    }),
    moveUp: assign((context) => {
      context.position = {
        ...context.position,
        y: context.position.y + 1,
      }
    }),
    moveRight: assign((context) => {
      context.position = {
        ...context.position,
        x: context.position.x + 1,
      }
    }),
    moveLeft: assign((context) => {
      context.position = {
        ...context.position,
        x: context.position.x - 1,
      }
    }),
  },
});
