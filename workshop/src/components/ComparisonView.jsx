import { useState } from 'react';

const ComparisonView = ({ carImage, originalColor, modifiedColor, onClose }) => {
    const [sliderPos, setSliderPos] = useState(50);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="glass rounded-2xl p-6 max-w-4xl w-full mx-4 animate-slide-up">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="font-heading text-lg font-bold text-white">Before & After</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors text-xl">&times;</button>
                </div>

                {/* Comparison slider */}
                <div className="relative rounded-xl overflow-hidden bg-dark-700" style={{ height: '400px' }}>
                    {/* Original (left) */}
                    <div className="absolute inset-0 flex items-center justify-center p-8">
                        <div className="text-center w-full">
                            <img src={carImage} alt="Original" className="w-3/4 mx-auto mb-4 opacity-60" />
                            <span className="text-xs text-gray-500 font-heading tracking-wider">ORIGINAL</span>
                        </div>
                    </div>

                    {/* Modified (right) - clipped */}
                    <div
                        className="absolute inset-0 flex items-center justify-center p-8"
                        style={{
                            clipPath: `inset(0 0 0 ${sliderPos}%)`,
                        }}
                    >
                        <div className="text-center w-full">
                            <div className="relative w-3/4 mx-auto mb-4">
                                <img
                                    src={carImage}
                                    alt="Modified"
                                    className="w-full"
                                    style={{ filter: `hue-rotate(${getHueRotation(modifiedColor)}deg) saturate(1.5)` }}
                                />
                            </div>
                            <span className="text-xs text-accent-cyan font-heading tracking-wider">MODIFIED</span>
                        </div>
                    </div>

                    {/* Slider control */}
                    <div
                        className="absolute top-0 bottom-0 w-1 bg-accent-cyan cursor-ew-resize z-10"
                        style={{ left: `${sliderPos}%` }}
                    >
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-accent-cyan flex items-center justify-center text-dark-900">
                            ↔
                        </div>
                    </div>

                    {/* Slider input */}
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={sliderPos}
                        onChange={(e) => setSliderPos(Number(e.target.value))}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
                    />
                </div>

                <div className="flex justify-between mt-4 text-xs text-gray-500">
                    <span>← Original</span>
                    <span>Modified →</span>
                </div>
            </div>
        </div>
    );
};

function getHueRotation(hex) {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    if (max !== min) {
        const d = max - min;
        if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        else if (max === g) h = ((b - r) / d + 2) / 6;
        else h = ((r - g) / d + 4) / 6;
    }
    return Math.round(h * 360);
}

export default ComparisonView;
