

import React, { Suspense } from 'react';
import { useFrame } from 'react-three-fiber';
import { OrthographicCamera } from 'three';

import {
  Html,
  useProgress,
} from '@react-three/drei';
import { inspect } from '@xstate/inspect';
import { useMachine } from '@xstate/react';

import { Game } from './@core/Game';
import { Map } from './@core/Map';
import Character from './Character';
import { gameMachine } from './game.machine';

inspect({
  url: "https://statecharts.io/inspect",
  iframe: false
});

const level = {
  map: [
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 4],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  ],
  scenery: [
    [0, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  ],
  objects: [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]
}

function Loader() {
  const { active, progress } = useProgress();
  if (!active) {
    return null
  }
  return <Html center>{progress} % loaded</Html>
}

function App() {
  const [current, send] = useMachine(gameMachine, {
    devTools: true,
    context: {
      level,
    }
  });

  return <Game cameraZoom={40}>
    <ambientLight />
    <pointLight position={[10, 10, 10]} />
    <Suspense fallback={<Loader />}>
      <Dolly />
      <Map level={current.context.level} />
      <Character
        statePosition={current.context.position}
        translatePosition={([x, y]) => [x, current.context.level.map.length - y - 1]}
        send={send} />
    </Suspense>
  </Game>
}

export default App;

// @TODO - when the character gets within a certain bounds of the screen we should scroll the camera
// This means putting its offset in the machine context, calculated when we move transition in the machine.
// The characters game position would be a vector of its screen position + the camera offset.
let i = 0;
const Dolly = () => {
  // This one makes the camera move to the right
  useFrame(({ clock, camera }) => {
    const c = camera as OrthographicCamera;
    if (i < 40 && clock.elapsedTime > 1) {

      c.left = c.left + 1;
      camera.updateProjectionMatrix()
      // console.log(clock, camera);
      i++
    }
  })

  return null
}
