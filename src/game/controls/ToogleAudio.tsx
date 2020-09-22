import React, { useEffect } from 'react';
import useSound from 'use-sound';

import soundTrack from '../../media/soundtrack/Celestial.mp3';

export const ToggleAudio = () => {
  const [play, { stop, isPlaying }] = useSound(soundTrack);
  useEffect(() => {
    play();
  }, [play])
  return <button
    onClick={() => {
      isPlaying ? stop() : play();
    }}
  >
    play
  </button>
}
