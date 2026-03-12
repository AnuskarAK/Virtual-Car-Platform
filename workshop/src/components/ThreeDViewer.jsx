import { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, useGLTF } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, N8AO } from '@react-three/postprocessing';
import * as THREE from 'three';

// A simple fallback box model if no real 3D model is provided or while loading
export const FallbackModel = ({ color, wheels, spoiler, bodyKit }) => {
    // Premium Car Paint Material
    const bodyMaterial = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(color).convertSRGBToLinear(),
        metalness: 0.6,
        roughness: 0.4,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
    });

    // Realistic Glass Material
    const glassMaterial = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#ffffff'),
        metalness: 0.1,
        roughness: 0.05,
        transmission: 0.9, // glass-like
        ior: 1.5,
        thickness: 0.5,
        transparent: true,
    });

    // Rims Material
    const rimMaterial = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(wheels === 'chrome' ? '#f0f0f0' : wheels === 'black' ? '#111111' : '#333333'),
        metalness: wheels === 'chrome' ? 1.0 : 0.6,
        roughness: wheels === 'chrome' ? 0.05 : 0.3,
        clearcoat: wheels === 'chrome' ? 1.0 : 0.0,
    });

    // Tires Material
    const tireMaterial = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#111111'),
        metalness: 0.1,
        roughness: 0.9,
    });

    return (
        <group position={[0, 0.4, 0]}>
            {/* Main Body */}
            <mesh castShadow receiveShadow material={bodyMaterial} position={[0, 0.2, 0]}>
                <boxGeometry args={[1.8, 0.6, 4]} />
            </mesh>
            
            {/* Cabin / Windows */}
            <mesh position={[0, 0.65, -0.2]} castShadow receiveShadow material={glassMaterial}>
                <boxGeometry args={[1.4, 0.5, 1.8]} />
            </mesh>
            
            {/* Wheels */}
            {[
                [-1, -0.1, 1.2],
                [1, -0.1, 1.2],
                [-1, -0.1, -1.2],
                [1, -0.1, -1.2]
            ].map((pos, i) => (
                <group key={i} position={pos} rotation={[0, 0, Math.PI / 2]}>
                    {/* Tire */}
                    <mesh castShadow receiveShadow material={tireMaterial}>
                        <cylinderGeometry args={[0.4, 0.4, 0.25, 32]} />
                    </mesh>
                    {/* Rim */}
                    <mesh castShadow receiveShadow material={rimMaterial}>
                        <cylinderGeometry args={[0.3, 0.3, 0.28, 32]} />
                    </mesh>
                </group>
            ))}

            {/* Spoiler */}
            {spoiler !== 'none' && (
                <group position={[0, 0.6, -1.8]}>
                    <mesh castShadow material={spoiler === 'carbon' ? tireMaterial : bodyMaterial} position={[0, 0.1, 0]}>
                        <boxGeometry args={[1.6, 0.05, 0.4]} />
                    </mesh>
                    <mesh position={[-0.7, -0.05, 0]} castShadow material={tireMaterial}>
                        <boxGeometry args={[0.05, 0.3, 0.2]} />
                    </mesh>
                    <mesh position={[0.7, -0.05, 0]} castShadow material={tireMaterial}>
                        <boxGeometry args={[0.05, 0.3, 0.2]} />
                    </mesh>
                </group>
            )}

            {/* Body Kit */}
            {bodyKit !== 'stock' && (
                <>
                    {/* Side Skirts */}
                    <mesh position={[-0.95, -0.1, 0]} castShadow material={bodyKit === 'carbon' ? tireMaterial : bodyMaterial}>
                        <boxGeometry args={[0.1, 0.15, 2.5]} />
                    </mesh>
                    <mesh position={[0.95, -0.1, 0]} castShadow material={bodyKit === 'carbon' ? tireMaterial : bodyMaterial}>
                        <boxGeometry args={[0.1, 0.15, 2.5]} />
                    </mesh>
                    {/* Front Lip */}
                    <mesh position={[0, -0.1, 2.0]} castShadow material={bodyKit === 'carbon' ? tireMaterial : bodyMaterial}>
                        <boxGeometry args={[1.8, 0.1, 0.2]} />
                    </mesh>
                </>
            )}
            
            {/* Fake Headlights to trigger bloom */}
            <mesh position={[-0.7, 0.3, 2.01]} material={new THREE.MeshBasicMaterial({ color: '#ffffff' })}>
                <planeGeometry args={[0.3, 0.15]} />
            </mesh>
            <mesh position={[0.7, 0.3, 2.01]} material={new THREE.MeshBasicMaterial({ color: '#ffffff' })}>
                <planeGeometry args={[0.3, 0.15]} />
            </mesh>
            
            {/* Fake Taillights */}
            <mesh position={[-0.7, 0.3, -2.01]} rotation={[0, Math.PI, 0]} material={new THREE.MeshBasicMaterial({ color: '#ff0000' })}>
                <planeGeometry args={[0.4, 0.1]} />
            </mesh>
            <mesh position={[0.7, 0.3, -2.01]} rotation={[0, Math.PI, 0]} material={new THREE.MeshBasicMaterial({ color: '#ff0000' })}>
                <planeGeometry args={[0.4, 0.1]} />
            </mesh>
        </group>
    );
};

// Actual Model component
export const CarModel = ({ url, color, wheels, spoiler, bodyKit }) => {
    const { scene } = useGLTF(url);
    
    useEffect(() => {
        scene.traverse((child) => {
            if (child.isMesh) {
                // Smooth edges
                if (child.geometry) {
                    child.geometry.computeVertexNormals();
                }
                
                const name = child.name.toLowerCase();
                
                // Realistic Car Paint
                if (name.includes('body') || name.includes('paint') || name.includes('exterior')) {
                    // Create a new physical material for realistic paint
                    const newMat = new THREE.MeshPhysicalMaterial({
                        color: new THREE.Color(color).convertSRGBToLinear(),
                        metalness: 0.6,
                        roughness: 0.4,
                        clearcoat: 1.0,
                        clearcoatRoughness: 0.1,
                    });
                    child.material = newMat;
                }
                
                // Enhance glass
                if (name.includes('glass') || name.includes('window')) {
                    child.material = new THREE.MeshPhysicalMaterial({
                        color: new THREE.Color('#ffffff'),
                        metalness: 0.1,
                        roughness: 0,
                        transmission: 0.95,
                        ior: 1.5,
                        transparent: true,
                    });
                }
            }
        });
    }, [scene, color, wheels, spoiler, bodyKit]);

    return <primitive object={scene} position={[0, -0.2, 0]} />;
};


const CaptureCanvas = ({ setCaptureFn }) => {
    const { gl, scene, camera } = useThree();
    useEffect(() => {
        setCaptureFn(() => () => {
            gl.render(scene, camera);
            return gl.domElement.toDataURL('image/png', 1.0);
        });
    }, [gl, scene, camera, setCaptureFn]);
    return null;
};


const ThreeDViewer = ({ modelUrl, paintColor, wheelType, spoilerType, bodyKitType, onSavedImage }) => {
    const [env, setEnv] = useState('studio');
    const [captureFn, setCaptureFn] = useState(() => () => null);

    const handleSnap = () => {
        const dataUrl = captureFn();
        if (dataUrl) {
            const link = document.createElement('a');
            link.download = `render_${new Date().getTime()}.png`;
            link.href = dataUrl;
            link.click();
            if (onSavedImage) onSavedImage(dataUrl);
        }
    };

    return (
        <div className="w-full h-full min-h-[400px] relative rounded-xl overflow-hidden cursor-move bg-[#111]">
            {/* Overlay UI */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10 pointer-events-none">
                <div className="flex flex-col gap-2 pointer-events-auto">
                    {['studio', 'city', 'night', 'park', 'lobby', 'sunset'].map(e => (
                        <button 
                            key={e}
                            onClick={() => setEnv(e)}
                            className={`px-3 py-1.5 text-[10px] uppercase font-bold rounded-lg shadow-lg transition-all ${
                                env === e 
                                ? 'bg-accent-cyan text-dark-900 border border-accent-cyan' 
                                : 'bg-dark-900/80 text-gray-400 border border-white/10 hover:bg-white/10 backdrop-blur-sm'
                            }`}
                        >
                            {e}
                        </button>
                    ))}
                </div>
                <button 
                    onClick={handleSnap}
                    className="pointer-events-auto flex items-center gap-2 bg-white/90 backdrop-blur-md text-dark-900 px-4 py-2 rounded-xl text-xs font-bold shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:scale-105 hover:bg-white transition-all border border-white/20"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                    Snap Render
                </button>
            </div>

            <Canvas shadows camera={{ position: [5, 2, 6], fov: 40 }} gl={{ preserveDrawingBuffer: true, antialias: false }}>
                {/* Background color based on environment */}
                {env === 'studio' && <color attach="background" args={['#1a1f2e']} />}
                {env === 'night' && <color attach="background" args={['#050510']} />}
                
                {/* Lighting setup for cinematic feel */}
                <ambientLight intensity={env === 'night' ? 0.1 : 0.4} />
                <spotLight position={[0, 15, 0]} angle={0.3} penumbra={1} intensity={2} castShadow shadow-bias={-0.0001} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1.5} castShadow shadow-bias={-0.0001} />
                <pointLight position={[-10, 5, -10]} intensity={env === 'night' ? 2 : 0.8} color={env === 'night' ? '#4466ff' : '#ffffff'} />
                
                <Suspense fallback={null}>
                    {/* High-quality reflection environment */}
                    <Environment preset={env} background={env !== 'studio' && env !== 'night'} blur={0.1} />
                    <CaptureCanvas setCaptureFn={setCaptureFn} />
                    
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
                    
                    {/* Ultra-realistic contact shadows */}
                    <ContactShadows resolution={2048} scale={12} blur={2.5} opacity={0.7} far={10} color="#000000" />
                </Suspense>

                {/* Premium fluid interaction */}
                <OrbitControls 
                    enablePan={false} 
                    minPolarAngle={Math.PI / 4} 
                    maxPolarAngle={Math.PI / 2 - 0.05} // Keep camera above ground
                    minDistance={4}
                    maxDistance={12}
                    autoRotate={true}
                    autoRotateSpeed={0.8}
                    enableDamping={true}
                    dampingFactor={0.05} // Silky smooth rotation
                />

                {/* Post-processing pipeline */}
                <EffectComposer multisampling={4}>
                    <N8AO aoRadius={0.5} intensity={1} />
                    <Bloom 
                        luminanceThreshold={0.9} // Only glowing things (headlights, bright reflections) bloom
                        mipmapBlur 
                        intensity={0.5} 
                    />
                    <Vignette eskil={false} offset={0.1} darkness={1.1} />
                </EffectComposer>
            </Canvas>
        </div>
    );
};

export default ThreeDViewer;
