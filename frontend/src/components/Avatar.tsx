import { Avatar as ReadyPlayerMeAvatar } from "@readyplayerme/visage";
import { useEffect, useState } from "react";
import { useAppSelector } from "../state/hooks";

type AvatarProps = {
  cameraInitialDistance?: number;
  cameraTarget?: number;
  height?: string;
  width?: string;
};

const Avatar = ({
  cameraInitialDistance,
  cameraTarget,
  height,
  width,
}: AvatarProps) => {
  const modelSrc = "https://models.readyplayer.me/6529c84847d203826af5808d.glb";
  const [animationSrc, setAnimationSrc] = useState<string>("./basic-wave.fbx");

  const { micActive } = useAppSelector((state) => state.actionButtons);

  useEffect(() => {
    if (micActive) {
      setAnimationSrc("./avatar-pose-listen.glb");
    } else {
      setAnimationSrc("./basic-wave.fbx");
    }
  }, [micActive]);

  return (
    <ReadyPlayerMeAvatar
      animationSrc={animationSrc}
      backLightColor="#FFB878"
      backLightIntensity={2.2}
      bloom={{
        intensity: 1,
        kernelSize: 1,
        luminanceSmoothing: 1,
        luminanceThreshold: 1,
        materialIntensity: 1,
        mipmapBlur: true,
      }}
      cameraInitialDistance={cameraInitialDistance || 3.2}
      cameraTarget={cameraTarget || 1.55}
      dpr={2}
      effects={{
        ambientOcclusion: false,
        bloom: {
          intensity: 1,
          kernelSize: 1,
          luminanceSmoothing: 1,
          luminanceThreshold: 1,
          materialIntensity: 1,
          mipmapBlur: true,
        },
      }}
      emotion={{
        cheekSquintLeft: 0.3,
        eyeLookInRight: 0.6,
        eyeLookOutLeft: 0.6,
        jawOpen: 0.1,
        mouthDimpleLeft: 0.3,
        mouthPressLeft: 0.1,
        mouthSmileLeft: 0.2,
        mouthSmileRight: 0.1,
      }}
      environment="soft"
      fillLightColor="#6794FF"
      fillLightIntensity={2.8}
      keyLightColor="#FFFFFF"
      keyLightIntensity={1.2}
      modelSrc={modelSrc}
      scale={1}
      style={{ width: width, height: height }}
    />
  );
};

export default Avatar;
