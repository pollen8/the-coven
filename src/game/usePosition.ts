import { useEffect } from 'react';

export type Direction = 'up' | 'down' | 'left' | 'right';

export interface IPosition {
  x: number;
  y: number;
  direction: Direction;
}

export const usePosition = (send: (action: any) => void) => {
  useEffect(() => {
    const watchKey: any = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          send({ type: 'MOVE_DOWN' });
          e.preventDefault();
          break;
        case 'ArrowUp':
          send({ type: 'MOVE_UP' });
          e.preventDefault();
          break;
        case 'ArrowLeft':
          send({ type: 'MOVE_LEFT' });
          e.preventDefault();
          break;
        case 'ArrowRight':
          send({ type: 'MOVE_RIGHT' });
          e.preventDefault();
          break;
        case ' ':
          send({ type: 'CHECK_PICKUP_PROP' });
          break;
      }
    }
    document.addEventListener('keydown', watchKey);

    return () => document.removeEventListener('keydown', watchKey);
  }, [send]);
}
