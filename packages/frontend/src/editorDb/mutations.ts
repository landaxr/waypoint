import { EnvironmentConfig, SceneConfiguration } from "../types/scene";
import { Element } from "../types/elements";
import { Optional } from "../types/shared";
import { merge } from "lodash";

export type SceneUpdateFn = (scene: SceneConfiguration) => SceneConfiguration;

export const applyUpdates = (
  scene: SceneConfiguration,
  updates: SceneUpdateFn[]
): SceneConfiguration => {
  return updates.reduce((current, update): SceneConfiguration => {
    return update(current);
  }, scene);
};

export const updateEnvironment =
  (environment: Optional<EnvironmentConfig>): SceneUpdateFn =>
  (scene: SceneConfiguration) => {
    return {
      ...scene,
      environment,
    };
  };

export const addElement =
  (id: string, elementConfig: Element): SceneUpdateFn =>
  (scene: SceneConfiguration) => {
    return {
      ...scene,
      elements: {
        ...(scene.elements || {}),
        [id]: elementConfig,
      },
    };
  };

export const updateElement =
  (id: string, elementConfig: Partial<Element>): SceneUpdateFn =>
  (scene: SceneConfiguration) => {
    if (!scene.elements) throw new Error("missing elements");

    const toUpdate = scene.elements[id];

    if (!toUpdate) throw new Error("no element exists with id");

    const updated = merge({}, toUpdate, elementConfig) as Element;

    return {
      ...scene,
      elements: {
        ...scene.elements,
        [id]: updated,
      },
    };
  };

export const deleteElement =
  (id: string): SceneUpdateFn =>
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
