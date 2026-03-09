const ColorPicker = ({ colors, selectedColor, onColorChange }) => {
    return (
        <div>
            <div className="grid grid-cols-5 gap-3">
                {colors.map((color) => (
                    <button
                        key={color.hex}
                        onClick={() => onColorChange(color.hex)}
                        className={`group relative w-full aspect-square rounded-xl transition-all duration-300 hover:scale-110 ${selectedColor === color.hex
                                ? 'ring-2 ring-accent-cyan ring-offset-2 ring-offset-dark-800 scale-110'
                                : ''
                            }`}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                    >
                        {selectedColor === color.hex && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <svg className="w-5 h-5" fill="none" stroke={getContrastColor(color.hex)} strokeWidth="3" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        )}
                        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-gray-400 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                            {color.name}
                        </span>
                    </button>
                ))}
            </div>

            {/* Custom color input */}
            <div className="mt-8 flex gap-3 items-center">
                <label className="text-xs text-gray-500">Custom:</label>
                <input
                    type="color"
                    value={selectedColor}
                    onChange={(e) => onColorChange(e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer border-2 border-dark-600 bg-transparent"
                />
                <input
                    type="text"
                    value={selectedColor}
                    onChange={(e) => onColorChange(e.target.value)}
                    className="input-field !py-2 !px-3 text-xs font-mono w-28"
                    placeholder="#000000"
                />
            </div>
        </div>
    );
};

// Helper to decide checkmark color
function getContrastColor(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#1a1a2e' : '#ffffff';
}

export default ColorPicker;
