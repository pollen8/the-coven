
  // This file was automatically generated. Edits will be overwritten

  export interface Typegen0 {
        '@@xstate/typegen': true;
        internalEvents: {
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
"moveTo": "MOVE_CHARACTER_TO";
"openCupboard": "CHECK_PICKUP_ITEM";
"openWindow": "OPEN_WINDOW";
"pickUpItem": "CHECK_PICKUP_ITEM";
"removeItemFromMap": "REMOVE_ITEM_FROM_MAP";
"talkToNpc": "CHECK_PICKUP_ITEM";
        };
        eventsCausingDelays: {
          
        };
        eventsCausingGuards: {
          "tileHasItem": "CHECK_PICKUP_ITEM";
"tileNextToNpc": "CHECK_PICKUP_ITEM";
        };
        eventsCausingServices: {
          
        };
        matchesStates: "initial";
        tags: never;
      }
  