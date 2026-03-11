import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getPublicBuilds, likeBuild } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FiHeart, FiMessageSquare, FiTrendingUp } from 'react-icons/fi';
import { IoCarSportOutline } from 'react-icons/io5';

const Community = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [builds, setBuilds] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPublicBuilds();
    }, []);

    const fetchPublicBuilds = async () => {
        try {
            const res = await getPublicBuilds();
            setBuilds(res.data);
        } catch (error) {
            console.error('Error fetching public builds:', error);
        }
        setLoading(false);
    };

    const handleLike = async (buildId, e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!user) {
            navigate('/login');
            return;
        }

        try {
            const res = await likeBuild(buildId);
            // res.data is the new array of likes (user IDs)
            setBuilds(builds.map(b => {
                if (b._id === buildId) {
                    return { ...b, likes: res.data };
                }
                return b;
            }));
        } catch (error) {
            console.error('Error liking build:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-16">
                <div className="w-12 h-12 border-4 border-accent-blue border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    // Top Builds of the Week (Mocked as top 3 most liked)
    const topBuilds = [...builds].sort((a, b) => b.likes.length - a.likes.length).slice(0, 3);

    return (
        <div className="min-h-screen pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Header */}
                <div className="text-center mb-12">
                     <p className="text-accent-cyan font-heading text-xs tracking-[0.3em] mb-3 uppercase">Community</p>
                     <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">
                         Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-accent-blue">Amazing Builds</span>
                     </h1>
                     <p className="text-gray-400 max-w-xl mx-auto">Explore creations from other users. Rate, comment, and get inspired for your next project.</p>
                </div>

                {/* Top Builds Section */}
                {topBuilds.length > 0 && (
                    <div className="mb-16">
                        <div className="flex items-center gap-3 mb-6">
                            <FiTrendingUp className="text-accent-orange text-xl" />
                            <h2 className="text-xl font-heading font-bold text-white">Top Builds of the Week</h2>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {topBuilds.map((build, index) => (
                                <Link 
                                    to={`/build/${build._id}`} 
                                    key={`top-${build._id}`}
                                    className={`relative glass rounded-2xl overflow-hidden card-hover animate-slide-up group ${index === 0 ? 'lg:col-span-2 lg:row-span-2 ring-1 ring-accent-orange/30' : ''}`}
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <div className={`p-6 bg-gradient-to-br from-dark-800 flex items-center justify-center relative ${index === 0 ? 'h-64 lg:h-full to-dark-700/50' : 'h-48 to-dark-800'}`}>
                                         {index === 0 && (
                                             <div className="absolute top-4 left-4 bg-accent-orange/20 border border-accent-orange/30 text-accent-orange text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 uppercase tracking-wider backdrop-blur-md z-10">
                                                 <span className="w-1.5 h-1.5 rounded-full bg-accent-orange animate-pulse"></span>
                                                 #1 Trending
                                             </div>
                                         )}
                                         <img
                                            src={build.car?.image}
                                            alt={build.car?.name}
                                            className={`w-full h-full object-contain transition-transform duration-700 group-hover:scale-105 group-hover:rotate-1`}
                                            style={{ filter: `drop-shadow(0 10px 20px rgba(0,0,0,0.5))` }}
                                        />
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-dark-900 via-dark-900/90 to-transparent pt-12">
                                        <div className="flex items-end justify-between">
                                            <div>
                                                <h3 className={`font-heading font-bold text-white mb-1 ${index === 0 ? 'text-xl' : 'text-md'}`}>{build.name}</h3>
                                                <p className="text-xs text-gray-400">by <span className="text-gray-300">{build.user?.name}</span></p>
                                            </div>
                                            <div className="flex gap-3 text-sm">
                                                <button onClick={(e) => handleLike(build._id, e)} className="flex items-center gap-1.5 text-gray-400 hover:text-accent-orange transition-colors">
                                                    <FiHeart className={user && build.likes?.includes(user._id) ? 'fill-accent-orange text-accent-orange' : ''} />
                                                    <span className="text-xs">{build.likes?.length || 0}</span>
                                                </button>
                                                <div className="flex items-center gap-1.5 text-gray-400">
                                                    <FiMessageSquare />
                                                    <span className="text-xs">{build.comments?.length || 0}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* All Public Builds Grid */}
                <div>
                    <h2 className="text-lg font-heading font-bold text-white mb-6">Recent Creations</h2>
                    
                    {builds.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            {builds.map((build, index) => (
                                <Link
                                    to={`/build/${build._id}`}
                                    key={build._id}
                                    className="glass rounded-xl overflow-hidden card-hover animate-slide-up group"
                                    style={{ animationDelay: `${index * 0.05}s` }}
                                >
                                    <div className="relative h-40 flex items-center justify-center p-4 bg-gradient-to-br from-dark-800 to-dark-800/50">
                                        <img
                                            src={build.car?.image}
                                            alt={build.car?.name}
                                            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                                            style={{ filter: `drop-shadow(0 4px 10px rgba(0,0,0,0.4))` }}
                                        />
                                    </div>
                                    <div className="p-4 border-t border-white/[0.04] bg-dark-900/30">
                                        <h3 className="font-heading text-sm font-semibold text-white truncate mb-1">{build.name}</h3>
                                        <p className="text-[10px] text-gray-500 mb-3 truncate hover:text-gray-400">
                                            {build.car?.brand} {build.car?.name}
                                        </p>
                                        
                                        <div className="flex items-center justify-between">
                                            <div className="flex gap-2.5">
                                                <button onClick={(e) => handleLike(build._id, e)} className="flex items-center gap-1 text-gray-400 hover:text-accent-orange transition-colors">
                                                    <FiHeart size={12} className={user && build.likes?.includes(user._id) ? 'fill-accent-orange text-accent-orange' : ''} />
                                                    <span className="text-[11px]">{build.likes?.length || 0}</span>
                                                </button>
                                                <div className="flex items-center gap-1 text-gray-400">
                                                    <FiMessageSquare size={12} />
                                                    <span className="text-[11px]">{build.comments?.length || 0}</span>
                                                </div>
                                            </div>
                                            <span className="text-[10px] text-gray-600 bg-white/[0.03] px-2 py-0.5 rounded-full">{build.user?.name.split(' ')[0]}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-dark-800 border border-white/[0.04] rounded-2xl">
                            <IoCarSportOutline className="text-5xl text-gray-600 mx-auto mb-4" />
                            <h3 className="font-heading text-lg font-semibold text-gray-400 mb-2">No public builds yet</h3>
                            <p className="text-gray-500 mb-6">Be the first to share your creation with the community!</p>
                            <Link to="/cars" className="btn-primary">Start Customizing</Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Community;
