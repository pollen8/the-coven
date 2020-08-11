import React, {
  FC,
  HTMLAttributes,
} from 'react';
import { useDrop } from 'react-dnd';

import { tileSize } from './GameUI';

export interface ITile {
  baseImg: string;
  propImg?: string;
  ref?: any;
  position?: { x: number, y: number };
  onDrop?: (params: { position: { x: number, y: number }, item: any }) => void;
}

export const Tile: FC<ITile & HTMLAttributes<any>> = ({
  baseImg,
  propImg,
  children,
  style,
  position,
  onDrop,
}) => {

  const [{ isOver }, drop] = useDrop({
    accept: ['PROP', 'TILE'],
    drop: (item) => {
      onDrop && position && onDrop({ position, item });
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  })

  return <div ref={drop}
    style={{
      ...style,
      border: `1px solid ${isOver ? 'red' : 'white'}`,
      background: `url(${baseImg}) repeat scroll 0% 0% / cover`,
      fontSize: "0.6rem"
    }}>
    {
      propImg &&
      <img src={propImg} alt="here" style={{ width: `${tileSize}px`, height: `${tileSize}` }} />
    }
    {children}</div>
}
