import { Machine } from 'xstate';

import { assign } from '@xstate/immer';

export type GameActions = { type: 'MOVE_DOWN'; speed: number }
  | { type: 'MOVE_UP'; speed: number }
  | { type: 'MOVE_RIGHT'; speed: number }
  | { type: 'MOVE_LEFT'; speed: number }

interface ILevel {
  map: number[][];
  objects: number[][];
}

export interface GameContext {
  position: [number, number];
  level: ILevel;
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
    level: {
      map: [],
      objects: [],
    }
  },
  states: {
    initial: {
      on: {

        MOVE_DOWN: {
          actions: 'moveDown',
          cond: 'canMoveDown',
        },
        MOVE_UP: {
          actions: 'moveUp',
          cond: 'canMoveUp',
        },
        MOVE_RIGHT: {
          actions: 'moveRight',
          cond: 'canMoveRight',
        },
        MOVE_LEFT: {
          actions: 'moveLeft',
          cond: 'canMoveLeft',
        },
      },
    },
  }
}, {
  guards: {
    canMoveDown: (context, event: any) => {
      const next: [number, number] = [context.position[0], Math.floor(context.position[1] - event.speed)];
      return next[1] < 0
        ? false
        : isEmptyTile(context.level, next);
    },
    canMoveUp: (context, event: any) => {
      const next: [number, number] = [context.position[0], Math.ceil(context.position[1] + event.speed)];
      return next[1] >= context.level.map.length
        ? false
        : isEmptyTile(context.level, next);
    },
    canMoveRight: (context, event: any) => {
      const next: [number, number] = [Math.ceil(context.position[0] + event.speed), context.position[1]];
      return next[0] >= context.level.map[0].length
        ? false
        : isEmptyTile(context.level, next);
    },
    canMoveLeft: (context, event: any) => {
      const next: [number, number] = [Math.floor(context.position[0] - event.speed), context.position[1]];
      return next[0] < 0
        ? false
        : isEmptyTile(context.level, next);
    },
  },
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

const isEmptyTile = (level: ILevel, position: [number, number]) => {
  return level.objects[Math.floor(position[1])][Math.floor(position[0])] === 0;
}
