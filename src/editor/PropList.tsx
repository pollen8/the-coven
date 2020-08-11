import React, { FC } from 'react';
import { useDrag } from 'react-dnd';

import { Tile } from '../game/Tile';

const i: string[] = [];

const props = new Array(4).fill('').map((s, i) => {
  return i < 9
    ? `/props_n_decorations/generic-rpg-loot0${i + 1}.png`
    : `/props_n_decorations/generic-rpg-loot${i + 1}.png`
})
const tiles: string[] = i.concat([
  ...props,
]);
export const PropList = () => {
  return (
    <>
      <h1>drag props...</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)' }}>
        {tiles.map((tile) => <DraggableProp key={tile} baseImg={tile} />)}
      </div>

    </>)
}

const DraggableProp: FC<{ baseImg: string }> = ({
  baseImg
}) => {
  const [{ isDragging }, drag] = useDrag({
    item: { name: baseImg, type: 'PROP' },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })
  const opacity = isDragging ? 0.4 : 1;

  return <div ref={drag} style={{ cursor: 'move' }}><Tile
    baseImg={baseImg}

    style={{ width: '1.5rem', height: '1.5rem', margin: '0.1rem', opacity }} />
  </div>
}
