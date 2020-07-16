import React, { useState } from 'react';

import { Map } from '../game/Map';
import { ITile } from '../game/Tile';
import { usePosition } from '../game/usePosition';
import { TileList } from './TileList';

const areaCols = 100;
const areaRows = 100;


const row: ITile[] = new Array(areaCols).fill('').map((v, i) => ({ row: 0, column: i, baseImg: `/tiles/generic-rpg-tile01.png` }))
const defaultArea: ITile[][] = new Array(areaRows).fill(row)
defaultArea.map((r: ITile[]) => r.map((v, i) => ({ ...v, row: i })));
const saved = JSON.parse(localStorage.getItem('map-test') ?? '{}');

export const Editor = () => {
  const position = usePosition({ x: 30, y: 20, direction: 'right' }, areaCols, areaRows);

  const [area, updateArea] = useState(saved === {} ? defaultArea : saved);
  const [name, setName] = useState('');
  return (
    <>
      <input type="text" onChange={(e) => setName(e.target.value)} />
      <button
        onClick={() => {
          localStorage.setItem('map-' + name, JSON.stringify(area));
        }}
      >
        Save
    </button>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        <Map
          area={area}
          updateArea={(props: any) => {
            console.log('upate in editor', props, area);
            const row = [...area[props.position.x]];
            row[props.position.y] = {
              ...row[props.position.y],
              baseImg: props.item.name,
            };
            updateArea([
              ...area.slice(0, props.position.x),
              row,
              ...area.slice(props.position.x + 1),
            ])
          }}
          center={position}>
        </Map>
        <div>
          <TileList />
        </div>
      </div>
    </>
  )
}

