import { useState } from 'react';
import { useSpring } from 'react-spring';
import { OrthographicCamera } from 'three';

import { useFrame } from '@react-three/fiber';

interface IProps {
  center: [number, number];
}

// @TODO - when the character gets within a certain bounds of the screen we should scroll the camera
// This means putting its offset in the machine context, calculated when we move transition in the machine.
// The characters game position would be a vector of its screen position + the camera offset.

// Check out https://github.com/mbritton/britton-www/blob/development/src/App.js

const Dolly = ({
  center,
}: IProps) => {
  const [lastCenter, setLastCenter] = useState<[number, number]>(center);
  const [isMoving, setIsMoving] = useState(false);
  const [tmp, setTmp] = useState<[number, number]>(lastCenter);
  const props = useSpring({
    from: { x: lastCenter[0], y: lastCenter[1] },
    to: { x: center[0], y: center[1] },
    // onChange: (props: any) => console.log('frame', props),
    onRest: () => setLastCenter(center)
  });

  // This one makes the camera move to the right
  useFrame(({ clock, camera }) => {
    const c = camera as OrthographicCamera;
    // if (clock.getDelta)
    // console.log('tmp', tmp)
    c.position.setX(tmp[0]);
    c.position.setY(tmp[1]);
    camera.updateProjectionMatrix();

    // if (clock.elapsedTime > 2) {
    //   setIsMoving(true);
    //   console.log('update', clock);
    //   c.position.setX(tmp[0]);
    //   c.position.setY(tmp[1]);
    //   clock.stop();
    //   clock.start();
    //   //   // c.left = c.left + 1;
    //   //   // c.position = [c.position[0] + 1, 0, 32];
    //   //   c.position.setX(center[0]);
    //   //   c.position.setY(center[1]);
    //   camera.updateProjectionMatrix()
    //   //   console.log(c.left);
    //   //   i++
    // }
  });

  return null;
};

export default Dolly;
