import { useState, useRef, useCallback, useEffect } from 'react';
import { IoRefreshOutline, IoPauseOutline } from 'react-icons/io5';

const CarPreview = ({ carImage, paintColor, wheelType, spoilerType, bodyKitType }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [rotationY, setRotationY] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [autoRotate, setAutoRotate] = useState(false);
    const dragStartX = useRef(0);
    const dragStartRotation = useRef(0);
    const containerRef = useRef(null);
    const animationRef = useRef(null);

    // Auto-rotate animation loop
    useEffect(() => {
        if (autoRotate && !isDragging) {
            let lastTime = performance.now();
            const animate = (time) => {
                const delta = time - lastTime;
                lastTime = time;
                setRotationY((prev) => (prev + delta * 0.03) % 360);
                animationRef.current = requestAnimationFrame(animate);
            };
            animationRef.current = requestAnimationFrame(animate);
        }
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [autoRotate, isDragging]);

    // Mouse drag handlers
    const handleMouseDown = useCallback((e) => {
        e.preventDefault();
        setIsDragging(true);
        dragStartX.current = e.clientX;
        dragStartRotation.current = rotationY;
    }, [rotationY]);

    const handleMouseMove = useCallback((e) => {
        if (!isDragging) return;
        const deltaX = e.clientX - dragStartX.current;
        const newRotation = dragStartRotation.current + deltaX * 0.5;
        setRotationY(newRotation % 360);
    }, [isDragging]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    // Touch drag handlers
    const handleTouchStart = useCallback((e) => {
        setIsDragging(true);
        dragStartX.current = e.touches[0].clientX;
        dragStartRotation.current = rotationY;
    }, [rotationY]);

    const handleTouchMove = useCallback((e) => {
        if (!isDragging) return;
        const deltaX = e.touches[0].clientX - dragStartX.current;
        const newRotation = dragStartRotation.current + deltaX * 0.5;
        setRotationY(newRotation % 360);
    }, [isDragging]);

    const handleTouchEnd = useCallback(() => {
        setIsDragging(false);
    }, []);

    // Global mouse up
    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            window.addEventListener('touchmove', handleTouchMove);
            window.addEventListener('touchend', handleTouchEnd);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);
        };
    }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

    const toggleAutoRotate = () => {
        setAutoRotate((prev) => !prev);
    };

    // Normalize rotation display
    const displayAngle = Math.round(((rotationY % 360) + 360) % 360);

    return (
        <div className="relative w-full">
            {/* Background glow matching paint color */}
            <div
                className="absolute inset-0 rounded-3xl blur-3xl opacity-15 transition-colors duration-700"
                style={{ backgroundColor: paintColor }}
            ></div>

            <div className="relative">
                {/* Turntable controls */}
                <div className="flex items-center justify-between mb-3 px-1">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={toggleAutoRotate}
                            className={`turntable-control-btn ${autoRotate ? 'turntable-control-active' : ''}`}
                            title={autoRotate ? 'Stop rotation' : 'Auto rotate'}
                        >
                            {autoRotate ? <IoPauseOutline size={14} /> : <IoRefreshOutline size={14} />}
                            <span>{autoRotate ? 'Stop' : 'Auto Spin'}</span>
                        </button>
                    </div>
                    <div className="turntable-angle-display">
                        <span className="turntable-angle-value">{displayAngle}°</span>
                    </div>
                </div>

                {/* 3D Turntable container */}
                <div
                    ref={containerRef}
                    className="turntable-stage"
                    onMouseDown={handleMouseDown}
                    onTouchStart={handleTouchStart}
                    style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                >
                    <div
                        className="turntable-car"
                        style={{
                            transform: `perspective(1200px) rotateY(${rotationY}deg)`,
                            transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                        }}
                    >
                        {/* Base car image */}
                        <img
                            src={carImage}
                            alt="Car Preview"
                            className="w-full h-auto relative z-10 select-none"
                            onLoad={() => setImageLoaded(true)}
                            draggable={false}
                            style={{
                                filter: `drop-shadow(0 10px 40px ${paintColor}40)`,
                                pointerEvents: 'none',
                            }}
                        />

                        {/* Color overlay using mix-blend-mode */}
                        {paintColor !== '#808080' && imageLoaded && (
                            <div
                                className="absolute inset-0 z-20 transition-colors duration-500 pointer-events-none"
                                style={{
                                    backgroundColor: paintColor,
                                    mixBlendMode: 'color',
                                    opacity: 0.65,
                                }}
                            ></div>
                        )}

                        {/* Shine/highlight overlay for realism */}
                        <div
                            className="absolute inset-0 z-30 pointer-events-none"
                            style={{
                                background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.04) 100%)',
                            }}
                        ></div>
                    </div>

                    {/* Turntable ground ring */}
                    <div
                        className="turntable-ground"
                        style={{
                            transform: `rotateX(85deg) rotateZ(${rotationY}deg)`,
                        }}
                    ></div>

                    {/* Drag hint */}
                    {!isDragging && !autoRotate && (
                        <div className="turntable-hint">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14M12 5l-7 7 7 7" />
                            </svg>
                            Drag to rotate
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M19 12H5M12 19l7-7-7-7" />
                            </svg>
                        </div>
                    )}
                </div>

                {/* Ground reflection */}
                <div className="h-20 mt-0 overflow-hidden opacity-15 pointer-events-none">
                    <div
                        className="relative w-full"
                        style={{
                            transform: `perspective(1200px) rotateY(${rotationY}deg)`,
                            transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                        }}
                    >
                        <img
                            src={carImage}
                            alt=""
                            className="w-full h-auto"
                            draggable={false}
                            style={{
                                transform: 'scaleY(-1)',
                                maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.4), transparent)',
                                WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.4), transparent)',
                            }}
                        />
                        {paintColor !== '#808080' && (
                            <div
                                className="absolute inset-0"
                                style={{
                                    backgroundColor: paintColor,
                                    mixBlendMode: 'color',
                                    opacity: 0.65,
                                    transform: 'scaleY(-1)',
                                }}
                            ></div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modification badges */}
            <div className="absolute top-14 right-4 flex flex-col gap-2 z-40">
                {spoilerType !== 'none' && (
                    <span className="glass text-[10px] text-accent-cyan px-2.5 py-1 rounded-full font-medium">
                        + {spoilerType.replace('-', ' ')} spoiler
                    </span>
                )}
                {bodyKitType !== 'stock' && (
                    <span className="glass text-[10px] text-accent-orange px-2.5 py-1 rounded-full font-medium">
                        + {bodyKitType} body kit
                    </span>
                )}
                {wheelType !== 'stock' && (
                    <span className="glass text-[10px] text-accent-purple px-2.5 py-1 rounded-full font-medium">
                        + {wheelType.replace('-', ' ')} wheels
                    </span>
                )}
            </div>

            {/* Color name display */}
            <div className="absolute bottom-24 left-4 z-40">
                <div className="flex items-center gap-2 glass rounded-lg px-3 py-1.5">
                    <div
                        className="w-4 h-4 rounded-full border border-white/20"
                        style={{ backgroundColor: paintColor }}
                    ></div>
                    <span className="text-[11px] text-gray-300 font-mono">{paintColor}</span>
                </div>
            </div>
        </div>
    );
};

export default CarPreview;
