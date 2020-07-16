import { Machine } from 'xstate';

import { assign } from '@xstate/immer';

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

interface WitchContext {
  name: string;
  skills: Record<string, number>;
  familiars: any[];
  ingredients: any[];
  spellBooks: any[];
  hovel: any[];
  markets: any[];
  cauldron: object;
  reputation: number;
}

interface WitchStateSchema {
  states: {
    idle: {};
    forraging: {};
    spellCasting: {};
  }
}

type TAddSkill = { type: 'ADD_SKILL', skill: string, value: number };
type TUpgradeSkill = { type: 'UPGRADE_SKILL', skill: string, value: number };

type WitchEvent = TAddSkill
  | TUpgradeSkill
  | { type: 'FORRAGE' }
  | { type: 'STOP' }
  | { type: 'CAST_SPELL' }


export const witchMachine = Machine<WitchContext, WitchStateSchema, any>({
  id: 'witch',
  initial: 'idle',
  context: {
    name: '',
    skills: {},
    familiars: [],
    ingredients: [],
    spellBooks: [],
    hovel: [],
    markets: [],
    cauldron: {},
    reputation: 0,

  },
  states: {
    idle: {
      on: {
        ADD_SKILL: {
          target: '.',
          actions: 'addSkill',
          cond: 'isNewSkill',
        },
        UPGRADE_SKILL: {
          target: '.',
          actions: 'upgradeSkill',
          cond: 'hasSkill',
        },
        FORRAGE: 'forraging',
        CAST_SPELL: 'spellCasting',
      }
    },

    forraging: {
      on: {
        STOP: 'idle',
      }
    },
    spellCasting: {
      on: {
        STOP: 'idle',
      }
    }

  },
}, {
  actions: {
    addSkill: assign((context, event) => context.skills[event.skill] === event.value),
    upgradeSkill: assign((context, event) => context.skills[event.skill] === context.skills[event.skill] + event.value),
  },
  guards: {
    isNewSkill: (context, event) => {
      return true;
      // return !Object.keys(context.skills).includes[String(event.skill)];
    },
    hasSkill: (context, event) => {
      return true;
      // return Object.keys(context.skills).includes[String(event.skill)];
    },

  }
});
