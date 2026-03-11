import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getCarById, saveNewBuild } from '../services/api';
import ThreeDViewer from '../components/ThreeDViewer';
import ColorPicker from '../components/ColorPicker';
import PartSelector from '../components/PartSelector';
import ComparisonView from '../components/ComparisonView';
import CostCalculator from '../components/CostCalculator';
import PerformanceStats from '../components/PerformanceStats';
import AIAssistant from '../components/AIAssistant';
import { IoColorPaletteOutline, IoSettingsOutline, IoSaveOutline, IoRefreshOutline, IoGitCompareOutline, IoDownloadOutline } from 'react-icons/io5';
import { FiChevronLeft } from 'react-icons/fi';
import { GiCarWheel, GiSpeedometer } from 'react-icons/gi';

const Customize = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('paint');
    const [showComparison, setShowComparison] = useState(false);
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [buildName, setBuildName] = useState('');
    const [saving, setSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [isPublic, setIsPublic] = useState(false);

    const [mods, setMods] = useState({
        paintColor: '#808080',
        wheels: 'stock',
        spoiler: 'none',
        bodyKit: 'stock',
    });

    useEffect(() => {
        const fetchCar = async () => {
            try {
                const res = await getCarById(id);
                setCar(res.data);
                setMods(prev => ({ ...prev, paintColor: res.data.defaultColor }));
            } catch (error) {
                console.error('Error fetching car:', error);
                navigate('/cars');
            }
            setLoading(false);
        };
        fetchCar();
    }, [id, navigate]);

    const handleReset = () => {
        if (car) {
            setMods({
                paintColor: car.defaultColor,
                wheels: 'stock',
                spoiler: 'none',
                bodyKit: 'stock',
            });
        }
    };

    const handleApplyAISuggestions = (suggestedMods) => {
        setMods(prevMods => ({ ...prevMods, ...suggestedMods }));
    };

    const handleSave = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        if (!buildName.trim()) return;

        setSaving(true);
        try {
            // Compute current cost and performance for saving into backend
            const { calculateTotalCost, calculatePerformance } = await import('../data/modifiers');
            const totalCost = calculateTotalCost(car?.basePrice || 30000, mods);
            const performance = calculatePerformance(car?.baseHorsepower, car?.baseAcceleration, car?.baseTopSpeed, mods);

            await saveNewBuild({
                car: id,
                name: buildName,
                modifications: mods,
                totalCost,
                performance,
                isPublic,
            });
            setSaveSuccess(true);
            setTimeout(() => {
                setShowSaveModal(false);
                setSaveSuccess(false);
                setBuildName('');
                setIsPublic(false);
            }, 1500);
        } catch (error) {
            console.error('Error saving build:', error);
        }
        setSaving(false);
    };

    const handleDownloadImage = () => {
        const canvas = document.querySelector('canvas');
        if (canvas) {
            const dataUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = `${car?.name.replace(/\s+/g, '_')}_custom.png`;
            link.href = dataUrl;
            link.click();
        }
    };

    const tabs = [
        { id: 'paint', label: 'Paint', icon: <IoColorPaletteOutline size={16} /> },
        { id: 'wheels', label: 'Wheels', icon: <GiCarWheel size={16} /> },
        { id: 'spoiler', label: 'Spoiler', icon: <GiSpeedometer size={16} /> },
        { id: 'bodykit', label: 'Body Kit', icon: <IoSettingsOutline size={16} /> },
    ];

    if (loading || !car) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-16">
                <div className="w-12 h-12 border-4 border-accent-blue border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                {/* Header bar */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/cars')}
                            className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/[0.08] transition-all"
                        >
                            <FiChevronLeft size={18} />
                        </button>
                        <div>
                            <p className="text-[11px] text-accent-cyan font-heading tracking-[0.2em] uppercase">{car.brand}</p>
                            <h1 className="font-heading text-xl font-bold text-white leading-tight">{car.name}</h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[11px] text-gray-500 bg-white/[0.04] border border-white/[0.08] px-3 py-1.5 rounded-full">
                            {car.year}
                        </span>
                        <span className="text-[11px] text-gray-500 bg-white/[0.04] border border-white/[0.08] px-3 py-1.5 rounded-full">
                            {car.category}
                        </span>
                    </div>
                </div>

                {/* Main Layout — sidebar + preview */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* Left Panel — Controls */}
                    <div className="lg:col-span-4 xl:col-span-3 order-2 lg:order-1">
                        <div className="bg-dark-800 border border-white/[0.06] rounded-2xl p-5 lg:sticky lg:top-24">
                            {/* Tabs */}
                            <div className="grid grid-cols-4 gap-1 mb-6 bg-dark-700/60 rounded-xl p-1">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex flex-col items-center gap-1 py-2.5 px-1 rounded-lg text-[10px] font-semibold tracking-wide transition-all duration-300 ${activeTab === tab.id
                                                ? 'bg-accent-cyan text-dark-900 shadow-lg shadow-accent-cyan/20'
                                                : 'text-gray-500 hover:text-gray-300'
                                            }`}
                                    >
                                        {tab.icon}
                                        <span>{tab.label}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Tab Content */}
                            <div key={activeTab} className="animate-slide-up">
                                {activeTab === 'paint' && (
                                    <div>
                                        <h3 className="text-xs font-semibold text-gray-300 mb-4 tracking-wide uppercase">
                                            Paint Color
                                        </h3>
                                        <ColorPicker
                                            colors={car.availableColors}
                                            selectedColor={mods.paintColor}
                                            onColorChange={(color) => setMods({ ...mods, paintColor: color })}
                                        />
                                    </div>
                                )}

                                {activeTab === 'wheels' && (
                                    <div>
                                        <h3 className="text-xs font-semibold text-gray-300 mb-4 tracking-wide uppercase">
                                            Wheels & Rims
                                        </h3>
                                        <PartSelector
                                            parts={car.availableWheels}
                                            selectedPart={mods.wheels}
                                            onPartChange={(wheel) => setMods({ ...mods, wheels: wheel })}
                                            label="wheels"
                                        />
                                    </div>
                                )}

                                {activeTab === 'spoiler' && (
                                    <div>
                                        <h3 className="text-xs font-semibold text-gray-300 mb-4 tracking-wide uppercase">
                                            Rear Spoiler
                                        </h3>
                                        <PartSelector
                                            parts={car.availableSpoilers}
                                            selectedPart={mods.spoiler}
                                            onPartChange={(spoiler) => setMods({ ...mods, spoiler: spoiler })}
                                            label="spoiler"
                                        />
                                    </div>
                                )}

                                {activeTab === 'bodykit' && (
                                    <div>
                                        <h3 className="text-xs font-semibold text-gray-300 mb-4 tracking-wide uppercase">
                                            Body Kit
                                        </h3>
                                        <PartSelector
                                            parts={car.availableBodyKits}
                                            selectedPart={mods.bodyKit}
                                            onPartChange={(kit) => setMods({ ...mods, bodyKit: kit })}
                                            label="bodykit"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Panel — Car Preview */}
                    <div className="lg:col-span-8 xl:col-span-9 order-1 lg:order-2">
                        {/* Preview area */}
                        <div className="bg-dark-800 border border-white/[0.06] rounded-2xl p-6 lg:p-8">
                            <div className="flex items-center justify-center min-h-[300px] sm:min-h-[400px] lg:min-h-[460px] relative">
                                <ThreeDViewer
                                    modelUrl={car.modelUrl || null}
                                    paintColor={mods.paintColor}
                                    wheelType={mods.wheels}
                                    spoilerType={mods.spoiler}
                                    bodyKitType={mods.bodyKit}
                                />
                            </div>

                            {/* Action buttons */}
                            <div className="flex flex-wrap items-center justify-center gap-3 mt-6 pt-5 border-t border-white/[0.06]">
                                <button
                                    onClick={handleReset}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm text-gray-400 bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:text-white transition-all"
                                >
                                    <IoRefreshOutline size={15} /> Reset
                                </button>
                                <button
                                    onClick={() => setShowComparison(true)}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm text-gray-400 bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:text-white transition-all"
                                >
                                    <IoGitCompareOutline size={15} /> Compare
                                </button>
                                <button
                                    onClick={handleDownloadImage}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm text-gray-400 bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:text-white transition-all"
                                >
                                    <IoDownloadOutline size={15} /> Save Image
                                </button>
                                <button
                                    onClick={() => user ? setShowSaveModal(true) : navigate('/login')}
                                    className="btn-primary !py-2.5 !px-6 text-sm flex items-center gap-2"
                                >
                                    <IoSaveOutline size={15} /> Save Build
                                </button>
                            </div>
                        </div>

                        {/* Current Mods Summary */}
                        <div className="bg-dark-800 border border-white/[0.06] rounded-2xl px-5 py-4 mt-4">
                            <h3 className="text-[10px] font-semibold text-gray-500 tracking-[0.2em] uppercase mb-3">Current Modifications</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-7 h-7 rounded-lg shrink-0" style={{ backgroundColor: mods.paintColor, border: '2px solid rgba(255,255,255,0.1)' }}></div>
                                    <div className="min-w-0">
                                        <p className="text-[9px] text-gray-600 uppercase tracking-wider">Paint</p>
                                        <p className="text-[11px] text-gray-300 font-mono truncate">{mods.paintColor}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[9px] text-gray-600 uppercase tracking-wider">Wheels</p>
                                    <p className="text-[11px] text-gray-300 capitalize">{mods.wheels.replace(/-/g, ' ')}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] text-gray-600 uppercase tracking-wider">Spoiler</p>
                                    <p className="text-[11px] text-gray-300 capitalize">{mods.spoiler.replace(/-/g, ' ')}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] text-gray-600 uppercase tracking-wider">Body Kit</p>
                                    <p className="text-[11px] text-gray-300 capitalize">{mods.bodyKit.replace(/-/g, ' ')}</p>
                                </div>
                            </div>
                        </div>

                        {/* Cost & Performance Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <CostCalculator basePrice={car?.basePrice || 30000} mods={mods} />
                            <PerformanceStats 
                                baseHp={car?.baseHorsepower || 300} 
                                baseAccel={car?.baseAcceleration || 4.5} 
                                baseSpeed={car?.baseTopSpeed || 155} 
                                mods={mods} 
                            />
                        </div>
                        
                        {/* AI Assistant */}
                        <div className="mt-4">
                            <AIAssistant onApplySuggestions={handleApplyAISuggestions} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Comparison Modal */}
            {showComparison && (
                <ComparisonView
                    carImage={car.image}
                    originalColor={car.defaultColor}
                    modifiedColor={mods.paintColor}
                    onClose={() => setShowComparison(false)}
                />
            )}

            {/* Save Modal */}
            {showSaveModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
                    <div className="bg-dark-800 border border-white/[0.08] rounded-2xl p-6 max-w-sm w-full animate-slide-up">
                        {saveSuccess ? (
                            <div className="text-center py-6">
                                <div className="w-14 h-14 rounded-full bg-green-500/15 flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-7 h-7 text-green-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h3 className="font-heading text-lg font-bold text-white">Build Saved!</h3>
                                <p className="text-gray-500 text-sm mt-1">Find it in your dashboard</p>
                            </div>
                        ) : (
                            <>
                                <h3 className="font-heading text-lg font-bold text-white mb-1">Save Your Build</h3>
                                <p className="text-gray-500 text-sm mb-5">Give your creation a name</p>
                                <input
                                    type="text"
                                    value={buildName}
                                    onChange={(e) => setBuildName(e.target.value)}
                                    className="input-field mb-4"
                                    placeholder="e.g. Midnight Mustang"
                                    autoFocus
                                    id="build-name-input"
                                />
                                <div className="flex items-center gap-3 mb-6 bg-dark-900 border border-white/[0.04] p-3 rounded-xl">
                                    <input 
                                        type="checkbox" 
                                        id="public-toggle" 
                                        checked={isPublic} 
                                        onChange={(e) => setIsPublic(e.target.checked)} 
                                        className="w-4 h-4 rounded text-accent-cyan border-white/[0.2] bg-dark-700 focus:ring-accent-cyan focus:ring-offset-dark-800"
                                    />
                                    <label htmlFor="public-toggle" className="text-sm text-gray-400 cursor-pointer select-none">
                                        Make this build public (Community can view and vote)
                                    </label>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowSaveModal(false)}
                                        className="flex-1 py-2.5 px-4 text-sm text-gray-400 bg-white/[0.04] border border-white/[0.08] rounded-xl hover:bg-white/[0.08] transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={saving || !buildName.trim()}
                                        className="btn-primary flex-1 !py-2.5 text-sm disabled:opacity-40"
                                    >
                                        {saving ? 'Saving...' : 'Save'}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Customize;
