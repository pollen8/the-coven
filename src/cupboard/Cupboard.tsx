import React, { FC } from 'react';
import {
  Actor,
  State,
} from 'xstate';

import { useActor } from '@xstate/react';

import {
  CupboardContext,
  CupboardEvent,
} from './cupboard.machine';
import { PickedUpItem } from './PickedUpItem';

interface IProps {
  actor: Actor<State<CupboardContext, CupboardEvent>, any>;
}
export const Cupboard: FC<IProps> = ({
  actor,
}) => {
  const [state, send] = useActor(actor);

  const { item, cupboard } = state.context as CupboardContext;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flexGrow: 1 }}>
        <h2>Cupboard</h2>
        {
          state.matches('warnFull') && <div role="alert">No more room</div>
        }
        <div style={{ display: 'flex' }}>
          <div style={{ width: '10rem' }}>
            <PickedUpItem
              item={item}
              send={send} />
          </div>
          <div>
            <h3>In cupboard</h3>
            {
              cupboard.items.map((i) => <div key={i.title}>
                {i.img &&
                  <img src={i.img}
                    alt={i.title}
                    style={{ width: '32px', height: '32px' }} />
                }
                {i.title}
                <button onClick={() => send({ type: 'REMOVE_ITEM', item: i })}>X</button>
              </div>)
            }
          </div>
        </div>
      </div>

    </div>
  )
}
