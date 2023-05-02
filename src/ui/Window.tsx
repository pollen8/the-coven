import {
  PropsWithChildren,
  useState,
} from 'react';
import {
  animated,
  useSpring,
} from 'react-spring';
import { useGesture } from 'react-use-gesture';
import styled from 'styled-components';

interface IFrame {
  zIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}
const Frame = styled(animated.div)`
  width: 200px;
  height: 200px;
  border: 1px solid red;
  background: #ffee33;
`;

export const Window = ({
  children,
  isOpen,
  onClose,
}: PropsWithChildren<IFrame>) => {
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
  const [pos, set] = useSpring(() => (lastPos));
  const bind = useGesture({
    onDrag: ({ offset: [x, y] }) => set({ x, y }),
    onPointerDown: ({ event, ...sharedState }) => console.log('pointer down', event, sharedState),
    onPointerUp: ({ event }) => {
      setLastPos({
        x: (event as any).x,
        y: (event as any).y,
      });
    }
  });
  if (!isOpen) {
    return null;
  }
  return (
    <Frame
      {...bind()}
      style={{ x: pos.x, y: pos.y }}
    >
      {children}
      <footer style={{ textAlign: 'center' }}>
        <button
          onClick={() => onClose()}
        >Close</button>
      </footer>
    </Frame>
  );
};
