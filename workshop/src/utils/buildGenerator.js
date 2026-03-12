import { modifiers, calculateTotalCost, calculatePerformance } from '../data/modifiers';

export const generateBestBuild = (car, budget, goal) => {
    // goal: 'performance' or 'balanced' or 'aesthetics'
    // 'performance' = max accel/speed/handling
    // 'aesthetics' = expensive mods = better aesthetics (simplification for algorithm)

    let bestMods = null;
    let bestScore = -Infinity;
    let fallbackMods = null;

    // Helper to get string names from car's available arrays
    const colors = car.availableColors.length ? car.availableColors.map(c => c.hex) : ['#808080'];
    const wheels = car.availableWheels.map(w => w.name);
    const spoilers = car.availableSpoilers.map(s => s.name);
    const kits = car.availableBodyKits.map(k => k.name);
    
    // Ensure 'stock' and 'none' are always considered
    if (!wheels.includes('stock')) wheels.push('stock');
    if (!spoilers.includes('none')) spoilers.push('none');
    if (!kits.includes('stock')) kits.push('stock');

    const basePrice = car.basePrice || 30000;

    // Exhaustive search (combinations are small enough: ~ 5 * 5 * 4 * 4 = 400 iterations)
    // For larger datasets, a greedy approach or dynamic programming would be needed
    for (const color of colors) {
        for (const wheel of wheels) {
            for (const spoiler of spoilers) {
                for (const kit of kits) {
                    const currentMods = { paintColor: color, wheels: wheel, spoiler: spoiler, bodyKit: kit };
                    const currentCost = calculateTotalCost(basePrice, currentMods);
                    
                    if (currentCost <= budget) {
                        fallbackMods = currentMods; // Any valid build under budget
                        
                        const perf = calculatePerformance(car.baseHorsepower, car.baseAcceleration, car.baseTopSpeed, car.baseHandling, currentMods);
                        let score = 0;

                        if (goal === 'performance') {
                            // Maximize HP, Speed, Handling, Minimize Acceleration time
                            score = (perf.hp * 0.1) + (perf.topSpeed * 0.5) + (perf.handling * 2) - (perf.accel * 50);
                        } else if (goal === 'aesthetics') {
                            // Just prefer the most expensive parts that fit the budget
                            score = currentCost;
                        } else {
                            // Balanced (some perf, some cost density)
                            score = (perf.hp * 0.05) + (perf.topSpeed * 0.2) + (perf.handling) - (perf.accel * 20) + (currentCost * 0.01);
                        }

                        if (score > bestScore) {
                            bestScore = score;
                            bestMods = currentMods;
                        }
                    }
                }
            }
        }
    }

    return bestMods || fallbackMods || { paintColor: car.defaultColor, wheels: 'stock', spoiler: 'none', bodyKit: 'stock' };
};
