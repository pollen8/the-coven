import React from 'react';

import { Cauldron } from './Cauldron';
import Character from './Character';
import { IngredientsList } from './IngredientsList';
import { Map } from './Map';
import { ITile } from './Tile';
import { usePosition } from './usePosition';

const rand = (min: number, max: number) => {
  const v = Math.floor(Math.random() * (max - min) + min);
  return v < 10 ? `0${v}` : v;
}

const areaCols = 100;
const areaRows = 100;


const row: ITile[] = new Array(areaCols).fill('').map((v, i) => ({ row: 0, column: i, baseImg: `/tiles/generic-rpg-tile01.png` }))
const defaultArea: ITile[][] = new Array(areaRows).fill(row)
defaultArea.map((r: ITile[]) => r.map((v, i) => ({ ...v, row: i })));
const area = JSON.parse(localStorage.getItem('map-test') ?? '{}');


export const GameUI = () => {
  const position = usePosition({ x: 30, y: 20, direction: 'right' }, areaCols, areaRows);
  console.log('position', position);
  return (
    <div>
      <Map
        area={area}
        center={position}>
        <Character position={position} />
      </Map>

      <IngredientsList />
      <Cauldron />
    </div>
  )
}
