import { GameContext } from '../App';
import { Npc } from './Npc';

export const Npcs = () => {
  const npcs = GameContext.useSelector(({ context }) => context.npcs);

  return (
    <>
      {
        npcs.map((npc) => (
          <Npc
            key={npc.id}
            actor={npc}
          />
        ))
      }
    </>
  );
};
