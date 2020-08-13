import React, {
  FC,
  useEffect,
} from 'react';

import { useService } from '@xstate/react';

import { Cauldron } from './Cauldron';
import Character from './Character';
import { Cupboard } from './cupboard/Cupboard';
import { Map } from './Map';
import { ToggleAudio } from './ToogleAudio';
import { usePosition } from './usePosition';

export const tileSize = 32;

interface IProps {
  current: any;
}
export const GameUI: FC<IProps> = ({
  current,
}) => {
  const service = current.children.gameMachine;
  const [state, send, gameInterpreter] = useService<any, any>(service as any);
  const { position, grid } = state.context;

  useEffect(() => {
    localStorage.setItem('the-coven', JSON.stringify(state.context));
  }, [state.context])

  usePosition(send);
  return (
    <div>
      <Map
        area={grid}
        viewPortRows={21}
        viewPortCols={21}
        center={position}>
        <Character position={position}
          size={tileSize}
          send={send}
          style={{
            left: tileSize * (21 / 2) - tileSize / 2,
            top: tileSize * (21 / 2) - tileSize / 2,
          }} />
      </Map>
      <ToggleAudio />
      {
        state.children.hasOwnProperty('cupboardMachine') &&

        <Cupboard interpreter={gameInterpreter} />
      }
      <Cauldron />
    </div>
  )
}
