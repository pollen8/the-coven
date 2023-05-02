import { useMachine } from '@xstate/react';

import { spellBookMachine } from './spellbook.machine';

export const SpellBook = () => {
  console.log('render spell book');

  const [state] = useMachine(spellBookMachine);
  const books = state.context.books;
  console.log('books', books);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flexGrow: 1 }}>
        <h1>SPELL BOOK</h1>
      </div>
    </div>
  );
};
