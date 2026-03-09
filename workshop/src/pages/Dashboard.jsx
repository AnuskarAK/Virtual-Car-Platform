import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getBuilds, deleteBuild } from '../services/api';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import { IoCarSportOutline } from 'react-icons/io5';

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [builds, setBuilds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState(null);

    useEffect(() => {
        fetchBuilds();
    }, []);

    const fetchBuilds = async () => {
        try {
            const res = await getBuilds();
            setBuilds(res.data);
        } catch (error) {
            console.error('Error fetching builds:', error);
        }
        setLoading(false);
    };

    const handleDelete = async (id) => {
        try {
            await deleteBuild(id);
            setBuilds(builds.filter(b => b._id !== id));
            setDeleteId(null);
        } catch (error) {
            console.error('Error deleting build:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-16">
                <div className="w-12 h-12 border-4 border-accent-blue border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
                    <div>
                        <p className="text-accent-cyan font-heading text-xs tracking-[0.3em] mb-2 uppercase">Dashboard</p>
                        <h1 className="text-3xl font-heading font-bold text-white">
                            Welcome, {user?.name}
                        </h1>
                        <p className="text-gray-400 mt-1">Manage your saved car builds</p>
                    </div>
                    <Link to="/cars" className="btn-primary flex items-center gap-2 text-sm">
                        <FiPlus size={16} /> New Build
                    </Link>
                </div>

                {/* Builds Grid */}
                {builds.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {builds.map((build, index) => (
                            <div
                                key={build._id}
                                className="glass rounded-2xl overflow-hidden card-hover animate-slide-up"
                                style={{ animationDelay: `${index * 0.08}s` }}
                            >
                                {/* Car Preview */}
                                <div className="relative h-44 flex items-center justify-center p-6 bg-gradient-to-br from-dark-700 to-dark-800">
                                    <img
                                        src={build.car?.image}
                                        alt={build.car?.name}
                                        className="w-full h-full object-contain"
                                        style={{
                                            filter: `drop-shadow(0 4px 15px rgba(0,0,0,0.3))`,
                                        }}
                                    />
                                    {/* Color badge */}
                                    <div
                                        className="absolute top-3 right-3 w-6 h-6 rounded-full border-2 border-white/20"
                                        style={{ backgroundColor: build.modifications?.paintColor || '#808080' }}
                                    ></div>
                                </div>

                                {/* Info */}
                                <div className="p-5">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-heading text-sm font-semibold text-white">{build.name}</h3>
                                    </div>
                                    <p className="text-xs text-gray-500 mb-4">
                                        {build.car?.brand} {build.car?.name}
                                    </p>

                                    {/* Mods summary */}
                                    <div className="flex flex-wrap gap-1.5 mb-4">
                                        {build.modifications?.wheels !== 'stock' && (
                                            <span className="text-[10px] bg-accent-blue/10 text-accent-cyan px-2 py-0.5 rounded-full">
                                                {build.modifications.wheels}
                                            </span>
                                        )}
                                        {build.modifications?.spoiler !== 'none' && (
                                            <span className="text-[10px] bg-accent-purple/10 text-accent-purple px-2 py-0.5 rounded-full">
                                                {build.modifications.spoiler}
                                            </span>
                                        )}
                                        {build.modifications?.bodyKit !== 'stock' && (
                                            <span className="text-[10px] bg-accent-orange/10 text-accent-orange px-2 py-0.5 rounded-full">
                                                {build.modifications.bodyKit}
                                            </span>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => navigate(`/customize/${build.car?._id}`)}
                                            className="flex-1 btn-secondary !py-2 text-xs flex items-center justify-center gap-1.5"
                                        >
                                            <FiEdit2 size={12} /> Edit
                                        </button>
                                        <button
                                            onClick={() => setDeleteId(build._id)}
                                            className="glass !border-red-500/20 hover:!bg-red-500/10 !py-2 !px-3 rounded-xl text-red-400 transition-colors"
                                        >
                                            <FiTrash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <IoCarSportOutline className="text-5xl text-gray-600 mx-auto mb-4" />
                        <h3 className="font-heading text-lg font-semibold text-gray-400 mb-2">No builds yet</h3>
                        <p className="text-gray-500 mb-6">Start customizing a car to save your first build</p>
                        <Link to="/cars" className="btn-primary">
                            Browse Cars
                        </Link>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {deleteId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                    <div className="glass rounded-2xl p-6 max-w-sm w-full mx-4 animate-slide-up">
                        <h3 className="font-heading text-lg font-bold text-white mb-2">Delete Build?</h3>
                        <p className="text-gray-400 text-sm mb-6">This action cannot be undone.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteId(null)} className="btn-secondary flex-1 !py-2.5 text-sm">
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(deleteId)}
                                className="flex-1 py-2.5 px-4 bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl text-sm font-semibold hover:bg-red-500/30 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
