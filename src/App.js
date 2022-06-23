import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree, extend } from "@react-three/fiber";
import { useSpring, a } from "@react-spring/three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

function App() {
  return (
    <>
      {/* <h1>Hello, Shahid' Space</h1> */}
      <Canvas camera={{ position: [0, 0, 5]}} onCreated={({ gl }) => {
        gl.shadowMap.enabled = true
        gl.shadowMap.type = THREE.PCFShadowMap
      }}>
        <fog  attach="fog" args={["black", 10, 35]} />
        <Controls />
        {/* <Box /> */}
        {/* <Plane /> */}
        <ambientLight intensity={0.5} />
        <spotLight position={[15, 20, 5]} penumbra={1} castShadow />
        <SpaceShip />
      </Canvas>
    </>
  );
}

export default App;



const Box = () => {
  // const meshRef = useRef()
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(false);
  const props = useSpring({
    scale: active ? [1.5, 1.5, 1.5]: [1, 1, 1],
    color: hovered ? "gray" : "hotpink"
  })

  // useFrame(() => {
  //   meshRef.current.rotation.y += 0.01
  // })

  return (
    <a.mesh 
      // ref={meshRef}
      onPointerOver={() => setHovered(true)} 
      onPointerOut={() => setHovered(false)}
      onClick={() => setActive(!active)}
      scale={props.scale}
      castShadow
    >
      <ambientLight />
      <spotLight position={[0, 5, 10]} penumbra={1} castShadow />
      <boxBufferGeometry attach="geometry" args={[1, 1, 1]}/>
      {/* <a.meshBasicMaterial attach="material" color={props.color} /> */}
      <a.meshPhysicalMaterial attach="material" color={props.color} />
    </a.mesh>
  )
}

extend({OrbitControls});

const Controls = () => {
  const orbitRef = useRef();
  const {camera, gl} = useThree();

  useFrame(() => {
    orbitRef.current.update();
  })
  return(
    <orbitControls 
      autoRotate
      ref={orbitRef}
      args={[camera, gl.domElement]}
      maxPolarAngle={Math.PI / 2}
      minPolarAngle={Math.PI / 3}
    />
  )
}

const Plane = () => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
    <planeBufferGeometry attach="geometry" args={[100, 100]}/>
    <meshPhysicalMaterial attach="material" color="white" />
  </mesh>
)

const SpaceShip = () => {
  const [model, setModel] = useState();

  useEffect(() => {
    new GLTFLoader().load("/scene.gltf", setModel)
  })

  return model ? <primitive object={model.scene} /> : null
  
}