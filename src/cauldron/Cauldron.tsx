import { FC } from 'react';
import {
  Actor,
  State,
} from 'xstate';

import { useActor } from '@xstate/react';

import {
  CauldronContext,
  CauldronEvent,
} from './cauldron.machine';

interface IProps {
  actor: Actor<State<CauldronContext, CauldronEvent>, any>;
}

export const Cauldron: FC<IProps> = ({
  actor,
}) => {
  console.log('render spell book');
  const [state, send] = useActor(actor);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flexGrow: 1 }}>
        <h1>Cauldron</h1>
      </div>
    </div>
  )
}
