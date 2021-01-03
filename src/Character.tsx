import React, {
  FC,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useFrame } from 'react-three-fiber';
import { PlainAnimator } from 'three-plain-animator/lib/plain-animator';

import { useTexture } from '@react-three/drei';

import GameObject from './@core/GameObject';
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
  /** Character's speed */
  speed?: number;
  /** Send events to the Game Machine */
  send: (action: GameActions) => void;
  statePosition: [number, number];
  translatePosition: ([x, y]: [number, number]) => [number, number];
  isMoving: boolean;
}

const Character: FC<IProps> = ({
  spriteImage = './chars/witch/witch1.png',
  spriteRows = 1,
  spriteColumns = 7,
  framesPerSecond = 10,
  speed = 1,
  send,
  statePosition,
  translatePosition,
  isMoving,
}) => {

  const [position, setPosition] = useState<[number, number]>([0, 0]);


  const watchKeyDown = useMemo(() => (e: KeyboardEvent) => {
    // TODO - we can simplify this down to just call MOVE_CHARACTER_TO instead.
    switch (e.key) {
      case 'ArrowLeft':
        send({ type: 'MOVE_LEFT', speed });
        break;
      case 'ArrowRight':
        send({ type: 'MOVE_RIGHT', speed });
        break;
      case 'ArrowUp':
        send({ type: 'MOVE_UP', speed });
        break;
      case 'ArrowDown':
        send({ type: 'MOVE_DOWN', speed });
        break;
      case ' ':
        send({ type: 'CHECK_PICKUP_ITEM' });
        send({ type: 'OPEN_WINDOW', window: 'cupboard' })
        break;
    }
  }, [send, speed]);

  useEffect(() => {
    document.addEventListener('keydown', watchKeyDown);
    return () => {
      document.removeEventListener('keydown', watchKeyDown);
    }
  }, [watchKeyDown]);

  const texture = useTexture(spriteImage) as any;
  const animator = useMemo(() => new PlainAnimator(texture, spriteColumns, spriteRows, isMoving ? spriteColumns * spriteRows : 1, framesPerSecond), [framesPerSecond, isMoving, spriteColumns, spriteRows, texture])

  // Animate the character run
  useFrame(() => {
    animator.animate();
    const p: [number, number] = statePosition ? statePosition : [0, 0];
    const newP = translatePosition(p);
    if (newP[0] !== position[0] || newP[1] !== position[1]) {
      setPosition(newP);
    }
  });
  return (
    <GameObject>
      <mesh
        position={[...position, 2]}>
        <boxBufferGeometry attach="geometry" args={[1, 1, 0.1]} />
        <meshStandardMaterial
          attach="material"
          map={texture}
          transparent={true} />
      </mesh>
    </GameObject>
  )
}

export default Character;
