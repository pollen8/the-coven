import { Html } from '@react-three/drei';

import { usePixelTexture } from '../@core/usePixelTexture';
import { MapPosition } from '../game.machine';

type Props = {
  position: MapPosition;
  isVisible: boolean;
}

export const SpeechBubble = ({
  position,
  isVisible,
}: Props) => {
  const bubbleImage = '../speech-bubble.png';

  const texture = usePixelTexture(bubbleImage);
  const yOffset = 0.8;
  if (!isVisible) {
    return null;
  }
  return (
    <>
      <sprite
        position={[position[0] + 0.4, position[1] + yOffset, 3]}
      >
        <spriteMaterial
          transparent
          map={texture}
        />
      </sprite>
      <sprite>
        <Html
          // occlude="blending"
          transform
          sprite
          style={{ background: 'transparent' }}
        ><h1>hello</h1></Html>
      </sprite>
    </>
  );
};
