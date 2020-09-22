import { Machine } from 'xstate';

import { assign } from '@xstate/immer';

import {
  cupboardMachine,
  ICupboard,
} from './cupboard/cupboard.machine';
import { spellBookMachine } from './spellbook/spellbook.machine';
import { ITile } from './Tile';
import { IPosition } from './usePosition';

const tileHasProp = (context: any, event: any) => {
  const { grid, position } = context;
  const tile = grid[position.y][position.x];
  return tile.propImg;
}

export type GameActions = { type: 'MOVE_DOWN' }
  | { type: 'MOVE_UP' }
  | { type: 'MOVE_RIGHT' }
  | { type: 'MOVE_LEFT' }
  | { type: 'CHECK_PICKUP_PROP' }
  | { type: 'OPEN_CUPBOARD' }
  | { type: 'OPEN_SPELL_BOOK' }
  | { type: 'REMOVE_ITEM_FROM_MAP' };

export interface GameContext {
  grid: ITile[][];
  position: IPosition;
  cupboard: ICupboard;
  areaRows: number;
  areaCols: number;
}

interface GameSchema {
  states: {
    initial: {};
    cupboard: {};
    spellBook: {},
  };
};

export const gameMachine = Machine<GameContext, GameSchema, GameActions>({
  id: 'gameMachine',
  initial: 'initial',
  context: {
    cupboard: {
      items: [],
      capacity: 5,
    },
    areaCols: 0,
    areaRows: 0,
    grid: [],
    position: { x: 0, y: 0, direction: 'right' },
  },
  on: {
    REMOVE_ITEM_FROM_MAP: {
      actions: 'removeItemFromMap',
    },
  },
  states: {
    initial: {
      on: {
        OPEN_CUPBOARD: 'cupboard',
        OPEN_SPELL_BOOK: 'spellBook',
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
          target: 'cupboard',
          cond: tileHasProp,
        },
        {
          target: 'initial',
        }
        ],

      },

    },
    cupboard: {
      invoke: {
        id: 'cupboardMachine',
        src: cupboardMachine,
        data: {
          cupboard: (context: any) => context.cupboard,
          item: (context: any, event: any) => {
            const { grid, position } = context;
            return grid[position.y][position.x];
          },
        },
        onDone: {
          target: 'initial',
          actions: 'saveCupboard',
        },
      }
    },
    spellBook: {
      invoke: {
        id: 'spellBookMachine',
        src: spellBookMachine,
        onDone: {
          target: 'initial',
        },
      }
    }
  }
}, {
  actions: {
    saveCupboard: assign((context: GameContext, { data }: any) => context.cupboard = data.cupboard),
    removeItemFromMap: assign((context: GameContext) => {
      const { grid, position } = context;
      const { title, name, description, value, propImg, ...rest } = grid[position.y][position.x];
      grid[position.y][position.x] = {
        ...rest
      }
    }),
    moveDown: assign((context) => {
      context.position = {
        ...context.position,
        y: Math.min(context.areaRows, context.position.y + 1),
        direction: 'down',
      }
    }),
    moveUp: assign((context) => {
      context.position = {
        ...context.position,
        y: Math.max(0, context.position.y - 1),
        direction: 'up',
      }
    }),
    moveRight: assign((context) => {
      context.position = {
        ...context.position,
        x: Math.min(context.areaCols, context.position.x + 1),
        direction: 'right',
      }
    }),
    moveLeft: assign((context) => {
      context.position = {
        ...context.position,
        x: Math.max(0, context.position.x - 1),
        direction: 'left',
      }
    }),


  },
});
