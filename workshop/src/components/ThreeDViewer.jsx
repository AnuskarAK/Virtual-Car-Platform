import { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// A simple fallback box model if no real 3D model is provided or while loading
const FallbackModel = ({ color, wheels, spoiler, bodyKit }) => {
    const meshRef = useRef();
    
    // Very basic material that reacts to color
    const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(color).convertSRGBToLinear(),
        roughness: 0.1,
        metalness: 0.8,
    });

    useFrame((state) => {
        // Optional: slight gentle idle rotation if wanted, but orbit controls handles user rotation
    });

    return (
        <group position={[0, 0.5, 0]}>
            {/* Main Body */}
            <mesh castShadow receiveShadow material={material}>
                <boxGeometry args={[1.8, 0.8, 4]} />
            </mesh>
            
            {/* Cabin */}
            <mesh position={[0, 0.6, -0.2]} castShadow receiveShadow>
                <boxGeometry args={[1.4, 0.5, 1.8]} />
                <meshStandardMaterial color="#222" roughness={0} metalness={0.9} />
            </mesh>
            
            {/* Wheels */}
            {[
                [-1, -0.2, 1.2],
                [1, -0.2, 1.2],
                [-1, -0.2, -1.2],
                [1, -0.2, -1.2]
            ].map((pos, i) => (
                <mesh key={i} position={pos} rotation={[0, 0, Math.PI / 2]} castShadow>
                    <cylinderGeometry args={[0.4, 0.4, 0.3, 32]} />
                    <meshStandardMaterial 
                        color={wheels === 'chrome' ? '#eee' : wheels === 'black' ? '#111' : '#333'} 
                        metalness={wheels === 'chrome' ? 1 : 0.4} 
                        roughness={0.2} 
                    />
                </mesh>
            ))}

            {/* Spoiler */}
            {spoiler !== 'none' && (
                <group position={[0, 0.6, -1.8]}>
                    <mesh castShadow>
                        <boxGeometry args={[1.6, 0.05, 0.4]} />
                        <meshStandardMaterial color={spoiler === 'carbon' ? '#222' : color} metalness={0.5} roughness={0.3} />
                    </mesh>
                    <mesh position={[-0.7, -0.15, 0]} castShadow>
                        <boxGeometry args={[0.05, 0.3, 0.2]} />
                        <meshStandardMaterial color="#111" />
                    </mesh>
                    <mesh position={[0.7, -0.15, 0]} castShadow>
                        <boxGeometry args={[0.05, 0.3, 0.2]} />
                        <meshStandardMaterial color="#111" />
                    </mesh>
                </group>
            )}

            {/* Body Kit - Side Skirts */}
            {bodyKit !== 'stock' && (
                <>
                    <mesh position={[-1, -0.3, 0]} castShadow>
                        <boxGeometry args={[0.1, 0.2, 2.5]} />
                        <meshStandardMaterial color={bodyKit === 'carbon' ? '#222' : color} />
                    </mesh>
                    <mesh position={[1, -0.3, 0]} castShadow>
                        <boxGeometry args={[0.1, 0.2, 2.5]} />
                        <meshStandardMaterial color={bodyKit === 'carbon' ? '#222' : color} />
                    </mesh>
                    {/* Front Lip */}
                    <mesh position={[0, -0.3, 2.1]} castShadow>
                        <boxGeometry args={[1.8, 0.1, 0.3]} />
                        <meshStandardMaterial color={bodyKit === 'carbon' ? '#222' : color} />
                    </mesh>
                </>
            )}
        </group>
    );
};

// Actual Model component (if we had real .glb models)
const CarModel = ({ url, color, wheels, spoiler, bodyKit }) => {
    const { scene } = useGLTF(url);
    
    useEffect(() => {
        // Traverse the scene and update materials dynamically if it's a real model
        // This requires knowing the mesh names of the specific GLTF model
        scene.traverse((child) => {
            if (child.isMesh) {
                // Example of applying color to the body
                if (child.name.toLowerCase().includes('body') || child.name.toLowerCase().includes('paint')) {
                    child.material.color = new THREE.Color(color).convertSRGBToLinear();
                    child.material.needsUpdate = true;
                }
            }
        });
    }, [scene, color, wheels, spoiler, bodyKit]);

    return <primitive object={scene} position={[0, 0, 0]} />;
};


const ThreeDViewer = ({ modelUrl, paintColor, wheelType, spoilerType, bodyKitType, onSavedImage }) => {
    
    return (
        <div className="w-full h-full min-h-[400px] relative rounded-xl overflow-hidden cursor-move">
            <Canvas shadows camera={{ position: [5, 2, 5], fov: 45 }} gl={{ preserveDrawingBuffer: true }}>
                <color attach="background" args={['#1a1f2e']} />
                
                {/* Lighting */}
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                <pointLight position={[-10, -10, -10]} intensity={0.5} />
                
                <Suspense fallback={null}>
                    {/* Reflection environment */}
                    <Environment preset="city" />
                    
                    {modelUrl ? (
                         <CarModel 
                            url={modelUrl} 
                            color={paintColor} 
                            wheels={wheelType} 
                            spoiler={spoilerType} 
                            bodyKit={bodyKitType} 
                        />
                    ) : (
                        <FallbackModel 
                            color={paintColor} 
                            wheels={wheelType} 
                            spoiler={spoilerType} 
                            bodyKit={bodyKitType} 
                        />
                    )}
                    
                    {/* Fake soft shadow under the car */}
                    <ContactShadows resolution={1024} scale={10} blur={2} opacity={0.5} far={10} color="#000000" />
                </Suspense>

                <OrbitControls 
                    enablePan={false} 
                    minPolarAngle={0} 
                    maxPolarAngle={Math.PI / 2 - 0.05} // Don't let camera go below ground
                    minDistance={3}
                    maxDistance={10}
                    autoRotate={true}
                    autoRotateSpeed={0.5}
                />
            </Canvas>
        </div>
    );
};

export default ThreeDViewer;
