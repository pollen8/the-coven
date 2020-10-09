import React, {
  FC,
  useMemo,
} from 'react';
import * as THREE from 'three';

import { useTexture } from '@react-three/drei';

const geometry = new THREE.PlaneBufferGeometry(1, 1);
const generics = new Array(71).fill('').map((_, i) => `./tiles/generic-rpg-tile${i < 9 ? '0' + (i + 1) : i + 1}.png`)
const tiles = [
  './tiles/generic-rpg-Slice.png',

].concat(generics);

const props = [
  './props/generic-rpg-fence01.png',
  './props/generic-rpg-fence02.png',
  './props/generic-rpg-fence06.png',
];

interface ITile {
  position: [number, number, number];
  texture: THREE.Texture;
}
const Tile: FC<ITile> = ({
  position,
  texture,
}) => {
  return (
    <mesh
      position={position}
      scale={[1, 1, 1]}
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
  level: {
    map: number[][];
    objects: number[][];
  }
}
export const Map: FC<IProps> = ({
  level,
}) => {
  const flipped = useMemo(() => {
    return {
      map: level.map.reverse(),
      objects: level.objects.reverse(),
    };
  }, [level])
  const textures = useTexture(tiles as any) as any[];
  const objects = useTexture(props as any) as any[];

  return (
    <>
      {
        flipped.map.map((row, i) => {
          return row.map((tile, j) => <Tile
            key={`tile-${i}-${j}`}
            position={[j, i, 0]}
            texture={textures[tile]} />)
        })
      }
      {
        flipped.objects.map((row, i) => {
          return row.map((tile, j) => tile === 0 ? null : <Tile
            key={`object-${i}-${j}`}
            position={[j, i, 0]}
            texture={objects[tile - 1]} />)
        })
      }
    </>
  )
}
