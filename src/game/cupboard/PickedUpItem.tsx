import React, { FC } from 'react';
import { sendParent } from 'xstate';

import { IItem } from '../Tile';

interface IProps {
  item: IItem | null;
  send: (action: any) => void;
}

export const PickedUpItem: FC<IProps> = ({
  item,
  send,
}) => {
  if (!item) {
    return null;
  }
  return (
    <div>
      <div>New item</div>
      <h4>
        <img src={item.propImg} alt={item.title} style={{ width: '32px', height: '32px' }} />{item.title}
      </h4>
      <p>
        <small>
          {item.description}
        </small>
      </p>
      <button onClick={() => send({ type: 'ADD_ITEM', item })}>Add</button>
    </div>
  )
}
