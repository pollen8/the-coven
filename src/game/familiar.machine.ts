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
interface FamiliarContext {
  name: string;
  owner: string;
  skills: Record<string, number>;
  value: number;
}

interface FamiliarStateSchema {
  states: {
    idle: {},
    forraging: {},
    spellCasting: {},
  }
}



type TAddSkill = { type: 'ADD_SKILL', skill: string, value: number };
type TUpgradeSkill = { type: 'UPGRADE_SKILL', skill: string, value: number };

type FamiliarEvent =
  | TAddSkill
  | TUpgradeSkill
  | { type: 'FORRAGE' }
  | { type: 'STOP' }
  | { type: 'CAST_SPELL' }

export const familiarMachine = Machine<FamiliarContext, FamiliarStateSchema, any>({
  id: 'familiar',
  initial: 'idle',
  context: {
    name: '',
    owner: '',
    skills: {},
    value: 0,
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
    addSkill: assign((context, event: TAddSkill) => context.skills[event.skill] = event.value),
    upgradeSkill: assign((context, event: TUpgradeSkill) => context.skills[event.skill] = context.skills[event.skill] + event.value),
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
