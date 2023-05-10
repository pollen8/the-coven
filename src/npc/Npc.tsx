import {
  useCallback,
  useMemo,
  useState,
} from 'react';
import { NearestFilter } from 'three';
import { ActorRefFrom } from 'xstate';

import { useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useActor } from '@xstate/react';

import { GameObject } from '../@core/GameObject';
import { PlainAnimator } from '../@core/plain-animator';
import { usePixelTexture } from '../@core/usePixelTexture';
import { MapPosition } from '../game.machine';
import { npcMachine } from './npc.machine';
import { SpeechBubble } from './SpeechBubble';

type Props = {
  actor: ActorRefFrom<typeof npcMachine>;
};

export const Npc = ({
  actor,
}: Props) => {
  const spriteColumns = 1;
  const spriteRows = 1;
  const framesPerSecond = 10;
  const [state] = useActor(actor);

  const isMoving = state.matches('walking');
  const isChatting = state.matches('chatting');
  const statePosition = state.context.position;
  const [position, setPosition] = useState<MapPosition>([0, 0]);

  console.log('npc sprite', state.context.spriteImage, isChatting);
  const texture = usePixelTexture(state.context.spriteImage);
  const animator = useMemo(
    () => new PlainAnimator(texture, spriteColumns, spriteRows, isMoving ? spriteColumns * spriteRows : 1, framesPerSecond)
    , [framesPerSecond, spriteColumns, spriteRows, texture, isMoving]
  );

  const translate = useCallback(([x, y]: MapPosition): MapPosition => [x, y * -1], []);
  console.log('statePosition', statePosition);
  // Animate the character run
  useFrame(() => {
    animator.animate();

    const p: MapPosition = statePosition ? statePosition : [0, 0];
    const newP = translate(p);
    if (newP[0] !== position[0] || newP[1] !== position[1]) {
      setPosition(newP);
    }
  });
  //
  console.log(position);
  return (
    <GameObject>
      {/*
      <SpeechBubble
        isVisible={isChatting}
        position={position}
        text="hello"
      /> */}
      <sprite

        position={[...position, 2]}
      >
        <spriteMaterial
          transparent
          map={texture}
        />
      </sprite>
    </GameObject>
  );
};
