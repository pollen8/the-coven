import { createMachine } from 'xstate';

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
      path: GraphStep[];
      level?: Level;
    },
    events: {} as { type: 'MOVE_DOWN'; speed: number }
    | { type: 'MOVE_UP'; speed: number }
    | { type: 'MOVE_RIGHT'; speed: number }
    | { type: 'MOVE_LEFT'; speed: number }
    | { type: 'MOVE_CHARACTER_TO'; position: [number, number] }
  },
  context: {
    position: [0, 0],
    path: [],
    level: undefined,
  },
  initial: 'idle',
  on: {
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
    makePath: ((context, event: any) => {
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
    popPath: (context => {
      if (context.path.length === 0) {
        return;
      }

      context.path = context.path.slice(1);
    }),
    moveLeft: (context) => {
      console.log('move lefet', context);
      context.position[0] = context.position[0] - 1;
    },
    moveRight: (context => context.position[0] = context.position[0] + 1),
    moveUp: (context => context.position[1] = context.position[1] - 1),
    moveDown: (context => context.position[1] = context.position[1] + 1),
    step: (context => {
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
