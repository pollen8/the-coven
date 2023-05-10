import {
  ActorRefFrom,
  createMachine,
} from 'xstate';

import {
  GraphStep,
  LevelId,
  MapPosition,
} from '../game.machine';
import { conversationMachine } from './conversation.machine';
import { questMachine } from './quest.machine';

export type NpcId = string;
export const npcMachine = createMachine({
  id: 'npc',
  tsTypes: {} as import('./npc.machine.typegen').Typegen0,
  schema: {
    context: {} as {
      id: NpcId;
      levelId: LevelId;
      position: MapPosition;
      path: GraphStep[];
      spriteImage: string;
      quests: ActorRefFrom<typeof questMachine>[];
      conversations: ActorRefFrom<typeof conversationMachine>[];
    },
    events: {} as { type: 'WALK_TO', to: MapPosition }
    | { type: 'TALK' }
    | { type: 'PICK_QUEST' }
    | { type: '' }
  },
  context: {
    id: '',
    levelId: '',
    position: [0, 0],
    path: [],
    quests: [],
    conversations: [],
    spriteImage: '',
  },
  initial: 'idle',
  states: {
    idle: {
      on: {
        TALK: {
          target: 'chatting',
        },
      },
    },
    walking: {},
    plotConversations: {},
    chatting: {
      entry: () => console.log('Im chatting')
    },
  }
});

/**
 * user -> start talking -> npc -send-> game machine -> has quest? ->
 *
 *
 * [user]
 *   |
 * [npc]
 *   |
 * /to: gameMachine: activeQuest for NPC -------> run conversation about incomplete quest -> end
 *   |
 * /to: gameMachine: active & completed Quest for NPC  (mark as closed) -------> run conversation about complete quest -> end
 *
 *   |
 *  /to: gameMachine: getConversation/
 *   |
 *  conversation/quest - [npc: action: setConversation]
 *   |
 *  run conversation
 *   |
 *  /to: gameMachine: startQuest
 */
