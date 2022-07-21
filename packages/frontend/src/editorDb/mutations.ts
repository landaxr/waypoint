import { EnvironmentConfig, SceneConfiguration } from "../types/scene";
import { Element } from "../types/elements";
import { Optional, FileLocationLocal, SceneFilesLocal } from "../types/shared";
import { merge } from "lodash";
import { newId } from "./utils";

export type SceneUpdateFn = (scene: SceneConfiguration) => SceneConfiguration;

export type CreateNewElmentUpdate = {};

export const applyUpdates = (
  scene: SceneConfiguration,
  updates: SceneUpdateFn[]
): SceneConfiguration => {
  return updates.reduce((current, update): SceneConfiguration => {
    return update(current);
  }, scene);
};

export const updateEnvironment =
  ({
    environment,
  }: {
    environment: Optional<EnvironmentConfig>;
  }): SceneUpdateFn =>
  (scene: SceneConfiguration) => {
    return {
      ...scene,
      environment,
    };
  };

export const addElement =
  ({
    id,
    elementConfig,
  }: {
    id: string;
    elementConfig: Element;
  }): SceneUpdateFn =>
  (scene: SceneConfiguration) => {
    return {
      ...scene,
      elements: {
        ...(scene.elements || {}),
        [id]: elementConfig,
      },
    };
  };

export const createNewElement =
  ({ elementConfig }: { elementConfig: Element }): SceneUpdateFn =>
  (scene: SceneConfiguration) => {
    const id = newId();
    return {
      ...scene,
      elements: {
        ...(scene.elements || {}),
        [id]: elementConfig,
      },
    };
  };

export const updateElement =
  ({
    id,
    elementConfig,
  }: {
    id: string;
    elementConfig: Partial<Element>;
  }): SceneUpdateFn =>
  (scene: SceneConfiguration) => {
    if (!scene.elements) throw new Error("missing elements");

    const toUpdate = scene.elements[id];

    if (!toUpdate) throw new Error("no element exists with id");

    const updatedElement = merge({}, toUpdate, elementConfig) as Element;

    return {
      ...scene,
      elements: {
        ...scene.elements,
        [id]: updatedElement,
      },
    };
  };

export const deleteElement =
  ({ id }: { id: string }): SceneUpdateFn =>
  (scene: SceneConfiguration) => {
    const elements = {
      ...(scene.elements || {}),
    };

    delete elements[id];

    return {
      ...scene,
      elements,
    };
  };

export const addFile =
  ({ file, id }: { file: FileLocationLocal; id: string }) =>
  (files: SceneFilesLocal) => {
    return {
      ...files,
      [id]: file,
    };
  };
