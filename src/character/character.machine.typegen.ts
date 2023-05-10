
  // This file was automatically generated. Edits will be overwritten

  export interface Typegen0 {
        '@@xstate/typegen': true;
        internalEvents: {
          "": { type: "" };
"xstate.after(100)#character.moving": { type: "xstate.after(100)#character.moving" };
"xstate.after(100)#character.stepping": { type: "xstate.after(100)#character.stepping" };
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
          "makePath": "MOVE_CHARACTER_TO";
"moveDown": "MOVE_DOWN";
"moveLeft": "MOVE_LEFT";
"moveRight": "MOVE_RIGHT";
"moveUp": "MOVE_UP";
"popPath": "xstate.after(100)#character.moving";
"setLevel": "SET_LEVEL";
"step": "xstate.after(100)#character.moving";
        };
        eventsCausingDelays: {
          
        };
        eventsCausingGuards: {
          "canMoveDown": "MOVE_DOWN";
"canMoveLeft": "MOVE_LEFT";
"canMoveRight": "MOVE_RIGHT";
"canMoveUp": "MOVE_UP";
"hasNoPath": "";
"hasPath": "xstate.after(100)#character.moving";
        };
        eventsCausingServices: {
          
        };
        matchesStates: "idle" | "moving" | "stepping" | "talking";
        tags: never;
      }
  