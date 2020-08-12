import React, {
  FC,
  useState,
} from 'react';

import { useService } from '@xstate/react';

import { Map } from '../game/Map';
import { usePosition } from '../game/usePosition';
import { PropForm } from './PropForm';
import { PropList } from './PropList';
import { TileList } from './TileList';

interface IProps {
  interpreter: any;
}

export const Editor: FC<IProps> = ({
  interpreter,
}) => {
  const service = interpreter.children.get('editorMachine');
  const [state, send] = useService<any, any>(service as any);

  const { position, grid } = state.context;
  usePosition(send);

  const [name, setName] = useState('');
  return (
    <>
      <input type="text" onChange={(e) => setName(e.target.value)} />
      <button
        onClick={() => {
          localStorage.setItem('map-' + name, JSON.stringify(grid));
        }}
      >
        Save
    </button>
      {
        state.matches('addProp') &&
        <PropForm
          send={send}
          state={state} />
      }
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        <Map
          area={grid}
          send={send}
          updateArea={(props: any) => {
            if (props.item.type === 'PROP') {
              send({ type: 'ADD_PROP', ...props })
            } else {
              send({ type: 'UPDATE_TILE', ...props })
            }
          }}
          center={position}>
        </Map>

        <div>
          title: {state.context.details && state.context.details.title}
          <TileList />
          <PropList />
        </div>
      </div>
    </>
  )
}

