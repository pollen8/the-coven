import React, { FC } from 'react';
import Modal from 'react-modal';
import {
  Actor,
  State,
} from 'xstate';

import { useActor } from '@xstate/react';

import { useEscapeClose } from '../useEscapeClose';
import {
  SpellBookContext,
  SpellBookEvent,
} from './spellbook.machine';

Modal.setAppElement('#root')

interface IProps {
  actor: Actor<State<SpellBookContext, SpellBookEvent>, any>;
}
export const SpellBook: FC<IProps> = ({
  actor,
}) => {
  const [state, send] = useActor(actor);

  const { books } = state.context as SpellBookContext;
  useEscapeClose(send);

  return (<Modal
    isOpen={!state.matches('closed')}

    contentLabel="Spell book"
  >
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flexGrow: 1 }}>

      </div>
      <footer style={{ textAlign: 'center' }}>
        <button
          onClick={() => send({ type: 'CLOSE' })}>Close</button>
      </footer>
    </div>
  </Modal>)
}
