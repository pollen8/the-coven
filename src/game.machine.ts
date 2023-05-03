import {
  ActorRefFrom,
  createMachine,
  sendTo,
  spawn,
} from 'xstate';

import { assign } from '@xstate/immer';

import {
  astar,
  Graph,
} from './@core/astar';
import { cauldronMachine } from './cauldron/cauldron.machine';
import {
  cupboardMachine,
  IItem,
} from './cupboard/cupboard.machine';
import { items } from './items';
import { spellBookMachine } from './spellbook/spellbook.machine';

export type ILevel = {
  map: number[][];
  /** 0 = can't go through - otherwise the value indicates the cost to move through this area */
  walls: number[][];
  scenery: number[][];
  objects: number[][];
};

type IGraphStep = {
  parent: { x: number; y: number };
  x: number;
  y: number;
  weight: number;
};

type WindowState = {
  spellBook: {
    open: boolean;
    actor: ActorRefFrom<typeof spellBookMachine> | null;
  };
  cupboard: {
    open: boolean;
    actor: ActorRefFrom<typeof cupboardMachine> | null;
  };
  cauldron: {
    open: boolean;
    actor: ActorRefFrom<typeof cauldronMachine> | null;
  };
};

export const gameMachine = createMachine({
  id: 'gameMachine',
  tsTypes: {} as import('./game.machine.typegen').Typegen0,
  schema: {
    context: {} as {
      windows: WindowState;
      position: [number, number];
      level: ILevel;
      path: IGraphStep[];
    },
    events: {} as { type: 'MOVE_DOWN'; speed: number }
    | { type: 'MOVE_UP'; speed: number }
    | { type: 'MOVE_RIGHT'; speed: number }
    | { type: 'MOVE_LEFT'; speed: number }
    | { type: 'MOVE_CHARACTER_TO'; position: [number, number] }
    | { type: 'CHECK_PICKUP_ITEM' }
    | { type: 'REMOVE_ITEM_FROM_MAP' }
    | { type: 'ADD_ITEM_TO_MAP'; item: IItem }
    | { type: 'OPEN_WINDOW'; window: keyof WindowState }
    | { type: 'CLOSE_WINDOW'; window: keyof WindowState }
    | { type: 'STEP' }
    | { type: 'STOP' },
  },
  initial: 'initial',
  entry: assign((context) => {
    if (!context.windows.spellBook.actor) {
      context.windows.spellBook.actor = spawn(spellBookMachine, 'spellBookMachine');
    }
    if (!context.windows.cupboard.actor) {
      context.windows.cupboard.actor = spawn(cupboardMachine, 'cupboardMachine');
    }
    if (!context.windows.cauldron.actor) {
      context.windows.cauldron.actor = spawn(cauldronMachine, 'cauldronMachine');
    }
  }),
  context: {
    windows: {
      cupboard: { open: false, actor: null },
      spellBook: { open: false, actor: null },
      cauldron: { open: false, actor: null },
    },
    position: [0, 0],
    path: [],
    level: {
      map: [],
      walls: [],
      scenery: [],
      objects: [],
    },
  },
  states: {
    initial: {
      on: {
        CHECK_PICKUP_ITEM: [{
          target: '.',
          cond: 'tileHasItem',
          actions: 'pickUpItem',
        }, {
          target: '.',
        }],
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
        OPEN_WINDOW: {
          actions: 'openWindow',
        },
        CLOSE_WINDOW: {
          actions: 'closeWindow',
        },
        REMOVE_ITEM_FROM_MAP: {
          target: '.',
          actions: 'removeItemFromMap',
        },
        ADD_ITEM_TO_MAP: {
          target: '.',
          actions: 'addItemToMap',
        },
      },
    },
    stepping: {
      after: {
        100: {
          target: 'initial',
        }
      }
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
    hasPath: context => context.path.length > 0,
    hasNoPath(context) {
      return context.path.length === 0;
    },
    tileHasItem(context) {
      const { x, y } = itemLocation(context.level, context.position);
      return context.level.objects[y][x] !== 0;
    },
  },
  actions: {
    openWindow: assign((context, event) => context.windows[event.window].open = true),
    closeWindow: assign((context, event) => context.windows[event.window].open = false),
    pickUpItem: sendTo('cupboardMachine', (context: any) => {
      const { x, y } = itemLocation(context.level, context.position);
      const pickedUp = items[Math.floor(context.level.objects[y][x])];
      return { type: 'SET_ITEM', item: pickedUp };
    }),
    makePath: assign((context, event: any) => {
      debugger;
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
    removeItemFromMap: assign(context => {
      const { x, y } = itemLocation(context.level, context.position);
      context.level.objects[y][x] = 0;
    }),
    addItemToMap: assign((context, event) => {
      const { x, y } = itemLocation(context.level, context.position);
      context.level.objects[y][x] = Number(event.item.id);
    }),
    popPath: assign(context => {
      if (context.path.length === 0) {
        return;
      }

      context.path = context.path.slice(1);
    }),
    moveLeft: assign(context => context.position[0] = context.position[0] - 1),
    moveRight: assign(context => context.position[0] = context.position[0] + 1),
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

  },
});

const itemLocation = (level: ILevel, position: [number, number]) => {
  const h = level.map.length;
  const w = level.map[0].length;
  const y = (position[1] + Math.ceil(h / 2));
  const x = position[0] + Math.ceil(w / 2);
  return { x, y };
};

/**
 * The camera is centered on 0,0 so tiles above this have a negative number
 * Take the player coordinates in the tiles and translate to the x,y array values for the map
 */
const charPositionToMapRef = (level: ILevel, position: [number, number]) => {
  const h = level.map.length;
  const w = level.map[0].length;
  const x = position[0] + Math.ceil(w / 2);
  const y = position[1] - Math.ceil(h / 2) + h;
  return { x, y };
};
