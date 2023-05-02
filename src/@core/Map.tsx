import { PlaneGeometry } from 'three';

import { useTexture } from '@react-three/drei';

import { ILevel } from '../game.machine';
import { GameObject } from './GameObject';

const geometry = new PlaneGeometry(1, 1);
const generics = new Array(71).fill('').map((_, i) => `./tiles/generic-rpg-tile${i < 9 ? '0' + (i + 1) : i + 1}.png`);
const tiles = [
  './tiles/generic-rpg-Slice.png',
  './tiles/generic-rpg-tile70.png',

].concat(generics);

const backgrounds = [
  './props/generic-rpg-fence01.png',
  './props/generic-rpg-fence02.png',
  './props/generic-rpg-fence06.png',
];

interface ITile {
  position: [number, number, number];
  texture: THREE.Texture;
  scale?: [number, number, number];
  onClick?: () => void;
}
const Tile = ({
  position,
  texture,
  scale = [1, 1, 1],
  onClick,
}: ITile) => {
  return (
    <GameObject>
      <mesh
        onClick={onClick}
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
    </GameObject>
  );
};

const loot = ['./props/generic-rpg-loot03.png', './props/generic-rpg-loot05.png'];

interface IProps {
  level: ILevel;
  onClick?: (position: [number, number]) => void;
}
const Map = ({
  level,
  onClick,
}: IProps) => {
  const textures = useTexture(tiles);
  const objects = useTexture(loot);
  const scenery = useTexture(backgrounds);
  return (
    <>
      {
        level.map.map((row, i) => {
          return row.map((tile, j) => (
            <Tile
              onClick={() => onClick && onClick([j, i])}
              key={`tile-${i}-${j}`}
              position={[j, level.map.length - 1 - i, 0]}
              texture={textures[tile]}
            />)
          );
        })
      }
      {
        level.scenery.map((row, i) => {
          return row.map((tile, j) => tile === 0 ? null : (
            <Tile
              key={`scenery-${i}-${j}`}
              position={[j, level.map.length - 1 - i, 0]}
              texture={scenery[tile - 1]}
            />
          ));
        })
      }
      {
        level.objects.map((row, i) => {
          return row.map((tile, j) => tile === 0 ? null : (
            <Tile
              key={`object-${i}-${j}`}
              scale={[0.5, 0.5, 1]}
              position={[j, level.map.length - 1 - i, 0]}
              texture={objects[tile - 1]}
            />
          ));
        })
      }
    </>
  );
};

export default Map;
