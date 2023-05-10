import { MapPosition } from '../game.machine';
import { Item } from './cupboard.machine';

type Props = {
  position: MapPosition;
  item: Item | null;
  send: (action: any) => void;
}

export const PickedUpItem = ({
  position,
  item,
  send,
}: Props) => {
  if (!item) {
    return null;
  }
  return (
    <div>
      <div>New item</div>
      <h4>
        {
          item.img && (
            <img
              src={item.img}
              alt={item.title}
              style={{ width: '32px', height: '32px' }}
            />
          )
        }
        {item.title}
      </h4>
      <p>
        <small>
          {item.description}
        </small>
      </p>
      <button onClick={() => send({ type: 'ADD_ITEM', item, position })}>Add</button>
    </div>
  );
};
