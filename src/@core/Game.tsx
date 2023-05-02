import { PropsWithChildren } from 'react';

import { Canvas } from '@react-three/fiber';

type Props = {
  cameraZoom: number;
}

export const Game = ({
  cameraZoom,
  children,
}: PropsWithChildren<Props>) => {
  return (
    <Canvas
      camera={{
        position: [0, 0, 32],
        zoom: cameraZoom,
        near: 0.1,
        far: 64,
      }}
      orthographic
      // gl2
      gl={{ antialias: false }}
      onContextMenu={e => e.preventDefault()}
    >
      {children}
    </Canvas>
  );
};

