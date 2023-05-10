import { GameContext } from '../App';
import { Character } from './Character';

export const Characters = () => {
  const characters = GameContext.useSelector(({ context }) => context.characters);

  return (
    <>
      {
        characters.map((character) => (
          <Character
            spriteImage="./chars/mani/mani-idle-run-2.png"
            key={character.id}
            actor={character}
          />
        ))
      }
    </>
  );
};
