import React, { FC } from 'react';

import { useService } from '@xstate/react';

import { Cauldron } from './Cauldron';
import Character from './Character';
import { Cupboard } from './Cupboard';
import { Map } from './Map';
import { ToggleAudio } from './ToogleAudio';
import { usePosition } from './usePosition';

export const tileSize = 16;


interface IProps {
  interpreter: any;
}
export const GameUI: FC<IProps> = ({
  interpreter,
}) => {

  const service = interpreter.children.get('gameMachine');
  const [state, send, gameInterpreter] = useService<any, any>(service as any);
  console.log('game state', state);
  const { position, grid } = state.context;
  usePosition(send);
  return (
    <div>
      <Map
        area={grid}
        viewPortRows={21}
        viewPortCols={21}
        center={position}>
        <Character position={position}
          send={send}
          style={{
            left: tileSize * (21 / 2) - tileSize / 2,
            top: tileSize * (21 / 2) - tileSize / 2,
          }} />
      </Map>
      <ToggleAudio />
      {
        state.matches('openCupboard') &&

        <Cupboard interpreter={gameInterpreter} />
      }
      <Cauldron />
    </div>
  )
}
