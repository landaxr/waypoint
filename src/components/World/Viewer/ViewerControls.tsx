import { useEffect } from "react";
import FirstPersonNavigationControls from "../Physics/FirstPersonNavigationControls";

const ViewerControls = () => {
  const showPointerLockControls = true;

  useEffect(() => {
    if (!showPointerLockControls) {
      document.exitPointerLock();
    }
  }, [showPointerLockControls]);

  return (
    <>
      {showPointerLockControls && (
        <>
          <FirstPersonNavigationControls />
        </>
      )}
    </>
  );
};

export default ViewerControls;
