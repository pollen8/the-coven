import { Machine } from 'xstate';

import { IItem } from '../cupboard/cupboard.machine';
import { ISpell } from '../spellbook/spellbook.machine';

export interface CauldronContext {
  ingredients: IItem[];
  selected: ISpell | null;
}

interface CauldronSchema {
  states: {
    initial: {};
  };
}

export type CauldronEvent = { type: 'ADD_INGREDIENT' }
  | { type: 'SET_SPELL', spell: ISpell | null }
  | { type: 'RESET', }
  | { type: 'MAKE' }

export const cauldronMachine = Machine<CauldronContext, CauldronSchema, CauldronEvent>({
  id: 'cauldron',
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

