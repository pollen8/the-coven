import { createMachine } from 'xstate';

import { assign } from '@xstate/immer';

import {
  astar,
  Graph,
} from '../@core/astar';
import {
  GraphStep,
  Level,
  MapPosition,
} from '../game.machine';

export const characterMachine = createMachine({
  id: 'character',
  tsTypes: {} as import('./character.machine.typegen').Typegen0,
  schema: {
    context: {} as {
      position: MapPosition;
      direction: 'right' | 'left';
      path: GraphStep[];
      level?: Level;
    },
    events: {} as { type: 'MOVE_DOWN'; speed: number }
    | { type: 'MOVE_UP'; speed: number }
    | { type: 'MOVE_RIGHT'; speed: number }
    | { type: 'MOVE_LEFT'; speed: number }
    | { type: 'MOVE_CHARACTER_TO'; position: [number, number] }
    | { type: 'SET_LEVEL'; level: Level }
  },
  context: {
    direction: 'right',
    position: [0, 0],
    path: [],
    level: undefined,
  },
  initial: 'idle',
  on: {
    SET_LEVEL: {
      actions: 'setLevel',
    },
    MOVE_LEFT: {
      actions: 'moveLeft',
      target: 'stepping',
    },
    MOVE_RIGHT: {
      actions: 'moveRight',
      target: 'stepping',
    },
    MOVE_UP: {
      target: 'stepping',
      actions: 'moveUp',
    },
    MOVE_DOWN: {
      actions: 'moveDown',
      target: 'stepping',
    },
    MOVE_CHARACTER_TO: {
      actions: 'makePath',
      target: 'moving',
    },
  },
  states: {
    idle: {

    },
    stepping: {
      after: {
        100: {
          target: 'idle',
        }
      }
    },
    talking: {},
    moving: {
      on: {
        MOVE_CHARACTER_TO: {
          actions: 'makePath',
          target: 'moving',
        },
      },
      always: { target: 'idle', cond: 'hasNoPath' },
      after: {
        100: {
          actions: ['step', 'popPath'],
          target: 'moving',
          cond: 'hasPath',
        },
      },
    },
  },
}, {
  guards: {
    hasPath: (context) => context.path.length > 0,
    hasNoPath: (context) => context.path.length === 0,

  },
  actions: {
    setLevel: assign((context, event) => context.level = event.level),
    makePath: assign((context, event: any) => {
      if (!context.level) {
        return;
      }
      const graph = new Graph(context.level.walls, { diagonal: true });
      const { x, y } = charPositionToMapRef(context.level, context.position);
      const start = graph.grid[y][x];
      const end = graph.grid[event.position[1]][event.position[0]];

      if (!end) {
        return;
      }

      const result = astar.search(graph, start, end, { closest: true });

      context.path = result;
    }),
    popPath: assign(context => {
      if (context.path.length === 0) {
        return;
      }

      context.path = context.path.slice(1);
    }),
    moveLeft: assign((context) => {
      context.position[0] = context.position[0] - 1;
      context.direction = 'left';
    }),
    moveRight: assign((context) => {
      context.position[0] = context.position[0] + 1;
      context.direction = 'right';
    }),
    moveUp: assign(context => context.position[1] = context.position[1] - 1),
    moveDown: assign(context => context.position[1] = context.position[1] + 1),
    step: assign(context => {
      if (context.path.length === 0) {
        return;
      }

      const next = context.path[0];
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
  }
});

/**
 * The camera is centered on 0,0 so tiles above this have a negative number
 * Take the player coordinates in the tiles and translate to the x,y array values for the map
 */
const charPositionToMapRef = (level: Level, position: [number, number]) => {
  const h = level.map.length;
  const w = level.map[0].length;
  const x = position[0] + Math.ceil(w / 2);
  const y = position[1] - Math.ceil(h / 2) + h;
  return { x, y };
};
