import { VideoConfig } from "../../../types/elements";
import { useHttpsUrl } from "../../../api/ipfsUrls";
import { SceneFilesLocal } from "../../../types/shared";
import { useLoader } from "@react-three/fiber";
import { Texture, TextureLoader, VideoTexture } from "three";
import { SyntheticEvent, useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";

const VideoHtmlElement = ({
  url,
  play,
  handleDimensionsDetermined,
  setVideoElement,
}: {
  url: string;
  play?: boolean;
  handleDimensionsDetermined: (params: [number, number]) => void;
  setVideoElement: (videoElement: HTMLVideoElement | null) => void;
}) => {
  const onLoaded = useCallback(
    (e: SyntheticEvent<HTMLVideoElement>) => {
      const { videoHeight, videoWidth } = e.target as HTMLVideoElement;

      handleDimensionsDetermined([videoWidth, videoHeight]);
    },
    [handleDimensionsDetermined]
  );

  return (
    <>
      {createPortal(
        <video
          style={{ display: "none" }}
          crossOrigin="anonymous"
          autoPlay={play}
          controls
          playsInline
          loop
          // fires when first frame of video has been loaded
          onLoadedData={onLoaded}
          preload={"auto"}
          // preload="metadata"
          muted
          src={url}
          ref={setVideoElement}
        ></video>,
        document.body
      )}
    </>
  );
};

const Video = ({
  config,
  fileUrl,
}: {
  config: VideoConfig;
  fileUrl: string;
}) => {
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>();

  const [texture, setTexture] = useState<Texture>();

  const [dimensions, setDimensions] = useState<[number, number]>(() => [1, 1]);

  const [play, setPlay] = useState(false);

  useEffect(() => {
    if (videoElement) {
      const texture = new VideoTexture(videoElement);
      setTexture(texture);
    }
  }, [videoElement]);

  useEffect(() => {
    setTimeout(() => {
      setPlay(true);
    }, 100);
  }, []);

  if (!texture) return null;

  return (
    <>
      <VideoHtmlElement
        url={fileUrl}
        handleDimensionsDetermined={setDimensions}
        setVideoElement={setVideoElement}
        play={play}
      />
      {texture && (
        <mesh>
          <planeBufferGeometry args={dimensions} />
          <meshBasicMaterial map={texture} />
        </mesh>
      )}
    </>
  );
};

const VideoNullGuard = ({
  config,
  files,
}: {
  config: VideoConfig;
  files: SceneFilesLocal;
}) => {
  const fileUrl = useHttpsUrl(config.file?.original, files);

  if (!fileUrl) return null;

  return <Video config={config} fileUrl={fileUrl} />;
};

export default VideoNullGuard;
