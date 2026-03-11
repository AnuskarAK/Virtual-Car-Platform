import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBuildById, likeBuild, commentBuild } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ThreeDViewer from '../components/ThreeDViewer';
import CostCalculator from '../components/CostCalculator';
import PerformanceStats from '../components/PerformanceStats';
import { FiChevronLeft, FiShare2, FiHeart } from 'react-icons/fi';

const ViewBuild = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [build, setBuild] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [commentText, setCommentText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchBuild = async () => {
            try {
                const res = await getBuildById(id);
                setBuild(res.data);
            } catch (err) {
                console.error(err);
                setError('Build not found or is private.');
            }
            setLoading(false);
        };
        fetchBuild();
    }, [id]);

    const handleLike = async () => {
        if (!user) return alert('Please login to like builds');
        try {
            const res = await likeBuild(id);
            setBuild({ ...build, likes: res.data });
        } catch (err) {
            console.error(err);
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!user) return alert('Please login to comment');
        if (!commentText.trim()) return;
        
        setIsSubmitting(true);
        try {
            const res = await commentBuild(id, commentText);
            setBuild({ ...build, comments: res.data });
            setCommentText('');
        } catch (err) {
            console.error(err);
        }
        setIsSubmitting(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-16">
                <div className="w-12 h-12 border-4 border-accent-blue border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error || !build) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center pt-16 text-center px-4">
                <h2 className="text-2xl font-heading font-bold text-white mb-2">Oops!</h2>
                <p className="text-gray-400 mb-6">{error}</p>
                <Link to="/community" className="btn-primary">Browse Public Builds</Link>
            </div>
        );
    }

    const shareUrl = window.location.href;

    return (
        <div className="min-h-screen pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                {/* Header bar */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link
                            to="/community"
                            className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/[0.08] transition-all"
                        >
                            <FiChevronLeft size={18} />
                        </Link>
                        <div>
                            <p className="text-[11px] text-accent-cyan font-heading tracking-[0.2em] uppercase">
                                {build.car?.brand} {build.car?.name}
                            </p>
                            <h1 className="font-heading text-2xl font-bold text-white leading-tight flex items-center gap-3">
                                {build.name}
                            </h1>
                            <p className="text-xs text-gray-400 mt-1">Built by {build.user?.name || 'Unknown'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={handleLike}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${user && build.likes?.includes(user._id) ? 'bg-accent-orange/10 text-accent-orange border border-accent-orange/30' : 'text-white bg-white/[0.05] border border-white/[0.1] hover:bg-white/[0.1]'}`}
                        >
                            <FiHeart className={user && build.likes?.includes(user._id) ? 'fill-accent-orange' : ''} />
                            {build.likes?.length || 0}
                        </button>
                        <button 
                            onClick={() => {
                                navigator.clipboard.writeText(shareUrl);
                                alert('Link copied!');
                            }}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white bg-white/[0.05] border border-white/[0.1] hover:bg-white/[0.1] transition-colors"
                        >
                            <FiShare2 /> Share
                        </button>
                    </div>
                </div>

                {/* Main 3D View & Stats */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Viewer */}
                    <div className="lg:col-span-8 bg-dark-800 border border-white/[0.06] rounded-2xl p-6 lg:p-8">
                        <div className="flex items-center justify-center min-h-[400px] sm:min-h-[500px] relative">
                            <ThreeDViewer
                                modelUrl={build.car?.modelUrl || null}
                                paintColor={build.modifications.paintColor}
                                wheelType={build.modifications.wheels}
                                spoilerType={build.modifications.spoiler}
                                bodyKitType={build.modifications.bodyKit}
                            />
                        </div>
                    </div>

                    {/* Sidebar Stats */}
                    <div className="lg:col-span-4 flex flex-col gap-6">
                        {/* Summary */}
                        <div className="bg-dark-800 border border-white/[0.06] rounded-2xl p-5">
                             <h3 className="text-[10px] font-semibold text-gray-500 tracking-[0.2em] uppercase mb-4">Modifications</h3>
                             <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-6 h-6 rounded-lg shrink-0" style={{ backgroundColor: build.modifications.paintColor, border: '2px solid rgba(255,255,255,0.1)' }}></div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] text-gray-400 uppercase tracking-wider">Paint</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">Wheels</p>
                                    <p className="text-xs text-white capitalize truncate">{build.modifications.wheels.replace(/-/g, ' ')}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">Spoiler</p>
                                    <p className="text-xs text-white capitalize truncate">{build.modifications.spoiler.replace(/-/g, ' ')}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">Body Kit</p>
                                    <p className="text-xs text-white capitalize truncate">{build.modifications.bodyKit.replace(/-/g, ' ')}</p>
                                </div>
                            </div>
                        </div>

                        <PerformanceStats 
                            baseHp={build.car?.baseHorsepower} 
                            baseAccel={build.car?.baseAcceleration} 
                            baseSpeed={build.car?.baseTopSpeed} 
                            mods={build.modifications} 
                        />

                        {build.totalCost > 0 && (
                            <CostCalculator basePrice={build.car?.basePrice} mods={build.modifications} />
                        )}

                        {/* Comments Section */}
                        <div className="bg-dark-800 border border-white/[0.06] rounded-2xl p-5 flex-1 flex flex-col">
                            <h3 className="text-[10px] font-semibold text-gray-500 tracking-[0.2em] uppercase mb-4">Discussion ({build.comments?.length || 0})</h3>
                            
                            <div className="flex-1 overflow-y-auto max-h-60 mb-4 space-y-4 pr-2 custom-scrollbar">
                                {build.comments?.length > 0 ? (
                                    build.comments.map((c, i) => (
                                        <div key={i} className="bg-dark-900 border border-white/[0.04] p-3 rounded-xl">
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="text-[11px] font-semibold text-gray-300">{c.user?.name || 'User'}</span>
                                                <span className="text-[9px] text-gray-600">{new Date(c.date).toLocaleDateString()}</span>
                                            </div>
                                            <p className="text-xs text-gray-400 leading-relaxed">{c.text}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500 text-center py-6">No comments yet. Be the first!</p>
                                )}
                            </div>

                            {user ? (
                                <form onSubmit={handleComment} className="mt-auto relative">
                                    <input 
                                        type="text" 
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        placeholder="Add a comment..."
                                        className="w-full bg-dark-900 border border-white/[0.08] rounded-xl py-3 px-4 pr-20 text-sm text-white focus:outline-none focus:border-accent-cyan transition-colors placeholder:text-gray-600"
                                    />
                                    <button 
                                        type="submit"
                                        disabled={isSubmitting || !commentText.trim()}
                                        className="absolute right-2 top-2 bottom-2 px-3 bg-accent-cyan/10 text-accent-cyan rounded-lg text-xs font-semibold hover:bg-accent-cyan/20 transition-colors disabled:opacity-50"
                                    >
                                        Post
                                    </button>
                                </form>
                            ) : (
                                <div className="mt-auto bg-dark-900 border border-white/[0.04] rounded-xl p-3 text-center">
                                    <p className="text-xs text-gray-500"><Link to="/login" className="text-accent-cyan underline">Log in</Link> to join the discussion</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewBuild;
