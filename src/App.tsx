import React, {
  Suspense,
  useCallback,
  useMemo,
} from 'react';

import {
  Html,
  useProgress,
} from '@react-three/drei';
import { inspect } from '@xstate/inspect';
import { useMachine } from '@xstate/react';

import Dolly from './@core/Dolly';
import { Game } from './@core/Game';
import Map from './@core/Map';
import { Cauldron } from './cauldron/Cauldron';
import Character from './Character';
import { Cupboard } from './cupboard/Cupboard';
import { gameMachine } from './game.machine';
import { SpellBook } from './spellbook/SpellBook';
import { Window } from './ui/Window';

inspect({
  url: "https:statecharts.io/inspect",
  iframe: false
})



const level = {
  map: [
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ],
  walls: [
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],
  scenery: [
    [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ],
  objects: [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
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
  const l = useMemo(() => current.context.level, [current.context.level]);
  const translate = useCallback(([x, y]): [number, number] => [x, current.context.level.map.length - y - 1], [current.context.level.map]);
  return <>
    <Game cameraZoom={40}>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Suspense fallback={<Loader />}>
        {/* <Dolly center={current.context.position} /> */}
        <Map level={l}
          onClick={(p) => {
            send({ type: 'MOVE_CHARACTER_TO', position: p })
          }}
        />
        <Character
          statePosition={current.context.position}
          isMoving={current.matches('moving')}
          translatePosition={translate}
          send={send} />
      </Suspense>
    </Game>

    {
      current.context.windows.cupboard.actor &&
      <Window
        isOpen={current.context.windows.cupboard.open}
        onClose={() => send({ type: 'CLOSE_WINDOW', window: 'cupboard' })}>
        <Cupboard actor={current.context.windows.cupboard.actor} />
      </Window>
    }

    {
      current.context.windows.spellBook.actor &&
      <Window
        isOpen={current.context.windows.spellBook.open}
        onClose={() => send({ type: 'CLOSE_WINDOW', window: 'spellBook' })}>
        <SpellBook actor={current.context.windows.spellBook.actor} />
      </Window>
    }

    {
      current.context.windows.cauldron.actor &&
      <Window
        isOpen={current.context.windows.cauldron.open}
        onClose={() => send({ type: 'CLOSE_WINDOW', window: 'cauldron' })}>
        <Cauldron actor={current.context.windows.cauldron.actor} />
      </Window>
    }

    <button onClick={() => send({ type: 'OPEN_WINDOW', window: 'cupboard' })}>Cupboard</button>
    <button onClick={() => send({ type: 'OPEN_WINDOW', window: 'spellBook' })}>Spell book</button>
    <button onClick={() => send({ type: 'OPEN_WINDOW', window: 'cauldron' })}>Cauldron</button>
  </>
}

export default App;
