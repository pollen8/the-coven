import {
  Actor,
  Machine,
  send,
  spawn,
  State,
} from 'xstate';

import { assign } from '@xstate/immer';

import {
  astar,
  Graph,
} from './@core/astar';
import {
  cupboardMachine,
  IItem,
} from './cupboard/cupboard.machine';
import { items } from './items';
import { spellBookMachine } from './spellbook/spellbook.machine';

export type GameActions = { type: 'MOVE_DOWN'; speed: number }
  | { type: 'MOVE_UP'; speed: number }
  | { type: 'MOVE_RIGHT'; speed: number }
  | { type: 'MOVE_LEFT'; speed: number }
  | { type: 'MOVE_CHARACTER_TO', position: [number, number] }
  | { type: 'CHECK_PICKUP_ITEM' }
  | { type: 'REMOVE_ITEM_FROM_MAP' }
  | { type: 'ADD_ITEM_TO_MAP', item: IItem }
  | { type: 'OPEN_WINDOW', window: keyof GameContext['windows'] }
  | { type: 'CLOSE_WINDOW', window: keyof GameContext['windows'] }
  ;

export interface ILevel {
  map: number[][];
  /** 0 = can't go through - otherwise the value indicates the cost to move through this area */
  walls: number[][];
  scenery: number[][];
  objects: number[][];
}

export interface GameContext {
  windows: {
    spellBook: {
      open: boolean;
      actor: Actor<State<any, any>, any> | null;
    };
    cupboard: {
      open: boolean;
      actor: Actor<State<any, any>, any> | null;
    };
  };
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
  entry: assign((context) => {
    if (!context.windows.spellBook.actor) {
      context.windows.spellBook.actor = spawn(spellBookMachine, 'spellBookMachine');
    }
    if (!context.windows.cupboard.actor) {
      context.windows.cupboard.actor = spawn(cupboardMachine, 'cupboardMachine');
    }
  }),
  context: {
    windows: {
      cupboard: { open: false, actor: null },
      spellBook: { open: false, actor: null },
    },
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
        CHECK_PICKUP_ITEM: [{
          target: '.',
          cond: 'tileHasItem',
          actions: 'pickUpItem',
        }, {
          target: '.',
        }
        ],
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
    tileHasItem: (context) => {
      return context.level.objects[context.position[1]][context.position[0]] !== 0;
    }
  },
  actions: {
    openWindow: assign((context, event: any) => context.windows[event.window as keyof GameContext['windows']].open = true),
    closeWindow: assign((context, event: any) => context.windows[event.window as keyof GameContext['windows']].open = false),
    pickUpItem: send((context) => {
      const { position } = context;
      const pickedUp = items[Math.floor(context.level.objects[position[1]][position[0]])];
      return { type: 'SET_ITEM', item: pickedUp };
    }, { to: 'cupboardMachine' }),
    makePath: assign((context, event: any) => {
      const graph = new Graph(context.level.walls, { diagonal: true })
      const start = graph.grid[context.position[1]][context.position[0]];
      const end = graph.grid[event.position[1]][event.position[0]];
      if (!end) {
        return;
      }
      var result = astar.search(graph, start, end, { closest: true });

      context.path = result;
    }),
    removeItemFromMap: assign((context) => {
      const { position } = context;

      context.level.objects[position[1]][position[0]] = 0;
    }),
    addItemToMap: assign((context, event: any) => {
      const { position } = context;
      context.level.objects[position[1]][position[0]] = event.item.id;
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
