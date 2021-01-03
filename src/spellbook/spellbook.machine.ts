import { Machine } from 'xstate';

import { IItem } from '../cupboard/cupboard.machine';

interface ISpell {
  ingredients: IItem[];
}

export interface ISpellBook {
  name: string;
  spells: ISpell[];
  capacity: number;
}

export interface SpellBookContext {
  books: ISpellBook[];
  selected: ISpell | null;
}

interface SpellBookSchema {
  states: {
    open: {};
  };
}

export type SpellBookEvent = { type: 'ADD_BOOK', book: ISpellBook }
  | { type: 'ADD_SPELL', spell: ISpell, book: string }
  | { type: 'SELECT_SPELL', spell: ISpell }

export const spellBookMachine = Machine<SpellBookContext, SpellBookSchema, SpellBookEvent>({
  id: 'spellBook',
  initial: 'open',
  context: {
    books: [],
    selected: null,
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
        }
      }
    },
  }
}, {
  actions: {
  },
  guards: {
  }
});

