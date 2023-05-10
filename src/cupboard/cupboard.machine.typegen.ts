
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
          "addItem": "ADD_ITEM";
"clearItem": "ADD_ITEM";
"removeItem": "REMOVE_ITEM";
"setItem": "SET_ITEM";
"setItemPosition": "SET_ITEM";
        };
        eventsCausingDelays: {
          
        };
        eventsCausingGuards: {
          "isFull": "ADD_ITEM";
"notEmpty": "REMOVE_ITEM";
"notFull": "ADD_ITEM";
        };
        eventsCausingServices: {
          
        };
        matchesStates: "open" | "warnFull";
        tags: never;
      }
  