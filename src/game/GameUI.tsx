import React, {
  FC,
  useEffect,
} from 'react';

import { useService } from '@xstate/react';

import Character from './Character';
import { Controls } from './controls/Controls';
import { Cupboard } from './cupboard/Cupboard';
import {
  GameActions,
  GameContext,
} from './game.machine';
import { Map } from './Map';
import { SpellBook } from './spellbook/SpellBook';
import { usePosition } from './usePosition';

export const tileSize = 32;

interface IProps {
  current: any;
}
export const GameUI: FC<IProps> = ({
  current,
}) => {
  const service = current.children.gameMachine;
  const [state, send, gameInterpreter] = useService<GameContext, GameActions>(service as any);
  const { position, grid } = state.context;

  useEffect(() => {
    localStorage.setItem('the-coven', JSON.stringify(state.context));
  }, [state.context])

  console.log('state', state);
  usePosition(send);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flexGrow: 1 }}>
        <Map
          area={grid}
          viewPortRows={21}
          viewPortCols={21}
          center={position}>
          <Character
            position={position}
            size={tileSize}
            send={send}
            style={{
              left: tileSize * (21 / 2) - tileSize / 2,
              top: tileSize * (21 / 2) - tileSize / 2,
            }} />
        </Map>
      </div>
      <Controls send={send} />

      {
        state.children.hasOwnProperty('cupboardMachine') &&
        <Cupboard interpreter={gameInterpreter} />
      }
      {
        state.children.hasOwnProperty('spellBookMachine') &&
        <SpellBook interpreter={gameInterpreter} />
      }

    </div>
  )
}
