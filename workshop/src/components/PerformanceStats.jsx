import { calculatePerformance } from '../data/modifiers';

const PerformanceStats = ({ baseHp = 300, baseAccel = 4.5, baseSpeed = 155, mods }) => {
    
    const current = calculatePerformance(baseHp, baseAccel, baseSpeed, mods);
    
    // Calculate max values for progress bars (assuming max realistic values)
    const maxHp = 1500;
    const minAccel = 1.5; // lower is better
    const maxAccelRange = 8.0; // 8.0 is empty bar, 1.5 is full bar
    const maxSpeed = 300;

    const hpPercent = (current.hp / maxHp) * 100;
    
    // For acceleration, closer to 1.5 is better (100%), closer to 8.0 is 0%
    const accelPercent = Math.max(0, 100 - ((current.accel - minAccel) / (maxAccelRange - minAccel)) * 100);
    
    const speedPercent = (current.topSpeed / maxSpeed) * 100;

    // Determine the diff string
    const renderDiff = (currentVal, baseVal, isLowerBetter = false) => {
        const diff = currentVal - baseVal;
        if (Math.abs(diff) < 0.01) return null; // No difference

        const isPositive = diff > 0;
        const isImprovement = isLowerBetter ? !isPositive : isPositive;
        const colorClass = isImprovement ? 'text-green-400' : 'text-red-400';
        const sign = isPositive ? '+' : '';

        // Format to 2 decimal places if it's less than 1, else round
        const displayDiff = Math.abs(diff) < 1 ? diff.toFixed(2) : Math.round(diff);

        return <span className={`text-[10px] ml-2 ${colorClass}`}>({sign}{displayDiff})</span>;
    };

    return (
        <div className="bg-dark-800 border border-white/[0.06] rounded-2xl px-5 py-4 w-full">
            <h3 className="text-[10px] font-semibold text-gray-500 tracking-[0.2em] uppercase mb-4">Performance Stats</h3>
            
            <div className="space-y-4">
                {/* HP */}
                <div>
                    <div className="flex justify-between mb-1">
                        <span className="text-[11px] text-gray-400 font-medium">Horsepower</span>
                        <div className="flex items-center">
                            <span className="text-[12px] font-mono text-white tracking-wide">{current.hp} HP</span>
                            {renderDiff(current.hp, baseHp)}
                        </div>
                    </div>
                    <div className="w-full bg-dark-900 rounded-full h-1.5 overflow-hidden border border-white/[0.04]">
                        <div className="bg-accent-cyan h-1.5 rounded-full transition-all duration-500 ease-out" style={{ width: `${Math.min(hpPercent, 100)}%` }}></div>
                    </div>
                </div>

                {/* Acceleration */}
                <div>
                    <div className="flex justify-between mb-1">
                        <span className="text-[11px] text-gray-400 font-medium">0-60 mph</span>
                        <div className="flex items-center">
                             <span className="text-[12px] font-mono text-white tracking-wide">{current.accel}s</span>
                             {renderDiff(current.accel, baseAccel, true)}
                        </div>
                    </div>
                    <div className="w-full bg-dark-900 rounded-full h-1.5 overflow-hidden border border-white/[0.04]">
                        <div className="bg-accent-blue h-1.5 rounded-full transition-all duration-500 ease-out" style={{ width: `${Math.min(accelPercent, 100)}%` }}></div>
                    </div>
                </div>

                {/* Top Speed */}
                <div>
                    <div className="flex justify-between mb-1">
                        <span className="text-[11px] text-gray-400 font-medium">Top Speed</span>
                        <div className="flex items-center">
                             <span className="text-[12px] font-mono text-white tracking-wide">{current.topSpeed} mph</span>
                             {renderDiff(current.topSpeed, baseSpeed)}
                        </div>
                    </div>
                    <div className="w-full bg-dark-900 rounded-full h-1.5 overflow-hidden border border-white/[0.04]">
                        <div className="bg-purple-500 h-1.5 rounded-full transition-all duration-500 ease-out" style={{ width: `${Math.min(speedPercent, 100)}%` }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PerformanceStats;
