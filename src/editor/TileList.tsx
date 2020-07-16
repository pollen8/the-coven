import React, { FC } from 'react';
import { useDrag } from 'react-dnd';

import { Tile } from '../game/Tile';

const i: string[] = new Array(71).fill('').map((s, i) => {
  return i < 9
    ? `/tiles/generic-rpg-tile0${i + 1}.png`
    : `/tiles/generic-rpg-tile${i + 1}.png`
})
const waterfall = new Array(8).fill('').map((s, i) => {
  return i < 19
    ? `/tiles/generic-rpg-tile-waterfall0${i + 1}.png`
    : `/tiles/generic-rpg-tile-waterfall${i + 1}.png`
})
const tiles: string[] = i.concat([
  ...waterfall,
  '/tiles/generic-rpg-Slice.png',
]);
export const TileList = () => {
  return (
    <>
      <h1>drag tiles...</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)' }}>
        {tiles.map((tile) => <DraggableTile key={tile} baseImg={tile} />)}
      </div>

    </>)
}

const DraggableTile: FC<{ baseImg: string }> = ({
  baseImg
}) => {
  const [{ isDragging }, drag] = useDrag({
    item: { name: baseImg, type: 'TILE' },
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
