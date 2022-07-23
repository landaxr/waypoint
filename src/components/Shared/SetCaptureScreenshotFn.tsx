import { useThree } from "@react-three/fiber";
import { useCallback, useEffect } from "react";

const useCaptureScreenshot = () => {
  const { gl, camera, scene } = useThree();

  const captureScreenshot = useCallback(() => {
    if (!camera || !gl || !scene)
      throw new Error("missing camera, gl or scene");

    gl.render(scene, camera);

    const screenshot = gl.domElement.toDataURL("image/jpeg");

    return screenshot;
  }, [camera, gl, scene]);

  return captureScreenshot;
};

// useThree must be called within a Canvas seen - this component allows
// us to pass this function back up to a parent so it can be called
// from the root
const SetCaptureScreenshotFn = ({
  setCaptureScreenShotFn,
}: {
  setCaptureScreenShotFn: (arg: { fn: () => string }) => void;
}) => {
  const captureScreenshot = useCaptureScreenshot();

  useEffect(() => {
    console.log("set capture sreenshot");
    setCaptureScreenShotFn({ fn: captureScreenshot });
  }, [setCaptureScreenShotFn, captureScreenshot]);

  return null;
};

export default SetCaptureScreenshotFn;
