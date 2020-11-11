import { astar } from 'javascript-astar';
import { Machine } from 'xstate';

import { assign } from '@xstate/immer';

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
  //  Used for A-Stat path finding
  graph: {
    grid: any[]
  };
  // AStar path to interate over
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
    graph: {
      grid: [],
    },
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
  // @TODO the guard logic needs to be updated as we've flipped over the map x rows to start at the top
  guards: {
    canMoveUp: (context, event: any) => {
      const next: [number, number] = [context.position[0], Math.ceil(context.position[1] + event.speed)];
      return next[1] >= context.level.map.length
        ? false
        : isEmptyTile(context.level, next);
    },
    canMoveDown: (context, event: any) => {
      const next: [number, number] = [context.position[0], Math.floor(context.position[1] - event.speed)];
      return next[1] < 0
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
    hasPath: (context) => context.path.length > 0,
    hasNoPath: (context) => context.path.length === 0,
  },
  actions: {
    makePath: assign((context, event: any) => {
      const grid = context.graph.grid;
      console.log(grid, event.position);
      const start = grid[context.position[0]][context.position[1]];
      const end = grid[event.position[0]][event.position[1]];
      var result = astar.search(context.graph, start, end);
      console.log('result', result, start, end);
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
        console.log('move up');
        context.position[1] = context.position[1] + 1;
      }
      if (yDelta === -1) {
        console.log('move down');
        context.position[1] = context.position[1] - 1;
      }
      if (xDelta === 1) {
        console.log('move right');
        context.position[0] = context.position[0] + 1;
      }
      if (xDelta === -1) {
        console.log('move left');
        context.position[0] = context.position[0] - 1;
      }
      console.log(xDelta, yDelta);
    }),
    moveDown: assign((context, event: any) => {
      console.log('move down ', event);
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
  return level.scenery[Math.floor(position[1])][Math.floor(position[0])] === 0;
}
