import {
  Machine,
  sendParent,
} from 'xstate';

import { assign } from '@xstate/immer';

import { IItem } from './Tile';

export interface ICupboard {
  items: IItem[];
  capacity: number;
}

export interface CupboardContext {
  cupboard: ICupboard;
  item: IItem | null;
}

interface CupboardSchema {
  states: {
    closed: {};
    open: {};
    warnFull: {};
  };
}

export type CupboardEvent = { type: 'ADD_ITEM', item: IItem }
  | { type: 'REMOVE_ITEM', item: IItem }
  | { type: 'CLOSE' }

export const cupboardMachine = Machine<CupboardContext, CupboardSchema, CupboardEvent>({
  id: 'cupboard',
  initial: 'open',
  context: {
    cupboard: {
      items: [],
      capacity: 5,
    },
    item: null,
  },
  states: {
    closed: {
      type: 'final',
      data: {
        cupboard: (context: CupboardContext) => context.cupboard,
      }
    },
    open: {
      on: {
        CLOSE: 'closed',
        ADD_ITEM: [{
          target: '.',
          actions: ['addItem', 'clearItem', sendParent('REMOVE_ITEM_FROM_MAP')],
          cond: 'notFull'
        },
        {
          target: 'warnFull',
          cond: 'isFull',
        }],
        REMOVE_ITEM: {
          target: '.',
          actions: 'removeItem',
          cond: 'notEmpty'
        }
      }
    },
    warnFull: {
      on: {
        CLOSE: 'open',
      }
    }

  }
}, {
  actions: {
    clearItem: assign((context: any) => context.item = null),
    addItem: assign((context: any, event: any) => {
      context.cupboard.items.push(event.item);
    }),
    removeItem: assign((context: any, event: any) => {
      context.cupboard.items = context.cupboard.items.filter((i: any) => i.title !== event.item.title)
    }),
  },
  guards: {
    isFull: (context) => context.cupboard.items.length >= context.cupboard.capacity,
    notFull: (context) => context.cupboard.items.length < context.cupboard.capacity,
    notEmpty: (context) => context.cupboard.items.length > 0
  }
});
