import { VideoConfig } from "../../../types/elements";
import { useHttpsUrl } from "../../../api/ipfsUrls";
import { SceneFilesLocal } from "../../../types/shared";
import { Texture, VideoTexture } from "three";
import {
  SyntheticEvent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import HtmlWrapper from "./utils/HtmlWrapper";
import { ClickedAndAudioContext } from "../useClickedAndAudioListener";
import VideoPositionalAudio from "./utils/VideoPositionalAudio";

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
      console.log("video loaded");
      const { videoHeight, videoWidth } = e.target as HTMLVideoElement;

      handleDimensionsDetermined([videoWidth / videoHeight, 1]);
    },
    [handleDimensionsDetermined]
  );

  console.log("added wrapper");

  return (
    <HtmlWrapper>
      <video
        style={{ position: "absolute", zIndex: 100 }}
        crossOrigin="anonymous"
        autoPlay={play}
        controls
        playsInline
        loop
        // fires when first frame of video has been loaded
        onLoadedData={onLoaded}
        onLoadedMetadata={onLoaded}
        preload="auto"
        // preload="metadata"
        ref={setVideoElement}
      >
        <source src={url} type="video/mp4" />
      </video>
    </HtmlWrapper>
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

  const { hasClicked: play } = useContext(ClickedAndAudioContext);

  useEffect(() => {
    if (videoElement && play) {
      videoElement.play();

      return () => {
        videoElement.pause();
      };
    }
  }, [videoElement, play]);

  useEffect(() => {
    if (videoElement) {
      const texture = new VideoTexture(videoElement);
      setTexture(texture);
    }
  }, [videoElement]);

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
      {videoElement && (
        <VideoPositionalAudio
          video={videoElement}
          refDistance={4}
          rollOffFactor={1}
        />
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
