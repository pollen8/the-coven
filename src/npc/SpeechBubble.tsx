import { Text } from '@react-three/drei';

import { usePixelTexture } from '../@core/usePixelTexture';
import { MapPosition } from '../game.machine';

type Props = {
  position: MapPosition;
  isVisible: boolean;
  text: string;
}

export const SpeechBubble = ({
  position,
  isVisible,
  text,
}: Props) => {
  const bubbleImage = '../speech-bubble.png';

  const texture = usePixelTexture(bubbleImage);
  const yOffset = 1;
  return (
    <mesh
      position={[position[0], position[1] + yOffset, 2]}
    >

      <boxGeometry

        attach="geometry"
        args={[5, 3, 1]}
      />
      <meshStandardMaterial
        attach="material"
        map={texture}

        transparent
      />

      <Text
        visible={isVisible}
        position={[position[0] - 3, position[1] + yOffset + 1, 3]}
        color="#111111"
        fontSize={0.3}
        font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
      >

        {text}
      </Text>
    </mesh>
  );
};
