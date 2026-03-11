import { modifiers, calculateTotalCost } from '../data/modifiers';

const CostCalculator = ({ basePrice = 30000, mods }) => {
    
    const total = calculateTotalCost(basePrice, mods);
    
    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(price);
    };

    const paintCost = modifiers.paint[mods.paintColor] ? modifiers.paint[mods.paintColor].cost : 500;
    const wheelsCost = modifiers.wheels[mods.wheels] ? modifiers.wheels[mods.wheels].cost : 0;
    const spoilerCost = modifiers.spoiler[mods.spoiler] ? modifiers.spoiler[mods.spoiler].cost : 0;
    const bodyKitCost = modifiers.bodyKit[mods.bodyKit] ? modifiers.bodyKit[mods.bodyKit].cost : 0;

    const renderItem = (label, cost, name) => {
        if (cost === 0 && name === undefined) return null;
        
        return (
            <div className="flex justify-between items-end mb-2">
                <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">{label}</p>
                    {name && <p className="text-[12px] text-gray-300 capitalize">{name}</p>}
                </div>
                <span className="text-[12px] font-mono text-white">{cost === 0 ? 'Included' : `+${formatPrice(cost)}`}</span>
            </div>
        );
    };

    return (
        <div className="bg-dark-800 border border-white/[0.06] rounded-2xl px-5 py-4 w-full">
            <h3 className="text-[10px] font-semibold text-gray-500 tracking-[0.2em] uppercase mb-4">Build Cost Summary</h3>
            
            <div className="space-y-1 mb-4 border-b border-white/[0.06] pb-3">
                <div className="flex justify-between items-end mb-3">
                    <span className="text-[12px] text-gray-400 font-medium">Base Vehicle</span>
                    <span className="text-[13px] font-mono text-white">{formatPrice(basePrice)}</span>
                </div>

                {paintCost > 0 && renderItem('Paint', paintCost, mods.paintColor)}
                {renderItem('Wheels', wheelsCost, modifiers.wheels[mods.wheels]?.name || mods.wheels)}
                {renderItem('Spoiler', spoilerCost, modifiers.spoiler[mods.spoiler]?.name || mods.spoiler)}
                {renderItem('Body Kit', bodyKitCost, modifiers.bodyKit[mods.bodyKit]?.name || mods.bodyKit)}
            </div>

            <div className="flex justify-between items-center mt-2">
                <span className="text-sm font-semibold text-white uppercase tracking-wider">Total</span>
                <span className="text-lg font-mono font-bold text-accent-cyan">{formatPrice(total)}</span>
            </div>
        </div>
    );
};

export default CostCalculator;
