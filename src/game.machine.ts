import {
  ActorRefFrom,
  createMachine,
  sendTo,
  spawn,
} from 'xstate';

import { assign } from '@xstate/immer';

import { cauldronMachine } from './cauldron/cauldron.machine';
import { characterMachine } from './character/character.machine';
import {
  cupboardMachine,
  Item,
} from './cupboard/cupboard.machine';
import { items } from './items';
import { npcMachine } from './npc/npc.machine';
import { questMachine } from './npc/quest.machine';
import { spellBookMachine } from './spellbook/spellbook.machine';

export type LevelId = string;
export type Level = {
  id: LevelId;
  map: number[][];
  /** 0 = can't go through - otherwise the value indicates the cost to move through this area */
  walls: number[][];
  scenery: number[][];
  objects: number[][];
};

export type GraphStep = {
  parent: { x: number; y: number };
  x: number;
  y: number;
  weight: number;
};

type WindowState = {
  spellBook: {
    open: boolean;
    actor: ActorRefFrom<typeof spellBookMachine> | null;
  };
  cupboard: {
    open: boolean;
    actor: ActorRefFrom<typeof cupboardMachine> | null;
  };
  cauldron: {
    open: boolean;
    actor: ActorRefFrom<typeof cauldronMachine> | null;
  };
};

export type MapPosition = [number, number];

export const gameMachine = createMachine({
  id: 'gameMachine',
  tsTypes: {} as import('./game.machine.typegen').Typegen0,
  schema: {
    context: {} as {
      windows: WindowState;
      level: Level;
      characters: ActorRefFrom<typeof characterMachine>[];
      npcs: ActorRefFrom<typeof npcMachine>[];
      quests: ActorRefFrom<typeof questMachine>[];
    },
    events: {} as { type: 'MOVE_DOWN'; speed: number }
    | { type: 'MOVE_UP'; speed: number }
    | { type: 'MOVE_RIGHT'; speed: number }
    | { type: 'MOVE_LEFT'; speed: number }
    | { type: 'MOVE_CHARACTER_TO'; position: [number, number] }
    | { type: 'CHECK_PICKUP_ITEM'; position: MapPosition }
    | { type: 'CHECK_NPC' }
    | { type: 'REMOVE_ITEM_FROM_MAP'; itemId: string; position: MapPosition }
    | { type: 'ADD_ITEM_TO_MAP'; item: Item; position: MapPosition }
    | { type: 'OPEN_WINDOW'; window: keyof WindowState }
    | { type: 'CLOSE_WINDOW'; window: keyof WindowState }
    | { type: 'STEP' }
    | { type: 'STOP' },
  },
  initial: 'initial',
  entry: assign((context) => {
    if (!context.windows.spellBook.actor) {
      context.windows.spellBook.actor = spawn(spellBookMachine, 'spellBookMachine');
    }
    if (!context.windows.cupboard.actor) {
      context.windows.cupboard.actor = spawn(cupboardMachine, 'cupboardMachine');
    }
    if (!context.windows.cauldron.actor) {
      context.windows.cauldron.actor = spawn(cauldronMachine, 'cauldronMachine');
    }
    context.characters = [
      spawn(characterMachine.withContext({
        path: [],
        position: [0, 0],
        direction: 'right',
        level: JSON.parse(JSON.stringify(context.level)),
      }), 'eleanor')
    ];
    context.npcs = [
      spawn(npcMachine.withContext({
        id: 'bob',
        levelId: '1',
        spriteImage: '../chars/sensei/sensei.png',
        position: [0, 1],
        conversations: [],
        path: [],
        quests: [],
      }), { name: 'bob' }),
    ];

    context.quests = [
      spawn(questMachine.withContext({
        npcOwner: 'bob',
        availableAt: 0,
        title: 'Bobs chicken hunt',
      }))
    ];
  }),
  context: {
    windows: {
      cupboard: { open: false, actor: null },
      spellBook: { open: false, actor: null },
      cauldron: { open: false, actor: null },
    },
    npcs: [],
    quests: [],
    characters: [],
    level: {
      id: '1',
      map: [],
      walls: [],
      scenery: [],
      objects: [],
    },
  },
  states: {
    initial: {
      on: {
        MOVE_CHARACTER_TO: {
          actions: 'moveTo',
        },
        CHECK_PICKUP_ITEM: [{
          cond: 'tileHasItem',
          actions: ['pickUpItem', 'openCupboard'],
        }, {
          cond: 'tileNextToNpc',
          actions: 'talkToNpc'
        }, {
          target: '.',
        }],
        OPEN_WINDOW: {
          actions: 'openWindow',
        },
        CLOSE_WINDOW: {
          actions: 'closeWindow',
        },
        REMOVE_ITEM_FROM_MAP: {
          target: '.',
          actions: 'removeItemFromMap',
        },
        ADD_ITEM_TO_MAP: {
          target: '.',
          actions: 'addItemToMap',
        },
      },
    },
  },
}, {
  guards: {

    tileHasItem: (context, { position }) => {
      const { x, y } = itemLocation(context.level, position);
      return context.level.objects[y][x] !== 0;
    },
    tileNextToNpc: ({ npcs }, { position }) => {
      const npc = npcs.find((npc) => {
        const npcPosition = npc.getSnapshot()?.context.position;
        if (!npcPosition) {
          return false;
        }
        return [position[0] - 1, position[0], position[0] + 1].includes(npcPosition[0]) &&
        [position[1] - 1, position[1], position[1] + 1].includes(npcPosition[1]);
      });
      return npc ? true : false;
    }
  },
  actions: {
    moveTo: (context, event) => {
      const character = context.characters[0];
      if (!character) {
        return;
      }
      character.send({ type: 'MOVE_CHARACTER_TO', position: event.position });
    },
    talkToNpc: (({ npcs }, { position }) => {
      const npc = npcs.find((npc) => {
        const npcPosition = npc.getSnapshot()?.context.position;
        if (!npcPosition) {
          return false;
        }
        return [position[0] - 1, position[0], position[0] + 1].includes(npcPosition[0]) &&
        [position[1] - 1, position[1], position[1] + 1].includes(npcPosition[1]);
      });
      if (!npc) {
        return;
      }
      npc.send('TALK');
    }),
    openCupboard: assign((context) => context.windows.cupboard.open = true),
    openWindow: assign((context, event) => context.windows[event.window].open = true),
    closeWindow: assign((context, event) => context.windows[event.window].open = false),
    pickUpItem: sendTo('cupboardMachine', (context: any, event) => {
      console.log('pcikcup', event);
      const { x, y } = itemLocation(context.level, event.position);
      const pickedUp = items[Math.floor(context.level.objects[y][x])];
      return { type: 'SET_ITEM', item: pickedUp, position: event.position };
    }),

    removeItemFromMap: assign((context, event) => {
      console.log('remove item', context, event);
      const { x, y } = itemLocation(context.level, event.position);
      context.level.objects[y][x] = 0;
    }),
    addItemToMap: assign((context, event) => {
      const { x, y } = itemLocation(context.level, event.position);
      context.level.objects[y][x] = Number(event.item.id);
    }),

  },
});

const itemLocation = (level: Level, position: [number, number]) => {
  const h = level.map.length;
  const w = level.map[0].length;
  const y = (position[1] + Math.ceil(h / 2));
  const x = position[0] + Math.ceil(w / 2);
  return { x, y };
};

