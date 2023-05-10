import { createMachine } from 'xstate';

import { NpcId } from './npc.machine';

export const questMachine = createMachine({
  id: 'quest',
  tsTypes: {} as import('./quest.machine.typegen').Typegen0,
  schema: {
    context: {} as {
      availableAt: number;
      title: string;
      npcOwner: NpcId; // The npc that can give the player the quest
    },
    events: {} as { type: 'START' }
    | { type: 'COMPLETE' }
    | { type: 'FAIL' }
  },
  initial: 'inactive',
  states: {
    inactive: {
      on: {
        START: {
          target: 'active',
        },
      },
    },
    active: {
      on: {
        COMPLETE: {
          target: 'completed',
        },
        FAIL: {
          target: 'failed',
        },
      },
    },
    failed: {},
    completed: {}, // completed
    closed: {}, // has been closed by speaking to the npc who started the quest
  }
});
