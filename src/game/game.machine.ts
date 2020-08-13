import { Machine } from 'xstate';

import { assign } from '@xstate/immer';

import {
  cupboardMachine,
  ICupboard,
} from './cupboard.machine';
import { ITile } from './Tile';

const tileHasProp = (context: any, event: any) => {
  const { grid, position } = context;
  const tile = grid[position.y][position.x];
  return tile.propImg;
}

interface IPosition {
  x: number;
  y: number;
}

type GameActions = { type: 'MOVE_DOWN' }
  | { type: 'MOVE_UP' }
  | { type: 'MOVE_RIGHT' }
  | { type: 'MOVE_LEFT' }
  | { type: 'CHECK_PICKUP_PROP' }
  | { type: 'REMOVE_ITEM_FROM_MAP' };

interface GameContext {
  grid: ITile[][];
  position: IPosition;
  cupboard: ICupboard;
  areaRows: number;
  areaCols: number;
}

interface GameSchema {
  states: {
    initial: {};
    openCupboard: {};
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
    position: { x: 0, y: 0 },
  },
  on: {
    REMOVE_ITEM_FROM_MAP: {
      actions: 'removeItemFromMap',
    },
  },
  states: {
    initial: {
      on: {
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
          target: 'openCupboard',
          cond: tileHasProp,
        },
        {
          target: 'initial',
        }
        ],

      },

    },
    openCupboard: {
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


  }
}, {
  actions: {
    saveCupboard: assign((context: GameContext, event: any) => {
      context.cupboard = event.data.cupboard;
    }),
    removeItemFromMap: assign((context: GameContext) => {
      const { grid, position } = context;
      const { title, name, description, value, propImg, ...rest } = grid[position.y][position.x];
      grid[position.y][position.x] = {
        ...rest
      }
    }),
    moveDown: assign((context: any, event: any) => {
      context.position = {
        ...context.position,
        y: Math.min(context.areaRows, context.position.y + 1),
        direction: 'down',
      }
    }),
    moveUp: assign((context: any, event: any) => {
      context.position = {
        ...context.position,
        y: Math.max(0, context.position.y - 1),
        direction: 'up',
      }
    }),
    moveRight: assign((context: any, event: any) => {
      context.position = {
        ...context.position,
        x: Math.min(context.areaCols, context.position.x + 1),
        direction: 'right',
      }
    }),
    moveLeft: assign((context: any, event: any) => {
      context.position = {
        ...context.position,
        x: Math.max(0, context.position.x - 1),
        direction: 'left',
      }
    }),


  },
});
