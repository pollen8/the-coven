import React, {
  FC,
  Suspense,
  useReducer,
} from 'react';

import {
  Html,
  useProgress,
} from '@react-three/drei';
import { useMachine } from '@xstate/react';

import { Game } from './@core/Game';
import { Map } from './@core/Map';
import {
  areaCols,
  areaRows,
  grid,
  position,
} from './buildMap';
import Character from './Character';
import { Controls } from './controls/Controls';
import { Cupboard } from './cupboard/Cupboard';
import { gameMachine } from './game.machine';
import { SpellBook } from './spellbook/SpellBook';

export const tileSize = 32;



function Loader() {
  const { active, progress, errors, item, loaded, total } = useProgress();
  console.log({ active, progress, errors, item, loaded, total });
  if (!active) {
    return null
  }
  return <Html center>{progress} % loaded</Html>
}

const level = {
  map: [
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ],
  objects: [
    [0, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  ]
}


interface IState {
  moving: boolean;
  position: [number, number, number];
  key: string,
}

type Action = { type: 'setKey', key: string }
  | { type: 'setPosition', position: [number, number, number] };




const keyDownReducer = (state: IState, action: Action): IState => {
  console.log('key red', action);
  switch (action.type) {
    case 'setPosition':
      return {
        ...state,
        position: action.position,
      }
    case 'setKey': {
      return {
        ...state,
        moving: action.key.includes('Arrow'),
        key: action.key,
      }
    }
  }
  return state;
};

export const GameUI: FC = () => {
  let context: any = localStorage.getItem('the-coven');
  context = context ? JSON.parse(context) : {
    grid,
    areaCols,
    areaRows,
    position: { x: 0, y: 0, direction: 'right' },
  };

  const [current, send] = useMachine(gameMachine, {
    devTools: true,
    context,
  });

  const p = current.context.position

  const initialState: IState = {
    moving: false,
    key: '',
    position: [p.x, p.y, 2],
  };

  const [{ position, moving, key }, dispatch] = useReducer(keyDownReducer, initialState)



  return (
    <Game cameraZoom={40}>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Suspense fallback={<Loader />}>
        <Map level={level} />
        <Character
          send={send}
          moving={moving}
          keyPressed={key}
          dispatch={dispatch}
          position={position} />
      </Suspense>
    </Game>

  )
  // return (
  //   <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

  //     <Controls send={send} />

  //     {
  //       state.children.hasOwnProperty('cupboardMachine') &&
  //       <Cupboard interpreter={gameInterpreter} />
  //     }
  //     {
  //       state.children.hasOwnProperty('spellBookMachine') &&
  //       <SpellBook interpreter={gameInterpreter} />
  //     }

  //   </div>
  // )
}
