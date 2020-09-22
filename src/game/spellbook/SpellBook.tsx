import React, { FC } from 'react';
import Modal from 'react-modal';

import { useService } from '@xstate/react';

import { useEscapeClose } from '../useEscapeClose';
import {
  SpellBookContext,
  SpellBookEvent,
} from './spellbook.machine';

Modal.setAppElement('#root')

interface IProps {
  interpreter: any;
}
export const SpellBook: FC<IProps> = ({
  interpreter,
}) => {
  const service = interpreter.children.get('spellBookMachine');
  const [state, send] = useService<SpellBookContext, SpellBookEvent>(service as any);
  const { spellBook } = state.context;
  useEscapeClose(send);

  console.log('spellBookMachine', state);
  return (<Modal
    isOpen={!state.matches('closed')}
    contentLabel="Spell book"
  >
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flexGrow: 1 }}>
        <h3>Spells</h3>
        <div style={{ display: 'flex' }}>
          <div>
            {
              spellBook.spells.map((spell) => <div key={spell.name}>
                {spell.name} <button onClick={() => send({ type: 'CAST_SPELL', spell })}>cast</button>
              </div>)
            }
          </div>
        </div>
      </div>
      <footer style={{ textAlign: 'center' }}>
        <button type="button"
          onClick={() => send({ type: 'CLOSE' })}>Close</button>
      </footer>
    </div>
  </Modal>)
}
