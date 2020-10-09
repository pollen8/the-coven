import React, {
  FC,
  Suspense,
} from 'react';

import {
  Html,
  useProgress,
} from '@react-three/drei';
import { useService } from '@xstate/react';

import { Game } from './@core/Game';
import { Map } from './@core/Map';
import Character from './Character';
import { Controls } from './controls/Controls';
import { Cupboard } from './cupboard/Cupboard';
import {
  GameActions,
  GameContext,
} from './game.machine';
import { SpellBook } from './spellbook/SpellBook';

export const tileSize = 32;

interface IProps {
  current: any;
}

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

export const GameUI: FC<IProps> = ({
  current,
}) => {
  const service = current.children.gameMachine;
  const [state, send, gameInterpreter] = useService<GameContext, GameActions>(service as any);
  const { position, grid } = state.context;


  return (
    <Game cameraZoom={40}>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Suspense fallback={<Loader />}>
        <Map level={level} />
        <Character
          send={send} />
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
