import React, {
  FC,
  useEffect,
  useMemo,
  useState,
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
  /** Character's speed */
  speed?: number;
  /** Send events to the Game Machine */
  send: (action: GameActions) => void;
  statePosition: [number, number];
}

const Character: FC<IProps> = ({
  spriteImage = './chars/gabe/gabe-idle-run.png',
  spriteRows = 1,
  spriteColumns = 7,
  framesPerSecond = 10,
  speed = 0.5,
  send,
  statePosition,
}) => {

  const [isMoving, setIsMoving] = useState(false);
  const [position, setPosition] = useState<[number, number]>([0, 0]);


  const watchKeyDown = useMemo(() => (e: KeyboardEvent) => {
    send({ type: 'KEY_DOWN', key: e.key, speed });
    setIsMoving(e.key.includes('Arrow'))
  }, [send, speed]);


  const watchKeyUp = useMemo(() => (e: KeyboardEvent) => {
    send({ type: 'KEY_DOWN', key: '', speed });
    setIsMoving(false)
  }, [send, speed]);

  useEffect(() => {
    document.addEventListener('keydown', watchKeyDown);
    document.addEventListener('keyup', watchKeyUp);
    return () => {
      document.removeEventListener('keydown', watchKeyDown);
      document.removeEventListener('keydown', watchKeyUp);
    }
  }, [watchKeyDown, watchKeyUp]);

  const texture = useTexture(spriteImage) as any;
  const animator = useMemo(() => new PlainAnimator(texture, spriteColumns, spriteRows, isMoving ? spriteColumns * spriteRows : 1, framesPerSecond), [framesPerSecond, isMoving, spriteColumns, spriteRows, texture])

  useFrame(() => {
    animator.animate();
    setPosition(statePosition ? statePosition : [0, 0])
  });

  return (
    <mesh position={[...position, 2]}>
      <boxBufferGeometry attach="geometry" args={[1, 1, 0.1]} />
      <meshStandardMaterial
        attach="material"
        map={texture}
        transparent={true} />
    </mesh>
  )
}

export default Character;
