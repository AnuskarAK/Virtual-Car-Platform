import { useState } from 'react';
import { generateBestBuild } from '../utils/buildGenerator';
import { calculateTotalCost } from '../data/modifiers';
import { IoDiamondOutline, IoSpeedometerOutline, IoFlashOutline, IoCheckmarkCircleOutline } from 'react-icons/io5';

const BudgetGenerator = ({ car, currentMods, onApplyBuild }) => {
    const [budget, setBudget] = useState(car.basePrice + 5000); // Default to a reasonable bump
    const [goal, setGoal] = useState('performance');
    const [suggestedBuild, setSuggestedBuild] = useState(null);
    const [suggestedCost, setSuggestedCost] = useState(0);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = () => {
        setIsGenerating(true);
        setTimeout(() => {
            const result = generateBestBuild(car, budget, goal);
            if (result) {
                setSuggestedBuild(result);
                setSuggestedCost(calculateTotalCost(car.basePrice, result));
            }
            setIsGenerating(false);
        }, 600); // Fake delay for UX (feels like it's "thinking")
    };

    const handleApply = () => {
        if (suggestedBuild) {
            onApplyBuild(suggestedBuild);
            setSuggestedBuild(null); // Reset after applying
        }
    };

    return (
        <div className="bg-dark-800 border border-white/[0.06] rounded-2xl p-5 mt-4">
            <h3 className="text-[10px] font-semibold text-gray-400 tracking-[0.2em] uppercase mb-4 flex items-center gap-2">
                <IoFlashOutline className="text-accent-orange text-sm" /> 
                Auto-Build Generator
            </h3>
            
            <div className="space-y-4">
                {/* Budget Input */}
                <div>
                    <label className="text-[11px] text-gray-500 font-medium mb-1.5 block">Max Budget ($)</label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                        <input
                            type="number"
                            min={car.basePrice}
                            step="500"
                            value={budget}
                            onChange={(e) => setBudget(Number(e.target.value))}
                            className="bg-dark-900 border border-white/[0.08] rounded-xl w-full py-2.5 pl-8 pr-4 text-sm font-mono text-white focus:outline-none focus:border-accent-cyan/50 focus:ring-1 focus:ring-accent-cyan/50 transition-all"
                        />
                    </div>
                </div>

                {/* Goal Selection */}
                <div>
                    <label className="text-[11px] text-gray-500 font-medium mb-1.5 block">Build Goal</label>
                    <div className="grid grid-cols-3 gap-2">
                        <button
                            onClick={() => setGoal('performance')}
                            className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg border text-[10px] transition-all ${
                                goal === 'performance' 
                                ? 'bg-accent-blue/10 border-accent-blue text-accent-blue' 
                                : 'bg-dark-900 border-white/[0.04] text-gray-500 hover:text-gray-300'
                            }`}
                        >
                            <IoSpeedometerOutline size={16} className="mb-1" />
                            Performance
                        </button>
                        <button
                            onClick={() => setGoal('balanced')}
                            className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg border text-[10px] transition-all ${
                                goal === 'balanced' 
                                ? 'bg-accent-cyan/10 border-accent-cyan text-accent-cyan' 
                                : 'bg-dark-900 border-white/[0.04] text-gray-500 hover:text-gray-300'
                            }`}
                        >
                            <IoCheckmarkCircleOutline size={16} className="mb-1" />
                            Balanced
                        </button>
                        <button
                            onClick={() => setGoal('aesthetics')}
                            className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg border text-[10px] transition-all ${
                                goal === 'aesthetics' 
                                ? 'bg-purple-500/10 border-purple-500 text-purple-400' 
                                : 'bg-dark-900 border-white/[0.04] text-gray-500 hover:text-gray-300'
                            }`}
                        >
                            <IoDiamondOutline size={16} className="mb-1" />
                            Aesthetics
                        </button>
                    </div>
                </div>

                {/* Generate Button */}
                <button
                    onClick={handleGenerate}
                    disabled={isGenerating || budget < car.basePrice}
                    className="w-full py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-sm text-white font-medium hover:bg-white/[0.1] transition-all disabled:opacity-50"
                >
                    {isGenerating ? 'Analyzing...' : 'Generate Build'}
                </button>

                {/* Result Box */}
                {suggestedBuild && !isGenerating && (
                    <div className="mt-4 p-4 bg-dark-900 border border-accent-cyan/20 rounded-xl animate-slide-up relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-accent-cyan/5 rounded-bl-full border-l border-b border-accent-cyan/10"></div>
                        <h4 className="text-[11px] font-semibold text-accent-cyan uppercase tracking-wider mb-2">Recommended Setup</h4>
                        
                        <div className="grid grid-cols-2 gap-y-2 gap-x-4 mb-4 relative z-10">
                            <div>
                                <span className="text-[9px] text-gray-600 block uppercase">Wheels</span>
                                <span className="text-[11px] text-gray-300 capitalize">{suggestedBuild.wheels.replace(/-/g, ' ')}</span>
                            </div>
                            <div>
                                <span className="text-[9px] text-gray-600 block uppercase">Body Kit</span>
                                <span className="text-[11px] text-gray-300 capitalize">{suggestedBuild.bodyKit.replace(/-/g, ' ')}</span>
                            </div>
                            <div>
                                <span className="text-[9px] text-gray-600 block uppercase">Spoiler</span>
                                <span className="text-[11px] text-gray-300 capitalize">{suggestedBuild.spoiler.replace(/-/g, ' ')}</span>
                            </div>
                            <div>
                                <span className="text-[9px] text-gray-600 block uppercase">Cost</span>
                                <span className="text-[11px] font-mono text-accent-cyan">${suggestedCost.toLocaleString()}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleApply}
                            className="w-full py-2 rounded-lg bg-accent-cyan text-dark-900 text-xs font-bold transition-transform active:scale-[0.98] hover:shadow-lg hover:shadow-accent-cyan/20"
                        >
                            Apply This Build
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BudgetGenerator;
