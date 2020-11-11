import React, { FC } from 'react';
import { Canvas } from 'react-three-fiber';

interface IProps {
  cameraZoom: number;
}
export const Game: FC<IProps> = ({
  cameraZoom,
  children,
}) => {
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
      // @ts-ignore
      gl={{ antialias: false }}
      onContextMenu={e => e.preventDefault()}
    >
      {children}
    </Canvas>
  )
}

