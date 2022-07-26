import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { Camera } from "three";

/**
 * Allows a camera to be gotten from outside of the scene.
 * @param param0 A
 */
const GetCamera = ({ setCamera }: { setCamera: (camera: Camera) => void }) => {
  const { camera } = useThree();

  useEffect(() => {
    setCamera(camera);
  }, [camera, setCamera]);
};

export default GetCamera;
