import {
  NearestFilter,
  Texture,
} from 'three';
import { isArray } from 'xstate/lib/utils';

import { useTexture } from '@react-three/drei';

export const usePixelTexture = <T extends string[] | string>(
  spriteImage: T,
): T extends any[] ? Texture[] : Texture => {
  const a: string[] = !isArray(spriteImage) ? [spriteImage] : spriteImage;
  const textures = useTexture(a).map((t) => {
    t.minFilter = NearestFilter;
    t.magFilter = NearestFilter;
    t.needsUpdate = true;
    return t;
  });

  return textures.length === 1
    ? textures[0] as any
    : textures as any;
};
