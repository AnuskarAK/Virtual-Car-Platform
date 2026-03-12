import { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, PerspectiveCamera, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { calculatePerformance } from '../data/modifiers';
import { FallbackModel, CarModel } from './ThreeDViewer';
import { IoCloseOutline } from 'react-icons/io5';

const TrackEnvironment = () => {
    return (
        <group>
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, 0]}>
                <planeGeometry args={[1000, 1000]} />
                <meshStandardMaterial color="#2a2a2a" roughness={0.8} />
            </mesh>
            {/* Grid helper for sense of speed */}
            <gridHelper args={[1000, 200, 0x444444, 0x222222]} position={[0, 0.01, 0]} />
            
            {/* Some roadside blocks */}
            {Array.from({ length: 50 }).map((_, i) => (
                <mesh key={i} position={[Math.random() * 200 - 100, 2, Math.random() * 200 - 100]} castShadow receiveShadow>
                    <boxGeometry args={[4, 4, 4]} />
                    <meshStandardMaterial color="#444" />
                </mesh>
            ))}
            {/* Add more ambient lighting for the track */}
            <ambientLight intensity={0.5} />
            <spotLight position={[50, 50, 50]} angle={0.2} penumbra={1} intensity={1} castShadow />
            <directionalLight position={[-50, 50, -50]} intensity={0.5} />
        </group>
    );
};

const CarPhysicsWrapper = ({ children, performance, inputs, setSpeed }) => {
    const carRef = useRef();
    const cameraRef = useRef();
    const velocity = useRef(0);
    const rotation = useRef(0);
    
    // Tuning values based on performance stats
    // Top speed in mph -> scale down for 3D units
    const maxSpeed = performance.topSpeed / 100;
    const accelRate = performance.accel > 0 ? (10 / performance.accel) * 0.002 : 0.005;
    const handlingTurnRate = (performance.handling / 100) * 0.04 + 0.015;
    
    useFrame((state, delta) => {
        if (!carRef.current) return;
        
        // Acceleration
        if (inputs.up) {
            velocity.current = THREE.MathUtils.lerp(velocity.current, maxSpeed, accelRate);
        } else if (inputs.down) {
            velocity.current = THREE.MathUtils.lerp(velocity.current, -maxSpeed / 3, accelRate * 2);
        } else {
            // Friction / Coasting
            velocity.current = THREE.MathUtils.lerp(velocity.current, 0, 0.02);
        }
        
        // Steering
        if (Math.abs(velocity.current) > 0.02) {
            const turnDirection = velocity.current > 0 ? 1 : -1;
            if (inputs.left) rotation.current += handlingTurnRate * turnDirection;
            if (inputs.right) rotation.current -= handlingTurnRate * turnDirection;
        }
        
        // Apply rotation
        carRef.current.rotation.y = rotation.current;
        
        // Apply velocity to position
        carRef.current.position.z -= Math.cos(rotation.current) * velocity.current;
        carRef.current.position.x -= Math.sin(rotation.current) * velocity.current;
        
        // Update speed state (convert back to reasonable mph range for display)
        setSpeed(Math.abs(Math.round(velocity.current * 100)));

        // Camera Follow
        if (cameraRef.current) {
            // Target position behind the car
            const idealCameraOffset = new THREE.Vector3(0, 3, 10);
            idealCameraOffset.applyQuaternion(carRef.current.quaternion);
            idealCameraOffset.add(carRef.current.position);
            
            // Lerp camera position for smoothness
            cameraRef.current.position.lerp(idealCameraOffset, 0.1);
            
            // Target look direction slightly ahead of the car
            const idealLookAt = new THREE.Vector3(0, 1, -5);
            idealLookAt.applyQuaternion(carRef.current.quaternion);
            idealLookAt.add(carRef.current.position);
            
            cameraRef.current.lookAt(idealLookAt);
        }
    });

    return (
        <group>
            <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 3, 10]} />
            <group ref={carRef}>
                {children}
            </group>
        </group>
    );
};

const TestDriveSimulator = ({ car, mods, onClose }) => {
    const [inputs, setInputs] = useState({ up: false, down: false, left: false, right: false });
    const [speed, setSpeed] = useState(0);
    
    const performance = calculatePerformance(car.baseHorsepower, car.baseAcceleration, car.baseTopSpeed, car.baseHandling, mods);

    useEffect(() => {
        const handleKeyDown = (e) => {
            switch(e.key.toLowerCase()) {
                case 'w': case 'arrowup': setInputs(i => ({...i, up: true})); break;
                case 's': case 'arrowdown': setInputs(i => ({...i, down: true})); break;
                case 'a': case 'arrowleft': setInputs(i => ({...i, left: true})); break;
                case 'd': case 'arrowright': setInputs(i => ({...i, right: true})); break;
                default: break;
            }
        };
        const handleKeyUp = (e) => {
            switch(e.key.toLowerCase()) {
                case 'w': case 'arrowup': setInputs(i => ({...i, up: false})); break;
                case 's': case 'arrowdown': setInputs(i => ({...i, down: false})); break;
                case 'a': case 'arrowleft': setInputs(i => ({...i, left: false})); break;
                case 'd': case 'arrowright': setInputs(i => ({...i, right: false})); break;
                default: break;
            }
        };
        
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        
        // Prevent default scrolling for arrows
        const preventScroll = (e) => {
            if(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
                e.preventDefault();
            }
        }
        window.addEventListener('keydown', preventScroll, { passive: false });

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            window.removeEventListener('keydown', preventScroll);
        };
    }, []);

    return (
        <div className="fixed inset-0 z-[100] bg-dark-900 flex flex-col items-center justify-center animate-fade-in">
            {/* Overlay UI */}
            <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-10 pointer-events-none">
                <div>
                    <h2 className="text-2xl font-heading font-bold text-white shadow-black drop-shadow-lg">Test Drive Mode</h2>
                    <p className="text-accent-cyan font-mono text-sm tracking-wide shadow-black drop-shadow-md mt-1">
                        Use W A S D or Arrows to drive
                    </p>
                </div>
                <button 
                    onClick={onClose}
                    className="w-12 h-12 rounded-full bg-dark-800/80 backdrop-blur-md border border-white/[0.1] text-gray-300 hover:text-white hover:bg-white/[0.1] transition-all flex items-center justify-center pointer-events-auto"
                >
                    <IoCloseOutline size={24} />
                </button>
            </div>
            
            {/* Speedometer */}
            <div className="absolute bottom-10 right-10 bg-dark-800/80 backdrop-blur-md border border-white/[0.1] rounded-2xl p-6 min-w-[150px] text-center z-10 shadow-2xl">
                <div className="text-5xl font-mono font-bold text-white mb-1 shadow-black">{speed}</div>
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-[0.2em]">MPH</div>
            </div>

            {/* Performance Stats Overlay */}
            <div className="absolute bottom-10 left-10 bg-dark-800/80 backdrop-blur-md border border-white/[0.1] rounded-xl p-5 w-[250px] z-10 hidden sm:block shadow-2xl">
                <h3 className="text-[10px] font-semibold text-gray-400 tracking-[0.2em] uppercase mb-4">Vehicle Specs</h3>
                <div className="space-y-3">
                    <div className="flex justify-between">
                        <span className="text-xs text-gray-500">HP</span>
                        <span className="text-xs font-mono text-white">{performance.hp}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-xs text-gray-500">0-60</span>
                        <span className="text-xs font-mono text-white">{performance.accel}s</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-xs text-gray-500">Handling</span>
                        <span className="text-xs font-mono text-white">{performance.handling}</span>
                    </div>
                </div>
            </div>

            {/* 3D Canvas */}
            <div className="w-full h-full">
                <Canvas shadows dpr={[1, 2]}>
                    <color attach="background" args={['#87CEEB']} />
                    <fog attach="fog" args={['#87CEEB', 50, 400]} />
                    
                    <Suspense fallback={null}>
                        <Environment preset="city" />
                        
                        <TrackEnvironment />
                        
                        <CarPhysicsWrapper performance={performance} inputs={inputs} setSpeed={setSpeed}>
                            {car.modelUrl ? (
                                <CarModel 
                                    url={car.modelUrl} 
                                    color={mods.paintColor} 
                                    wheels={mods.wheels} 
                                    spoiler={mods.spoiler} 
                                    bodyKit={mods.bodyKit} 
                                />
                            ) : (
                                <FallbackModel 
                                    color={mods.paintColor} 
                                    wheels={mods.wheels} 
                                    spoiler={mods.spoiler} 
                                    bodyKit={mods.bodyKit} 
                                />
                            )}
                            <ContactShadows resolution={512} scale={10} blur={2} opacity={0.6} far={10} color="#000000" />
                        </CarPhysicsWrapper>
                    </Suspense>
                </Canvas>
            </div>
        </div>
    );
};

export default TestDriveSimulator;
