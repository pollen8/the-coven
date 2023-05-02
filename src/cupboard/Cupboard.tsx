import { GameContext } from '../App';
import { PickedUpItem } from './PickedUpItem';

export const Cupboard = () => {
  const actor = GameContext.useSelector(({ context }) => context.windows.cupboard.actor);
  if (!actor) {
    return null;
  }
  const { send } = actor;
  const context = actor.getSnapshot()?.context;
  const matches = actor.getSnapshot()?.matches;
  if (!context || !matches) {
    return null;
  }
  const { item, cupboard } = context;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flexGrow: 1 }}>
        <h2>Cupboard</h2>
        {
          matches('warnFull') && <div role="alert">No more room</div>
        }
        <div style={{ display: 'flex' }}>
          <div style={{ width: '10rem' }}>
            <PickedUpItem
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
