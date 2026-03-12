import { useEffect, useState } from 'react';

// ARViewer uses Google's <model-viewer> to handle native AR Quick Look (iOS) and Scene Viewer (Android)
const ARViewer = ({ modelUrl, onClose }) => {
    const [scriptLoaded, setScriptLoaded] = useState(false);

    useEffect(() => {
        // Dynamically inject the model-viewer script
        const script = document.createElement('script');
        script.type = 'module';
        script.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.1.1/model-viewer.min.js';
        script.onload = () => setScriptLoaded(true);
        document.head.appendChild(script);

        return () => {
            document.head.removeChild(script);
        };
    }, []);

    if (!modelUrl) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
                <div className="bg-dark-800 rounded-2xl p-6 max-w-sm w-full text-center">
                    <h3 className="text-xl font-bold text-white mb-2">AR Not Available</h3>
                    <p className="text-gray-400 mb-6">This car model does not have a 3D asset compatible with AR.</p>
                    <button onClick={onClose} className="btn-primary w-full">Close</button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center pt-10">
            <button 
                onClick={onClose}
                className="absolute top-6 right-6 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors z-50"
            >
                ✕
            </button>
            <div className="w-full h-full max-h-[80vh] relative">
                {scriptLoaded && (
                    <model-viewer
                        src={modelUrl}
                        ios-src={modelUrl} // Ideally a .usdz file
                        ar
                        ar-modes="webxr scene-viewer quick-look"
                        camera-controls
                        auto-rotate
                        shadow-intensity="1"
                        style={{ width: '100%', height: '100%' }}
                    >
                        <div className="w-full h-full flex items-center justify-center" slot="poster">
                            <div className="w-10 h-10 border-4 border-accent-cyan border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        <button 
                            slot="ar-button" 
                            className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-accent-cyan text-dark-900 px-6 py-3 rounded-xl font-bold tracking-wide shadow-lg shadow-accent-cyan/20 animate-pulse"
                        >
                            View in your space
                        </button>
                    </model-viewer>
                )}
            </div>
            <div className="mt-6 text-center pb-8 px-4">
                <p className="text-sm text-gray-400">Scan your environment to place the car.</p>
                <p className="text-xs text-gray-500 mt-1">Requires an AR-compatible mobile device.</p>
            </div>
        </div>
    );
};

export default ARViewer;
