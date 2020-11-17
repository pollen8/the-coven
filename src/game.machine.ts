import { Machine } from 'xstate';

import { assign } from '@xstate/immer';

import {
  astar,
  Graph,
} from './@core/astar';

export type GameActions = { type: 'MOVE_DOWN'; speed: number }
  | { type: 'MOVE_UP'; speed: number }
  | { type: 'MOVE_RIGHT'; speed: number }
  | { type: 'MOVE_LEFT'; speed: number }
  | { type: 'MOVE_CHARACTER_TO', position: [number, number] };

export interface ILevel {
  map: number[][];
  /** 0 = can't go through - otherwise the value indicates the cost to move through this area */
  walls: number[][];
  scenery: number[][];
  objects: number[][];
}

export interface GameContext {
  position: [number, number];
  level: ILevel;
  path: IGraphStep[];
}


interface GameSchema {
  states: {
    initial: {};
    moving: {},
  };
};

interface IGraphStep {
  parent: { x: number, y: number },
  x: number;
  y: number;
  weight: number;
}

export const gameMachine = Machine<GameContext, GameSchema, GameActions>({
  id: 'gameMachine',
  initial: 'initial',
  context: {
    position: [0, 0],
    path: [],
    level: {
      map: [],
      walls: [],
      scenery: [],
      objects: [],
    }
  },
  states: {
    initial: {
      on: {
        MOVE_CHARACTER_TO: {
          actions: 'makePath',
          target: 'moving',
        },
      },
    },
    moving: {
      on: {
        MOVE_CHARACTER_TO: {
          actions: 'makePath',
          target: 'moving',
        },
      },
      always: { target: 'initial', cond: 'hasNoPath' },
      after: {
        1: {
          actions: [{ type: 'step' }, 'popPath'],
          target: 'moving',
          cond: 'hasPath',
        }
      }
    }
  }
}, {
  guards: {
    hasPath: (context) => context.path.length > 0,
    hasNoPath: (context) => {
      return context.path.length === 0;
    },
  },
  actions: {
    makePath: assign((context, event: any) => {
      const graph = new Graph(context.level.walls, { diagonal: true })
      const start = graph.grid[context.position[1]][context.position[0]];
      const end = graph.grid[event.position[1]][event.position[0]];
      var result = astar.search(graph, start, end, { closest: true });

      context.path = result;
    }),
    popPath: assign((context) => {
      if (context.path.length === 0) {
        return;
      }
      context.path = context.path.slice(1);
    }),
    step: assign((context) => {
      if (context.path.length === 0) {
        return;
      }
      const next = context.path[0];
      console.log('next', next);
      const xDelta = next.x - next.parent.x;
      const yDelta = next.y - next.parent.y;
      if (yDelta === 1) {
        context.position[0] = context.position[0] + 1;
      }
      if (yDelta === -1) {
        context.position[0] = context.position[0] - 1;
      }
      if (xDelta === 1) {
        context.position[1] = context.position[1] + 1;
      }
      if (xDelta === -1) {
        context.position[1] = context.position[1] - 1;
      }
    }),

  },
});
