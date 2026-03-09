import { Link } from 'react-router-dom';
import { IoCarSportOutline } from 'react-icons/io5';
import { FiGithub, FiMail, FiHeart } from 'react-icons/fi';

const Footer = () => {
    return (
        <footer className="bg-dark-800 border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Brand */}
                    <div>
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            <IoCarSportOutline className="text-2xl text-accent-cyan" />
                            <span className="font-heading text-lg font-bold gradient-text tracking-wider">MODSHIFT</span>
                        </Link>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Design. Customize. Visualize.<br />
                            The ultimate virtual car modification platform.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-heading text-sm font-semibold text-gray-300 tracking-wider mb-4">NAVIGATE</h3>
                        <div className="space-y-2">
                            <Link to="/" className="block text-gray-500 hover:text-accent-cyan text-sm transition-colors">Home</Link>
                            <Link to="/cars" className="block text-gray-500 hover:text-accent-cyan text-sm transition-colors">Browse Cars</Link>
                            <Link to="/dashboard" className="block text-gray-500 hover:text-accent-cyan text-sm transition-colors">My Builds</Link>
                        </div>
                    </div>

                    {/* Connect */}
                    <div>
                        <h3 className="font-heading text-sm font-semibold text-gray-300 tracking-wider mb-4">CONNECT</h3>
                        <div className="flex gap-4">
                            <a href="#" className="text-gray-500 hover:text-accent-cyan transition-colors" aria-label="GitHub">
                                <FiGithub size={20} />
                            </a>
                            <a href="#" className="text-gray-500 hover:text-accent-cyan transition-colors" aria-label="Email">
                                <FiMail size={20} />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-gray-600 text-xs">
                        &copy; {new Date().getFullYear()} ModShift. All rights reserved.
                    </p>
                    <p className="text-gray-600 text-xs flex items-center gap-1">
                        Built with <FiHeart className="text-accent-red" size={12} /> for car enthusiasts
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
