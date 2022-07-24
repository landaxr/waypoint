import React, {useState, useEffect} from 'react';
import ReactFlow, {MiniMap, Controls, Background} from 'react-flow-renderer';
import { useExtendedWorlds, ExtendedSpacesQueryData, ExtendedWorldData } from '../../api/theGraph/worldsQueries';

const Map = () => {

  type NodeArray = {
    id: string;
    type: string;
    data: object;
    position: object;
    draggable: boolean;
  }

  const worldsResponse = useExtendedWorlds();

  const [nodes, setNodes] = useState<NodeArray[] | []>([]);
  const [edges, setEdges] = useState([]);

  useEffect(()=> {
    // console.log('worlds response');
    console.log('worlds response', JSON.stringify(worldsResponse))
    
    if (worldsResponse && worldsResponse.loading == false) {
      console.log('fire')
      // compose chart
      if (worldsResponse.data && worldsResponse?.data?.spaces && worldsResponse.data.spaces.length > 0) {
        let tempNodes: Array<NodeArray>;
        let tempEdges = [];
        worldsResponse.data.spaces.map(space => {
          let thisX = 100
          let thisY = 100
          tempNodes.push({
            id: space.id, 
            type: 'input', 
            data: {label: `Space at TokenId ${space.id}`}, 
            position: {x:thisX,y:thisY},
            draggable: true
          })
        });
        setNodes(tempNodes);
        console.log('nodes check ', nodes)
      }
    }
  },[worldsResponse])

  

    const initialNodes = [
        {
          id: '1',
          type: 'input',
          data: { label: 'Space 1' },
          position: { x: 250, y: 25 },
        },
      
        {
          id: '2',
          // you can also pass a React component as a label
          data: { label: <div>Space 2</div> },
          position: { x: 100, y: 125 },
        },
        {
          id: '3',
          type: 'output',
          data: { label: 'Space 3' },
          position: { x: 250, y: 250 },
        },
      ];
      
      const initialEdges = [
        { id: 'e1-2', source: '1', target: '2', label: 'Portal #1.0' },
        { id: 'e2-3', source: '2', target: '3', animated: true, label: 'Portal# 2.0' },
      ];
      
    return (
    
    <div style={{border: '5px red solid', height: '80vh'}}>
    <ReactFlow nodes={nodes} edges={edges} fitView >
      <MiniMap/>
      <Controls/>
      <Background/>
    </ReactFlow>
    </div>
    )

}
export default Map;