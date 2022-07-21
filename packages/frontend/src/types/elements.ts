import { FileReference, Optional } from "./shared";

export enum ElementType {
  Model = "model",
  Image = "image",
  Video = "video",
  Water = "water",
}

export type IVector3 = {
  x?: number;
  y?: number;
  z?: number;
};

export type Transform = {
  position?: IVector3;
  rotation?: IVector3;
  scale?: IVector3;
};

export type BaseElement = {
  transform?: Optional<Transform>;
  elementType: ElementType;
  children?: Optional<ElementNodes>;
};

export type ModelElement = BaseElement & {
  elementType: ElementType.Model;
  modelConfig: ModelConfig;
};

export type ImageElement = BaseElement & {
  elementType: ElementType.Image;
  imageConfig: ImageConfig;
};

export type VideoElement = BaseElement & {
  elementType: ElementType.Video;
  videoConfig: VideoConfig;
};

export type Element = ModelElement | ImageElement | VideoElement;

export type ElementNodes = {
  [id: string]: Element;
};

export type ModelConfig = {
  file?: FileReference;
};

export type ImageConfig = {
  file?: FileReference;
};

export type VideoConfig = {
  file?: {
    original?: FileReference;
    streamUrl?: string;
  };
  volume?: number;
};
