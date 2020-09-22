import { useEffect } from 'react';

export const useEscapeClose = (send: (action: any) => void) => {
  useEffect(() => {
    const esc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        send({ type: 'CLOSE' });
      }
    }
    document.addEventListener('keydown', esc);

    return () => document.removeEventListener('keydown', esc);
  }, [send]);
}
