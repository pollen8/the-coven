import {
  ActorRef,
  StateFrom,
} from 'xstate';

import { useActor } from '@xstate/react';

import { GameContext } from '../App';
import { cupboardMachine } from './cupboard.machine';
import { PickedUpItem } from './PickedUpItem';

export const Cupboard = () => {
  const game = GameContext.useActor();
  const [state, send] = useActor<ActorRef<any, StateFrom<typeof cupboardMachine>>>(game[0].children.cupboardMachine);

  const { item, cupboard, position } = state.context;

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
              position={position}
              item={item}
              send={send}
            />
          </div>
          <div>
            <h3>In cupboard</h3>
            {
              cupboard.items.map((i) => <div key={i.title}>
                {i.img &&
                  <img
                    src={i.img}
                    alt={i.title}
                    style={{ width: '32px', height: '32px' }}
                  />}
                {i.title}
                <button onClick={() => send({ type: 'REMOVE_ITEM', item: i })}>X</button>
              </div>)
            }
          </div>
        </div>
      </div>

    </div>
  );
};
