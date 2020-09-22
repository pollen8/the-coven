import React, { FC } from 'react';

import { Cauldron } from '../cauldron/Cauldron';
import { GameActions } from '../game.machine';
import { ToggleAudio } from './ToogleAudio';

interface IProps {
  send: (action: GameActions) => void;
}

export const Controls: FC<IProps> = ({
  send,
}) => {
  return (
    <div>
      <ToggleAudio />
      <button onClick={() => send({ type: 'OPEN_SPELL_BOOK' })}>Spell Book</button>
      <Cauldron />
    </div>
  )
}
