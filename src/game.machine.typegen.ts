
  // This file was automatically generated. Edits will be overwritten

  export interface Typegen0 {
        '@@xstate/typegen': true;
        internalEvents: {
          "": { type: "" };
"xstate.after(100)#gameMachine.moving": { type: "xstate.after(100)#gameMachine.moving" };
"xstate.after(100)#gameMachine.stepping": { type: "xstate.after(100)#gameMachine.stepping" };
"xstate.init": { type: "xstate.init" };
        };
        invokeSrcNameMap: {
          
        };
        missingImplementations: {
          actions: never;
          delays: never;
          guards: never;
          services: never;
        };
        eventsCausingActions: {
          "addItemToMap": "ADD_ITEM_TO_MAP";
"closeWindow": "CLOSE_WINDOW";
"makePath": "MOVE_CHARACTER_TO";
"moveDown": "MOVE_DOWN";
"moveLeft": "MOVE_LEFT";
"moveRight": "MOVE_RIGHT";
"moveUp": "MOVE_UP";
"openWindow": "OPEN_WINDOW";
"pickUpItem": "CHECK_PICKUP_ITEM";
"popPath": "xstate.after(100)#gameMachine.moving";
"removeItemFromMap": "REMOVE_ITEM_FROM_MAP";
"step": "xstate.after(100)#gameMachine.moving";
        };
        eventsCausingDelays: {
          
        };
        eventsCausingGuards: {
          "hasNoPath": "";
"hasPath": "xstate.after(100)#gameMachine.moving";
"tileHasItem": "CHECK_PICKUP_ITEM";
        };
        eventsCausingServices: {
          
        };
        matchesStates: "initial" | "moving" | "stepping";
        tags: never;
      }
  