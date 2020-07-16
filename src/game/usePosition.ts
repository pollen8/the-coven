import {
  useEffect,
  useState,
} from 'react';

export type Direction = 'up' | 'down' | 'left' | 'right';

export interface IPosition {
  x: number;
  y: number;
  direction: Direction;
}
export const usePosition = (initialPosition: IPosition, areaCols: number, areaRows: number) => {
  const [position, setPosition] = useState(initialPosition);
  useEffect(() => {
    const watchKey: any = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          setPosition({
            ...position,
            y: Math.min(areaRows, position.y + 1),
            direction: 'down',
          })
          e.preventDefault();
          break;
        case 'ArrowUp':
          setPosition({
            ...position,
            y: Math.max(0, position.y - 1),
            direction: 'up',
          })
          e.preventDefault();
          break;
        case 'ArrowLeft':
          setPosition({
            ...position,
            x: Math.max(0, position.x - 1),
            direction: 'left',
          })
          e.preventDefault();
          break;
        case 'ArrowRight':
          setPosition({
            ...position,
            x: Math.min(areaCols, position.x + 1),
            direction: 'right',
          })
          e.preventDefault();
          break;
      }
    }
    document.addEventListener('keydown', watchKey);

    return () => document.removeEventListener('keydown', watchKey);
  }, [areaCols, areaRows, position]);
  return position;
}
