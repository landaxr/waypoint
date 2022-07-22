import { createContext, useCallback, useEffect, useState } from "react";
import { AudioListener } from "three";

const useClickedAndAudioListener = () => {
  const [hasClicked, setHasClicked] = useState(false);

  const [listener, setListener] = useState<AudioListener>();

  const onClicked = useCallback(() => {
    if (hasClicked) return;
    document.body.removeEventListener("click", onClicked);
    setHasClicked(true);

    setListener(new AudioListener());
  }, [hasClicked]);

  useEffect(() => {
    document.body.addEventListener("click", onClicked);

    return () => {
      document.body.removeEventListener("click", onClicked);
    };
  }, [onClicked]);

  return {
    hasClicked,
    listener,
  };
};

export type ClickedAndAudioContextType = ReturnType<
  typeof useClickedAndAudioListener
>;

export const ClickedAndAudioContext = createContext<ClickedAndAudioContextType>(
  {
    hasClicked: false,
    listener: undefined,
  }
);

export default useClickedAndAudioListener;
