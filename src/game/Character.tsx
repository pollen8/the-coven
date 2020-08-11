import React, {
  FC,
  HTMLAttributes,
  useEffect,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components';

import {
  Direction,
  IPosition,
} from './usePosition';

interface IProps {
  send: (action: any) => void;
  position: IPosition;
}


function useInterval(callback: any, delay: number) {
  const savedCallback = useRef<any>();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback && savedCallback.current && savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

const Sprite = styled.div<{ direction: Direction, step: number }>`
  width: 16px;
  height:  16px;
  position: absolute;
  top: 0;
  left: 0;
  background-image: url('/chars/gabe/gabe-idle-run.png');
  background-size: auto 16px;
  background-position: ${(props) => -props.step * 16}px, 0;
  background-repeat: no-repeat;
  transform: ${(props) => props.direction === 'left' ? 'scaleX(-1)' : 'scaleX(1)'};
`;

const Character: FC<IProps & HTMLAttributes<any>> = ({
  send,
  position,
  style,
}) => {

  const [moving, setMoving] = useState(false);
  const [step, setStep] = useState(0);

  useInterval(() => {
    setStep(moving ? step + 1 : 0);
  }, 100);
  useEffect(() => {
    const watchKeyDown = () => setMoving(true);
    const watchKeyUp = (e: KeyboardEvent) => {
      setMoving(false);
    };

    document.addEventListener('keydown', watchKeyDown);
    document.addEventListener('keyup', watchKeyUp);

    return () => {
      document.removeEventListener('keydown', watchKeyDown);
      document.removeEventListener('keyup', watchKeyUp);
    }
  }, [send]);

  return (
    <div style={{ ...style, position: 'absolute' }}>
      <Sprite
        direction={position.direction}
        step={step % 6}
      />
    </div>
  );
}

export default Character;
