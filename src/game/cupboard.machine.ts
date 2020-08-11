import {
  assign,
  Machine,
} from 'xstate';

// Available variables:
// - Machine
// - interpret
// - assign
// - send
// - sendParent
// - spawn
// - raise
// - actions
// - XState (all XState exports)

export const cupboardMachine = Machine({
  id: 'cupboard',
  initial: 'open',
  context: {
    items: 0,
    capacity: 5,
  },
  states: {
    closed: {
      type: 'final',
    },
    open: {
      on: {
        CLOSE: 'closed',
        ADD_ITEM: {
          target: '.',
          actions: 'addItem',
          cond: 'notFull'
        },
        REMOVE_ITEM: {
          target: '.',
          actions: 'removeItem',
          cond: 'notEmpty'
        }
      }
    },

  }
}, {
  actions: {
    addItem: assign({
      items: (context) => context.items + 1
    }),
    removeItem: assign({
      items: (context) => context.items - 1
    })
  },
  guards: {
    notFull: (context) => context.items < context.capacity,
    notEmpty: (context) => context.items > 0
  }
});
