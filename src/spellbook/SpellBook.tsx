import { FC } from 'react';
import {
  Actor,
  State,
} from 'xstate';

import { useActor } from '@xstate/react';

import {
  SpellBookContext,
  SpellBookEvent,
} from './spellbook.machine';

interface IProps {
  actor: Actor<State<SpellBookContext, SpellBookEvent>, any>;
}

export const SpellBook: FC<IProps> = ({
  actor,
}) => {
  console.log('render spell book');
  const [state, send] = useActor(actor);

  const { books } = state.context as SpellBookContext;
  console.log('books', books);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flexGrow: 1 }}>
        <h1>SPELL BOOK</h1>
      </div>
    </div>
  )
}
