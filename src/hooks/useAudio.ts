import { useState } from 'react';

const useAudio = (src: string) => {
    const [audio] = useState(new Audio(src));

    const play = () => audio.play();

    const pause = () => audio.pause();

    return { play, pause };
};

export default useAudio;