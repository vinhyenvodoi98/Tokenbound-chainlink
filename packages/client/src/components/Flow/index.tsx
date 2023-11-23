import { useCallback, useState } from 'react';
import ReactFlow, {
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
} from 'reactflow';
import Account from './Account';
import TextUpdaterNft from './TextUpdaterNft';

const initialNodes = [
  {
    id: '1',
    data: { label: 'taio-newgate.eth' },
    position: { x: 0, y: 0 },
    type: 'input',
  },
  { id: '2', type: 'textUpdaterNft', position: { x: 300, y: 0 }, data: {
    contract:"0x060...66d",
    image:"/png/nft4.png",
    alt:"cryptokitties",
    tokenId: "#1834400"
  } },
  { id: '3', type: 'textUpdaterNft', position: { x: 300, y: 250 } ,data: {
    contract:"0xbc4...13d",
    image:"/png/nft3.png",
    alt:"Bored Ape Yacht Club",
    tokenId: "#3033"
  } },
  {
    id: '4',
    type: 'account',
    data: { label: 'Account A', address: "0x71C...e5E" },
    position: { x: 600, y: 0 },
  },
  {
    id: '5',
    type: 'account',
    data: { label: 'Account B', address: "0x1Ca...2R6" },
    position: { x: 600, y: 200 },
  },
  {
    id: '6',
    type: 'account',
    data: { label: 'Account C', address: "0x9cC...158" },
    position: { x: 600, y: 400 },
  },
];

const initialEdges = [
  { id: '1-2', source: '1', targetHandle:'a', target: '2', animated: true },
  { id: '1-3', source: '1', targetHandle:'a', target: '3', animated: true },
  { id: '2-4', source: '2', sourceHandle:'b', targetHandle:'a', target: '4', animated: true },
  { id: '3-5', source: '3', sourceHandle:'b', targetHandle:'a', target: '5', animated: true },
  { id: '3-6', source: '3', sourceHandle:'b', targetHandle:'a', target: '6', animated: true },
];

const nodeTypes = {
  textUpdaterNft: TextUpdaterNft,
  account: Account
};

export default function Flow() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onNodesChange = useCallback(
    (changes : any) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes : any) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );

  return(
    <ReactFlow
        nodes={nodes}
        onNodesChange={onNodesChange}
        edges={edges}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
    >
        <Background />
    </ReactFlow>
  )
}