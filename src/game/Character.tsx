import React, {
  FC,
  useEffect,
  useMemo,
} from 'react';
import { useFrame } from 'react-three-fiber';
import { PlainAnimator } from 'three-plain-animator/lib/plain-animator';

import { useTexture } from '@react-three/drei';

import { GameActions } from './game.machine';

interface IProps {
  /** Path name to the texture containing the character's sprite canvas */
  spriteImage?: string;
  /** Number of rows in the sprite canvas */
  spriteRows?: number;
  /** Number of columns in the sprite canvas */
  spriteColumns?: number;
  /** Frames per second */
  framesPerSecond?: number;
  /** Initial position (x,y,z) */
  initialPosition?: [number, number, number];
  /** Character's speed */
  speed?: number;
  /** Send events to the Game Machine */
  send: (action: GameActions) => void;
  // position: IPosition;
  moving: boolean;
  keyPressed: string;
  dispatch: (action: any) => void;
  position: [number, number, number];
}

const Character: FC<IProps> = ({
  spriteImage = './chars/gabe/gabe-idle-run.png',
  spriteRows = 1,
  spriteColumns = 7,
  framesPerSecond = 10,
  initialPosition = [0, 0, 2],
  speed = 0.2,
  send,
  moving,
  keyPressed,
  dispatch,
  position,
}) => {
  console.log('position', position);
  // const [{ position, moving, key }, dispatch] = useReducer(keyDownReducer, initialState)

  const watchKeyDown = useMemo(() => (e: KeyboardEvent) => dispatch({ type: 'setKey', key: e.key }), [dispatch]);

  const watchKeyUp = useMemo(() => (e: KeyboardEvent) => dispatch({ type: 'setKey', key: '' }), [dispatch]);
  useEffect(() => {
    document.addEventListener('keydown', watchKeyDown);
    document.addEventListener('keyup', watchKeyUp);
    return () => {
      document.removeEventListener('keydown', watchKeyDown);
      document.removeEventListener('keydown', watchKeyUp);
    }
  }, [watchKeyDown, watchKeyUp]);

  const texture = useTexture(spriteImage) as any;
  const animator = useMemo(() => new PlainAnimator(texture, spriteColumns, spriteRows, moving ? spriteColumns * spriteRows : 1, framesPerSecond), [framesPerSecond, moving, spriteColumns, spriteRows, texture])

  useFrame(() => {
    animator.animate();
    console.log('animate loop key', keyPressed);
    switch (keyPressed) {
      case 'ArrowRight':
        return dispatch({ type: 'setPosition', position: [position[0] + speed, position[1], position[2]] });
      case 'ArrowLeft':
        return dispatch({ type: 'setPosition', position: [position[0] - speed, position[1], position[2]] });
      case 'ArrowUp':
        return dispatch({ type: 'setPosition', position: [position[0], position[1] + speed, position[2]] });
      case 'ArrowDown':
        return dispatch({ type: 'setPosition', position: [position[0], position[1] - speed, position[2]] });
    }
  });

  return (
    <mesh position={position}>
      <boxBufferGeometry attach="geometry" args={[1, 1, 0.1]} />
      <meshStandardMaterial
        attach="material"
        map={texture}
        transparent={true} />
    </mesh>
  )

}

export default Character;
