import {
  createMachine,
  sendParent,
} from 'xstate';

import { assign } from '@xstate/immer';

import { MapPosition } from '../game.machine';

export type Item = {
  id: string;
  title: string;
  description?: string;
  value: number;
  img?: string;
}

export type Cupboard = {
  items: Item[];
  capacity: number;
}

export const cupboardMachine = createMachine({
  tsTypes: {} as import('./cupboard.machine.typegen').Typegen0,
  schema: {
    context: {} as {
      cupboard: Cupboard;
      item: Item | null;
      position: MapPosition;
    },
    events: {} as { type: 'ADD_ITEM', item: Item; }
    | { type: 'REMOVE_ITEM', item: Item }
    | { type: 'SET_ITEM', item: Item; position: MapPosition; }
    | { type: 'SET_ITEM_POSITION'; position: MapPosition }
  },
  id: 'cupboard',
  initial: 'open',
  context: {
    cupboard: {
      items: [],
      capacity: 5,
    },
    position: [0, 0],
    item: null,
  },
  states: {
    open: {
      on: {

        ADD_ITEM: [{
          target: '.',
          actions: [
            'addItem',
            'clearItem',
            sendParent((context, event) => ({ type: 'REMOVE_ITEM_FROM_MAP', position: context.position }))],
          cond: 'notFull'
        },
        {
          target: 'warnFull',
          cond: 'isFull',
        }],
        REMOVE_ITEM: {
          target: '.',
          actions: ['removeItem',
            sendParent((context, event) => ({
              item: event.item,
              type: 'ADD_ITEM_TO_MAP'
            }))],
          cond: 'notEmpty'
        },
        SET_ITEM: {
          target: '.',
          actions: ['setItem', 'setItemPosition']
        }
      }
    },
    warnFull: {
    }

  }
}, {
  actions: {
    setItemPosition: assign((context, event) => context.position = event.position),
    setItem: assign((context, event) => context.item = event.item),
    clearItem: assign((context) => context.item = null),
    addItem: assign((context, event) => {
      context.item = null;
      context.cupboard.items.push(event.item);
    }),
    removeItem: assign((context, event) => {
      context.cupboard.items = context.cupboard.items.filter((i) => i.title !== event.item.title);
    }),
  },
  guards: {
    isFull: (context) => context.cupboard.items.length >= context.cupboard.capacity,
    notFull: (context) => context.cupboard.items.length < context.cupboard.capacity,
    notEmpty: (context) => context.cupboard.items.length > 0
  }
});

