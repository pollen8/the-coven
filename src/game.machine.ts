import { Machine } from 'xstate';

import { addWitchMachine } from './landingPage/AddWitchForm';

// This machine is completely decoupled from React
export const gameMachine = Machine({
  id: 'game',
  initial: 'landing',
  states: {
    landing: {
      id: 'landing',
      on: {
        CREATE_WITCH: 'addWitch'
      }
    },
    addWitch: {
      invoke: {
        src: addWitchMachine,
        id: 'addWitchMachine',
        onDone: '#landing',
      },
    },
    // addWitch: {
    //   invoke: {
    //     src: 'addWitch',
    //     onDone: {
    //       target: 'landing',
    //     },
    //     onError: {
    //       target: 'landing',
    //     }
    //   }
    // }
  }
});



// deleteCategory: {
//   invoke: {
//     src: 'deleteCategory',
//     onDone: {
//       target: '#idle',
//       actions: 'clearSelected',
//     },
//     onError: {
//       actions: (context, event) => context.delete.errors = event.data,
//       target: 'open',
//     },
//   },
// },
