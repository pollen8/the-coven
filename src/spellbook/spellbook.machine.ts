import { createMachine } from 'xstate';

import { IItem } from '../cupboard/cupboard.machine';

export type Spell = {
  ingredients: IItem[];
};

export type SpellBook = {
  name: string;
  spells: Spell[];
  capacity: number;
};

export const spellBookMachine = createMachine({
  tsTypes: {} as import('./spellbook.machine.typegen').Typegen0,
  schema: {
    context: {} as {
      books: SpellBook[];
      selected: Spell | undefined;
    },
    events: {} as { type: 'ADD_BOOK'; book: SpellBook }
    | { type: 'ADD_SPELL'; spell: Spell; book: string }
    | { type: 'SELECT_SPELL'; spell: Spell },

  },
  id: 'spellBook',
  initial: 'open',
  context: {
    books: [],
    selected: undefined,
  },
  states: {
    open: {
      on: {
        ADD_BOOK: {

        },
        ADD_SPELL: {
          target: '.',
        },
        SELECT_SPELL: {
          target: '.',
        },
      },
    },
  },
}, {
  actions: {
  },
  guards: {
  },
});

