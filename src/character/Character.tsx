import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { ActorRefFrom } from 'xstate';

import { useFrame } from '@react-three/fiber';
import { useActor } from '@xstate/react';

import { GameObject } from '../@core/GameObject';
import { PlainAnimator } from '../@core/plain-animator';
import { usePixelTexture } from '../@core/usePixelTexture';
import { GameContext } from '../App';
import { characterMachine } from './character.machine';

type Props = {
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
  actor: ActorRefFrom<typeof characterMachine>;
  // TranslatePosition: ([x, y]: [number, number]) => [number, number];
};

export const Character = ({
  spriteImage = '../chars/witch/witch1.png',
  spriteRows = 2,
  spriteColumns = 7,
  framesPerSecond = 10,
  speed = 1,
  actor,
}: Props) => {
  const { send: sendGame } = GameContext.useActorRef();

  const [state, send] = useActor(actor);
  // return null;

  const statePosition = state.context.position; // GameContext.useSelector(({ context }) => context.position);
  const isMoving = state.matches('moving') || state.matches('stepping');
  const [position, setPosition] = useState<[number, number]>([0, 0]);

  // TODO - we can simplify this down to just call MOVE_CHARACTER_TO instead.
  const watchKeyDown = useMemo(() => (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowLeft':
        send({ type: 'MOVE_LEFT', speed });
        e.preventDefault(); // Avoid scrolling the browser window
        break;
      case 'ArrowRight':
        send({ type: 'MOVE_RIGHT', speed });
        e.preventDefault();
        break;
      case 'ArrowUp':
        send({ type: 'MOVE_UP', speed });
        e.preventDefault();
        break;
      case 'ArrowDown':
        send({ type: 'MOVE_DOWN', speed });
        e.preventDefault();
        break;
      case ' ':
        sendGame({ type: 'CHECK_PICKUP_ITEM', position: statePosition });
        e.preventDefault();

        break;
      default:
        break;
    }
  }, [send, speed, sendGame, statePosition]); // @TODO is it position or statePosition

  useEffect(() => {
    document.addEventListener('keydown', watchKeyDown);
    return () => {
      document.removeEventListener('keydown', watchKeyDown);
    };
  }, [watchKeyDown]);

  const texture = usePixelTexture(spriteImage);
  const animator = useMemo(
    () => new PlainAnimator(texture, spriteColumns, spriteRows, isMoving ? spriteColumns * spriteRows : 1, framesPerSecond)
    , [framesPerSecond, spriteColumns, spriteRows, texture, isMoving]
  );

  const translate = useCallback(([x, y]: [number, number]): [number, number] => [x, y * -1], []);

  // Animate the character run
  useFrame(() => {
    animator.animate();

    const p: [number, number] = statePosition ? statePosition : [0, 0];
    const newP = translate(p);
    if (newP[0] !== position[0] || newP[1] !== position[1]) {
      setPosition(newP);
    }
  });
  return (
    <GameObject>
      <sprite

        position={[...position, 2]}
      >
        <spriteMaterial
          transparent
          map={texture}
        />
        {/* <boxGeometry
          attach="geometry"
          args={[1, 1, 0.1]}
        />
        <meshStandardMaterial
          attach="material"
          map={texture}
          transparent
        /> */}
      </sprite>
    </GameObject>
  );
};
