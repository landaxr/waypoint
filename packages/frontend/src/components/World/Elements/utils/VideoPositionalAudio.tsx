import * as React from "react";
import { PositionalAudio as PositionalAudioImpl } from "three";
import useClickedAndAudioListener from "../../useClickedAndAudioListener";
import mergeRefs from "react-merge-refs";

type Props = JSX.IntrinsicElements["positionalAudio"] & {
  video: HTMLVideoElement;
  distance?: number;
  loop?: boolean;
  refDistance?: number;
  rollOffFactor?: number;
};

const VideoPositionalAudio = React.forwardRef(
  (
    {
      video,
      distance = 1,
      refDistance,
      rollOffFactor,
      loop = true,
      autoplay,
      ...props
    }: Props,
    ref
  ) => {
    const { listener } = useClickedAndAudioListener();
    const sound = React.useRef<PositionalAudioImpl>();

    React.useEffect(() => {
      console.log("audio,", { listener: !!listener });
      if (!listener) return;

      sound.current = new PositionalAudioImpl(listener);

      const _sound = sound.current;
      if (!_sound) return;
      _sound.setMediaElementSource(video);

      _sound.setRefDistance(distance);
      _sound.setLoop(loop);
    }, [distance, listener, loop, video]);

    React.useEffect(() => {
      if (refDistance) {
        sound.current?.setRefDistance(refDistance);
      }
    }, [refDistance]);

    React.useEffect(() => {
      if (rollOffFactor) {
        sound.current?.setRolloffFactor(rollOffFactor);
      }
    }, [rollOffFactor]);

    if (!listener) return null;

    return (
      <positionalAudio
        ref={mergeRefs([sound, ref])}
        args={[listener]}
        {...props}
      />
    );
  }
);

export default VideoPositionalAudio;
