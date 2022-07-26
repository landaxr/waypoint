import React, { useState, useEffect, useCallback } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useReactFlow,
  useStore,
  ReactFlowProvider,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from "react-flow-renderer";
import {
  useExtendedWorlds,
  ExtendedSpacesQueryData,
  ExtendedWorldData,
} from "../../api/theGraph/worldsQueries";

const Map = () => {
  // type NodeArray = {
  //   id: string;
  //   type: string;
  //   data: object;
  //   position: object;
  //   draggable: boolean;
  // }
  // const store = useStore()
  // const reactFlowInstance = useReactFlow();

  const data = useExtendedWorlds();

  const [nodes, setNodesState] = useState([]);
  const [edges, setEdgesState] = useState([]);
  const [scene, setScene] = useState([]);

  useEffect(() => {
    console.log("data inbound: ", data);
  }, [data]);

  useEffect(() => {
    // console.log('worlds response');
    if (data) {
      console.log("fire");
      // compose chart
      let tempNodes = [];
      let tempEdges = [];
      let tempScene = [];
      let thisX = 0;
      let thisY = 0;
      if (data.spaces && data.spaces.length > 0) {
        console.log("check fire");
        data.spaces.map((space) => {
          if (thisX == 600) {
            thisX = 0;
            thisY = thisY + 150;
          }
          tempNodes.push({
            id: space.id.toString(),
            // type: 'input',
            data: { label: `Space at TokenId ${space.id}` },
            position: { x: thisX, y: thisY },
            // draggable: true
          });

          thisX = thisX + 200;
          if (space.portals.length > 0) {
            space.portals.map((portal) => {
              tempEdges.push({
                id: portal.id,
                type: "bezier",
                source: space.id.toString(),
                target: portal.targetId.toString(),
                animated: true,
                label: `Portal: ${space.id.toString()} ➡️ ${portal.targetId.toString()}`,
                markerEnd: { type: "arrow" },
              });
              //
            });
            console.log("edges", tempEdges);
          }
          // console.log('this space ',space)
        });
        // eslint-disable-next-line no-use-before-define
      }
      setNodesState(tempNodes);
      console.log("nodes check ", tempNodes);
      setEdgesState(tempEdges);
      setScene(tempScene);
    }
  }, [data]);

  const [newedges, setnewedges] = useState([]);
  const handleClick = () => {
    setnewedges(edges);
  };

  const initialEdges = [
    { id: "e1-2", source: "1", target: "2", label: "Portal #1.0" },
    {
      id: "e2-3",
      source: "2",
      target: "3",
      animated: true,
      label: "Portal# 2.0",
    },
  ];
  const onNodesChange = useCallback(
    (changes) => setNodesState((ns) => applyNodeChanges(changes, ns)),
    []
  );
  const onEdgesChange = useCallback(
    (changes) => setEdgesState((es) => applyEdgeChanges(changes, es)),
    []
  );
  const onConnect = useCallback((connection) =>
    setEdgesState((eds) => addEdge(connection, eds))
  );

  return (
    <div style={{ border: "5px red solid", height: "80vh" }}>
      {/* <button onClick={()=>handleClick()}>Click</button> */}
      {/* <ReactFlowProvider> */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
      {/* </ReactFlowProvider> */}
    </div>
  );
};
export default Map;
