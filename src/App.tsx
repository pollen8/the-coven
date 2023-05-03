import { Suspense } from 'react';

import {
  Html,
  useProgress,
} from '@react-three/drei';
import { inspect } from '@xstate/inspect';
import { createActorContext } from '@xstate/react';

import Dolly from './@core/Dolly';
import { Game } from './@core/Game';
import { Map } from './@core/Map';
import { Cauldron } from './cauldron/Cauldron';
import { Character } from './Character';
import { Cupboard } from './cupboard/Cupboard';
import { gameMachine } from './game.machine';
import { level } from './levels/level1';
import { SpellBook } from './spellbook/SpellBook';
import { Window } from './ui/Window';

inspect({
  url: 'https:statecharts.io/inspect',
  iframe: false
});
function Loader() {
  const { active, progress } = useProgress();
  if (!active) {
    return null;
  }
  return <Html center>{progress} % loaded</Html>;
}

export const GameContext = createActorContext(gameMachine, {
  devTools: true,
});
function App() {
  return (
    <GameContext.Provider
      options={{
        context: {
          level,
        }
      }}
    >
      <AppInside />
    </GameContext.Provider>
  );
}

function AppInside() {
  const { send } = GameContext.useActorRef();
  const l = GameContext.useSelector(({ context }) => context.level);
  const center = GameContext.useSelector(({ context }) => context.position);

  return <>
    <Game cameraZoom={50}>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Suspense fallback={<Loader />}>
        <Dolly center={center}/>
        <Map
          level={l}
          onClick={(p) => {
            send({ type: 'MOVE_CHARACTER_TO', position: p });
          }}
        />
        <Character
          spriteImage="./chars/mani/mani-idle-run.png"
        />
      </Suspense>
    </Game>
    <div style={{ position: 'absolute', bottom: 0 }}>
      {/* todo: move into drei html */}
      <SpellWindow />
      <CauldronWindow />
      <CupboardWindow />

      <button onClick={() => send({ type: 'OPEN_WINDOW', window: 'cupboard' })}>Cupboard</button>
      <button onClick={() => send({ type: 'OPEN_WINDOW', window: 'spellBook' })}>Spell book</button>
      <button onClick={() => send({ type: 'OPEN_WINDOW', window: 'cauldron' })}>Cauldron</button>
    </div>
  </>;
}

export default App;

const SpellWindow = () => {
  const isOpen = GameContext.useSelector(({ context }) => context.windows.spellBook.open);
  const { send } = GameContext.useActorRef();

  return (
    <Window
      isOpen={isOpen}
      onClose={() => send({ type: 'CLOSE_WINDOW', window: 'spellBook' })}
    >
      <SpellBook/>
    </Window>
  );
};

const CauldronWindow = () => {
  const isOpen = GameContext.useSelector(({ context }) => context.windows.cauldron.open);
  const { send } = GameContext.useActorRef();

  return (
    <Window
      isOpen={isOpen}
      onClose={() => send({ type: 'CLOSE_WINDOW', window: 'cauldron' })}
    >
      <Cauldron />
    </Window>
  );
};

const CupboardWindow = () => {
  const isOpen = GameContext.useSelector(({ context }) => context.windows.cupboard.open);
  const { send } = GameContext.useActorRef();

  return (
    <Window
      isOpen={isOpen}
      onClose={() => send({ type: 'CLOSE_WINDOW', window: 'cupboard' })}
    >
      <Cupboard />
    </Window>
  );
};
