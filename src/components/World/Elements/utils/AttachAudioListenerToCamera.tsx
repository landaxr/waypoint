import { useThree } from "@react-three/fiber";
import { useContext, useEffect } from "react";
import { ClickedAndAudioContext } from "../../useClickedAndAudioListener";

const AttachAudioListenerToCamera = () => {
  const { camera } = useThree();

  const { listener } = useContext(ClickedAndAudioContext);

  useEffect(() => {
    if (camera && listener) {
      camera.add(listener);
    }
  }, [camera, listener]);

  return null;
};

export default AttachAudioListenerToCamera;
