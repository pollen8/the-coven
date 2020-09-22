import React, { FC } from 'react';
import Modal from 'react-modal';

import { useService } from '@xstate/react';

import { useEscapeClose } from '../useEscapeClose';
import {
  CupboardContext,
  CupboardEvent,
} from './cupboard.machine';
import { PickedUpItem } from './PickedUpItem';

Modal.setAppElement('#root')

interface IProps {
  interpreter: any;
}
export const Cupboard: FC<IProps> = ({
  interpreter,
}) => {
  const service = interpreter.children.get('cupboardMachine');
  const [state, send] = useService<CupboardContext, CupboardEvent>(service as any);
  const { item, cupboard } = state.context;
  useEscapeClose(send);

  return (<Modal
    isOpen={!state.matches('closed')}

    contentLabel="Cupboard"
  >
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flexGrow: 1 }}>
        <h3>Cupboard</h3>
        {
          state.matches('warnFull') && <div role="alert">No more room</div>
        }
        <div style={{ display: 'flex' }}>

          <PickedUpItem
            item={item}
            send={send} />
          <div>
            {
              cupboard.items.map((i) => <div key={i.title}>
                <img src={i.propImg} alt={i.title} style={{ width: '32px', height: '32px' }} />
                {i.title} <button onClick={() => send({ type: 'REMOVE_ITEM', item: i })}>X</button>
              </div>)
            }
          </div>
        </div>
      </div>
      <footer style={{ textAlign: 'center' }}>
        <button
          onClick={() => send({ type: 'CLOSE' })}>Close</button>
      </footer>
    </div>
  </Modal>)
}
