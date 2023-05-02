import { createMachine } from 'xstate';

import { IItem } from '../cupboard/cupboard.machine';
import { Spell } from '../spellbook/spellbook.machine';

export const cauldronMachine = createMachine({
  id: 'cauldron',
  tsTypes: {} as import('./cauldron.machine.typegen').Typegen0,
  schema: {
    context: {} as {
      ingredients: IItem[];
      selected: Spell | null;
    },
    events: {} as { type: 'ADD_INGREDIENT' }
    | { type: 'SET_SPELL', spell: Spell | null }
    | { type: 'RESET', }
    | { type: 'MAKE' }
  },
  initial: 'initial',
  context: {
    ingredients: [],
    selected: null,
  },
  states: {
    initial: {
      on: {
      }
    },
  }
}, {
  actions: {
  },
  guards: {
  }
});

