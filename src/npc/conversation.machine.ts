import { createMachine } from 'xstate';

type StageId = Number;

export const conversationMachine = createMachine({
  id: 'quest',
  tsTypes: {} as import('./conversation.machine.typegen').Typegen0,
  schema: {
    context: {} as {
      title: string;
      stages: {
        id: StageId;
        text: string;
        options: {
          to: StageId;
          label: string;
        }[]
      }[]
    },
  },
  initial: 'closed',
  states: {
    closed: {},
    open: {},
    done: {},
  }
});
