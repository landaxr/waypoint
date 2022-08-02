import { MeshCollider, RigidBody } from "@react-three/rapier";
import { Fragment } from "react";
import { Mesh, Object3D } from "three";
import { GLTF } from "three-stdlib";

function filterNonMeshes(children: Object3D[]): Mesh[] {
  return children.filter(
    (x) =>
      // @ts-ignore
      x.isMesh
  ) as Mesh[];
}

const LeafNodeColliders = ({ element }: { element: Mesh }) => {
  // if bottom element, render it
  if (element.children.length === 0)
    return (
      <MeshCollider type="trimesh">
        <mesh
          position={element.position}
          rotation={element.rotation}
          scale={element.scale}
          geometry={element.geometry}
          material={element.material}
        />
      </MeshCollider>
    );

  return (
    <group
      position={element.position}
      rotation={element.rotation}
      scale={element.scale}
    >
      {filterNonMeshes(element.children).map((mesh, i) => (
        <>{<LeafNodeColliders element={mesh} key={i} />}</>
      ))}
    </group>
  );
};

const CollisionMeshes = ({ elements }: { elements: Mesh[] }) => {
  return (
    <>
      {elements.map((element, i) => (
        <Fragment key={i}>
          <LeafNodeColliders element={element} />
        </Fragment>
      ))}
    </>
  );
};

const PHYSICS_USER_DATA_KEY_GROUND = "ground";
const PHYSICS_USER_DATA_KEY_COLLIDABLE = "collidable";

const elementIsCollidableIfHasUserData = (element: Object3D) => {
  if (
    !!element.userData[PHYSICS_USER_DATA_KEY_COLLIDABLE] ||
    !!element.userData[PHYSICS_USER_DATA_KEY_GROUND]
  )
    return true;

  return false;
};

const collisionElements = ({
  elements,
  elementIsCollidable = elementIsCollidableIfHasUserData,
}: {
  elements: Object3D[];
  elementIsCollidable?: (element: Object3D) => boolean;
}) => {
  return filterNonMeshes(elements).filter(elementIsCollidable);
};

const ModelColliders = ({ model }: { model: GLTF }) => {
  const { scene } = model;

  return (
    <group
      visible={false}
      rotation={scene.rotation}
      position={scene.position}
      scale={scene.scale}
    >
      <RigidBody colliders={false} type="fixed">
        <CollisionMeshes
          elements={collisionElements({ elements: scene.children })}
        />
      </RigidBody>
    </group>
  );
};

export default ModelColliders;
