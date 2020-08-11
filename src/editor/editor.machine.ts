import { Machine } from 'xstate';

import { assign } from '@xstate/immer';

export const editorMachine = Machine({
  id: 'gameMachine',
  initial: 'initial',
  states: {
    initial: {
      on: {
        MOVE_DOWN: {
          actions: 'moveDown',
        },
        MOVE_UP: {
          actions: 'moveUp',
        },
        MOVE_RIGHT: {
          actions: 'moveRight',
        },
        MOVE_LEFT: {
          actions: 'moveLeft',
        },
        UPDATE_TILE: {
          actions: 'updateTile',
        }
      }
    },
  }
}, {
  actions: {
    updateTile: assign((context: any, event: any) => {
      const row = [...context.grid[event.position.x]];
      row[event.position.y] = {
        ...row[event.position.y],
        [event.item.type === 'PROP' ? 'propImg' : 'baseImg']: event.item.name,
      };
      context.grid = [
        ...context.grid.slice(0, event.position.x),
        row,
        ...context.grid.slice(event.position.x + 1),
      ];

    }),
    moveDown: assign((context: any, event: any) => {
      context.position = {
        ...context.position,
        y: Math.min(context.areaRows, context.position.y + 1),
        direction: 'down',
      }
    }),
    moveUp: assign((context: any, event: any) => {
      context.position = {
        ...context.position,
        y: Math.max(0, context.position.y - 1),
        direction: 'up',
      }
    }),
    moveRight: assign((context: any, event: any) => {
      context.position = {
        ...context.position,
        x: Math.min(context.areaCols, context.position.x + 1),
        direction: 'right',
      }
    }),
    moveLeft: assign((context: any, event: any) => {
      context.position = {
        ...context.position,
        x: Math.max(0, context.position.x - 1),
        direction: 'left',
      }
    }),


  },
});
