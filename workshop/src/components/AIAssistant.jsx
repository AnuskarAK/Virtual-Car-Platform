import { useState, useRef } from 'react';
import { FiUploadCloud, FiCpu, FiCheckCircle } from 'react-icons/fi';
import { getAiSuggestions } from '../services/api';

const AIAssistant = ({ onApplySuggestions }) => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState(null);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected) {
            setFile(selected);
            setSuggestions(null);
            setError('');
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setLoading(true);
        setError('');
        
        try {
            // In a real app, use FormData for file uploads:
            // const formData = new FormData();
            // formData.append('image', file);
            // const res = await getAiSuggestions(formData);

            // Mucking it for now by just calling the API without actual file parsing
            const res = await getAiSuggestions({ fileName: file.name });
            setSuggestions(res.data.suggestions);
        } catch (err) {
            console.error('AI Suggestion Error:', err);
            setError('Failed to get suggestions. Please try again.');
        }
        setLoading(false);
    };

    return (
        <div className="bg-dark-800 border-2 border-accent-cyan/20 rounded-2xl p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-cyan/10 blur-[50px] rounded-full pointer-events-none"></div>
            
            <div className="flex items-center gap-2 mb-4">
                <FiCpu className="text-accent-cyan text-xl" />
                <h3 className="font-heading font-bold text-white tracking-wide">AI Designer</h3>
            </div>
            
            {!suggestions ? (
                <>
                    <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                        Upload an inspiration photo (like a real car or a game screenshot) and let our AI suggest the best modifications to match that style.
                    </p>
                    
                    <div 
                        className="border-2 border-dashed border-white/[0.1] hover:border-accent-cyan/50 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors mb-4 group"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleFileChange} 
                            accept="image/*" 
                            className="hidden" 
                        />
                        <div className="w-10 h-10 rounded-full bg-white/[0.05] group-hover:bg-accent-cyan/10 flex items-center justify-center mb-3 transition-colors">
                            <FiUploadCloud className="text-gray-400 group-hover:text-accent-cyan text-xl" />
                        </div>
                        {file ? (
                            <p className="text-sm font-medium text-accent-cyan truncate max-w-full">{file.name}</p>
                        ) : (
                            <>
                                <p className="text-sm font-medium text-white mb-1">Click to upload image</p>
                                <p className="text-[10px] text-gray-500 uppercase tracking-wider">PNG, JPG up to 5MB</p>
                            </>
                        )}
                    </div>
                    
                    {error && <p className="text-xs text-red-400 mb-3">{error}</p>}
                    
                    <button 
                        onClick={handleUpload}
                        disabled={!file || loading}
                        className="w-full btn-primary !py-2.5 text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Analyzing Image...
                            </>
                        ) : (
                            <>
                                <span className="relative z-10">Generate Ideas</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-accent-cyan via-accent-blue to-accent-cyan opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[length:200%_auto] animate-gradient"></div>
                            </>
                        )}
                    </button>
                </>
            ) : (
                <div className="space-y-4 animate-slide-up">
                    <p className="text-xs text-gray-400 mb-2 font-medium">AI Suggestions based on your image:</p>
                    
                    {suggestions.map((suggestion, index) => (
                        <div key={index} className="bg-dark-900 border border-white/[0.06] rounded-xl p-4 hover:border-accent-cyan/30 transition-colors">
                            <h4 className="font-heading text-sm font-bold text-white mb-1">{suggestion.theme}</h4>
                            <p className="text-[11px] text-gray-400 mb-3">{suggestion.description}</p>
                            
                            <div className="flex flex-wrap gap-2 mb-4">
                                <div className="flex items-center gap-1 text-[10px] bg-white/[0.04] px-2 py-1 rounded">
                                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: suggestion.modifications.paintColor }}></span>
                                    <span className="text-gray-300">Paint</span>
                                </div>
                                <div className="text-[10px] text-gray-300 bg-white/[0.04] px-2 py-1 rounded capitalize">
                                    <span className="text-gray-500 mr-1">Wheels:</span>{suggestion.modifications.wheels.replace(/-/g, ' ')}
                                </div>
                            </div>
                            
                            <button 
                                onClick={() => onApplySuggestions(suggestion.modifications)}
                                className="w-full py-2 bg-white/[0.05] hover:bg-accent-cyan/10 border border-white/[0.1] hover:border-accent-cyan/30 text-accent-cyan text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5"
                            >
                                <FiCheckCircle /> Apply Build
                            </button>
                        </div>
                    ))}
                    
                    <button 
                        onClick={() => { setSuggestions(null); setFile(null); }}
                        className="w-full text-center text-xs text-gray-500 hover:text-white transition-colors mt-2"
                    >
                        Upload a different image
                    </button>
                </div>
            )}
        </div>
    );
};

export default AIAssistant;
