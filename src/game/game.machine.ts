import { Machine } from 'xstate';

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

export const gameMachine = Machine({
  id: 'map',
  initial: 'closed',
  context: {
    grid: [],
    center: { x: 0, y: 0 }
  },
  states: {
    closed: {
      on: {
        OPEN: 'open'
      }
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

});
