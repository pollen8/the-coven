import {
  Machine,
  sendParent,
} from 'xstate';

import { assign } from '@xstate/immer';

export interface IItem {
  id: string;
  title: string;
  description?: string;
  value: number;
  img?: string;
}

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
  | { type: 'SET_ITEM', item: IItem }
  | { type: 'CLOSE' }
  | { type: 'OPEN' }

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
      // type: 'final',
      onEntry: sendParent('CLOSE_CUPBOARD'),
      // data: {
      //   cupboard: (context: CupboardContext) => context.cupboard,
      // }
      on: {
        OPEN: 'open',
      },
    },
    open: {
      on: {
        CLOSE: 'closed',
        ADD_ITEM: [{
          target: '.',
          actions: ['addItem', 'clearItem', sendParent('REMOVE_ITEM_FROM_MAP')],

          // actions: ['addItem'],
          cond: 'notFull'
        },
        {
          target: 'warnFull',
          cond: 'isFull',
        }],
        REMOVE_ITEM: {
          target: '.',
          actions: ['removeItem', sendParent((context, event) => ({
            item: event.item,
            type: 'ADD_ITEM_TO_MAP'
          }))],
          cond: 'notEmpty'
        },
        SET_ITEM: {
          target: '.',
          actions: 'setItem',
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
    setItem: assign((context, event: any) => context.item = event.item),
    clearItem: assign((context) => context.item = null),
    addItem: assign((context, event: any) => {
      context.cupboard.items.push(event.item);
    }),
    removeItem: assign((context, event: any) => {
      console.log('remoe item', event.item);
      context.cupboard.items = context.cupboard.items.filter((i) => i.title !== event.item.title);
    }),
  },
  guards: {
    isFull: (context) => context.cupboard.items.length >= context.cupboard.capacity,
    notFull: (context) => context.cupboard.items.length < context.cupboard.capacity,
    notEmpty: (context) => context.cupboard.items.length > 0
  }
});

