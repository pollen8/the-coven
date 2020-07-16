import React, { FC } from 'react';
import styled from 'styled-components';

import {
  Direction,
  IPosition,
} from './usePosition';

interface IProps {
  position: IPosition;
}

const Sprite = styled.div<{ direction: Direction }>`
  width: 1.5rem;
  height: 1.5rem;
  position: absolute;
  top: 0;
  left: 0;
  background-image: url('/chars/gabe/gabe-idle-run.png');
`;
const Character: FC<IProps> = ({ position }) => {
  return <div><Sprite
    direction={position.direction}
  /></div>
}

export default Character;
