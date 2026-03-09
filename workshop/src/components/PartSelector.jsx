const PartSelector = ({ parts, selectedPart, onPartChange, label }) => {
    return (
        <div>
            <div className="grid grid-cols-2 gap-3">
                {parts.map((part) => (
                    <button
                        key={part.name}
                        onClick={() => onPartChange(part.image)}
                        className={`glass rounded-xl p-4 text-center transition-all duration-300 hover:scale-105 ${selectedPart === part.image
                                ? 'ring-2 ring-accent-cyan bg-accent-blue/10'
                                : 'hover:bg-white/5'
                            }`}
                    >
                        <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-dark-600 flex items-center justify-center">
                            <PartIcon type={label} name={part.image} />
                        </div>
                        <span className="text-xs font-medium text-gray-300">{part.name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

const PartIcon = ({ type, name }) => {
    // Simple SVG icons for different part types
    if (name === 'none' || name === 'stock') {
        return (
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                {name === 'none' ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                )}
            </svg>
        );
    }

    return (
        <svg className="w-6 h-6 text-accent-cyan" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
        </svg>
    );
};

export default PartSelector;
