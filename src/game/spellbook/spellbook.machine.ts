import { Machine } from 'xstate';

import { assign } from '@xstate/immer';

interface ISpell {
  name: string;
  learnt: boolean;
  ingredients: { name: string, quantity: number }[];
}

export interface ISpellBook {
  spells: ISpell[];
}

export interface SpellBookContext {
  spellBook: ISpellBook;
}

interface CupboardSchema {
  states: {
    closed: {};
    open: {};
  };
}

export type SpellBookEvent = { type: 'LEARN_SPELL' }
  | { type: 'CAST_SPELL', spell: ISpell }
  | { type: 'CLOSE' }

export const spellBookMachine = Machine<SpellBookContext, CupboardSchema, SpellBookEvent>({
  id: 'spellBook',
  initial: 'open',
  context: {
    spellBook: {
      spells: [],
    },
  },
  states: {
    closed: {
      type: 'final',
      data: {
        spellBook: (context: SpellBookContext) => context.spellBook,
      }
    },
    open: {
      on: {
        CLOSE: 'closed',
        LEARN_SPELL: {
          target: '.',
          actions: ['addSpell'],
          cond: 'canLearnSpell'
        },
      }
    },
  }
}, {
  actions: {
    addSpell: assign((context, event: any) => {
      context.spellBook.spells.push(event.item);
    }),
  },
  guards: {
    canLearnSpell: (context) => Math.round(Math.random()) === 1,
  }
});
