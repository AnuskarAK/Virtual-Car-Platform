import { useState } from 'react';

const CarPreview = ({ carImage, paintColor, wheelType, spoilerType, bodyKitType }) => {
    const [imageLoaded, setImageLoaded] = useState(false);

    return (
        <div className="relative w-full">
            {/* Background glow matching paint color */}
            <div
                className="absolute inset-0 rounded-3xl blur-3xl opacity-15 transition-colors duration-700"
                style={{ backgroundColor: paintColor }}
            ></div>

            <div className="relative">
                {/* Car display with color overlay */}
                <div className="relative w-full overflow-hidden rounded-xl">
                    {/* Base car image */}
                    <img
                        src={carImage}
                        alt="Car Preview"
                        className="w-full h-auto relative z-10 transition-all duration-300"
                        onLoad={() => setImageLoaded(true)}
                        style={{
                            filter: `drop-shadow(0 10px 40px ${paintColor}40)`,
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

                {/* Ground reflection */}
                <div className="h-20 mt-0 overflow-hidden opacity-15 pointer-events-none">
                    <div className="relative w-full">
                        <img
                            src={carImage}
                            alt=""
                            className="w-full h-auto"
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
            <div className="absolute top-4 right-4 flex flex-col gap-2 z-40">
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
