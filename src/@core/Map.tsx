import React, { FC } from 'react';
import * as THREE from 'three';

import { useTexture } from '@react-three/drei';

import { ILevel } from '../game.machine';

const geometry = new THREE.PlaneBufferGeometry(1, 1);
const generics = new Array(71).fill('').map((_, i) => `./tiles/generic-rpg-tile${i < 9 ? '0' + (i + 1) : i + 1}.png`)
const tiles = [
  './tiles/generic-rpg-Slice.png',

].concat(generics);

// @TODO = the center 0,0 is in the middle of the canvas so our map needs to be displaced up to the top left:
// Perhaps something like:
// x -> x - (w / 2)
// y -> y + (h / 2)
const backgrounds = [
  './props/generic-rpg-fence01.png',
  './props/generic-rpg-fence02.png',
  './props/generic-rpg-fence06.png',
];

const loot = [
  './props/generic-rpg-loot03.png',
  './props/generic-rpg-loot04.png',
  './props/generic-rpg-loot05.png',
]

interface ITile {
  position: [number, number, number];
  texture: THREE.Texture;
  scale?: [number, number, number];
}
const Tile: FC<ITile> = ({
  position,
  texture,
  scale = [1, 1, 1],
}) => {
  return (
    <mesh
      position={position}
      scale={scale}
      geometry={geometry}
    >
      <meshBasicMaterial
        transparent
        alphaTest={0.6}
        map={texture}
      />
    </mesh>
  )
}

interface IProps {
  level: ILevel;
}

export const Map: FC<IProps> = ({
  level,
}) => {

  const textures = useTexture(tiles as any) as any[];
  const objects = useTexture(loot as any) as any[];
  const scenery = useTexture(backgrounds as any) as any[];

  return (
    <>
      {
        level.map.map((row, i) => {
          return row.map((tile, j) => <Tile
            key={`tile-${i}-${j}`}
            position={[j, level.map.length - 1 - i, 0]}
            texture={textures[tile]} />)
        })
      }
      {
        level.scenery.map((row, i) => {
          return row.map((tile, j) => tile === 0 ? null : <Tile
            key={`scenery-${i}-${j}`}
            position={[j, level.map.length - 1 - i, 0]}
            texture={scenery[tile - 1]} />)
        })
      }
      {
        level.objects.map((row, i) => {
          return row.map((tile, j) => tile === 0 ? null : <Tile
            key={`object-${i}-${j}`}
            scale={[0.5, 0.5, 1]}
            position={[j, level.map.length - 1 - i, 0]}
            texture={objects[tile - 1]} />)
        })
      }
    </>
  )
}
