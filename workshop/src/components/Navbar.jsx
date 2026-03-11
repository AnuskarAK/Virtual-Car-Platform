import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMenu, FiX, FiLogOut, FiUser } from 'react-icons/fi';
import { IoCarSportOutline } from 'react-icons/io5';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const navLinks = [
        { to: '/', label: 'Home' },
        { to: '/cars', label: 'Cars' },
        { to: '/community', label: 'Community' },
        ...(user ? [{ to: '/dashboard', label: 'My Builds' }] : []),
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50" style={{
            background: 'rgba(10, 10, 15, 0.85)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2.5 group shrink-0">
                        <IoCarSportOutline className="text-2xl text-accent-cyan group-hover:text-accent-blue transition-colors" />
                        <span className="font-heading text-lg font-bold gradient-text tracking-wider">
                            MODSHIFT
                        </span>
                    </Link>

                    {/* Desktop Nav — centered */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={`text-sm font-medium transition-all duration-300 hover:text-accent-cyan relative py-1 ${isActive(link.to)
                                        ? 'text-accent-cyan'
                                        : 'text-gray-400'
                                    }`}
                            >
                                {link.label}
                                {isActive(link.to) && (
                                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-cyan rounded-full"></span>
                                )}
                            </Link>
                        ))}
                    </div>

                    {/* Auth Buttons */}
                    <div className="hidden md:flex items-center gap-3 shrink-0">
                        {user ? (
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 text-sm text-gray-300">
                                    <div className="w-7 h-7 rounded-full bg-accent-blue/20 flex items-center justify-center">
                                        <FiUser className="text-accent-cyan text-xs" />
                                    </div>
                                    <span className="max-w-[120px] truncate">{user.name}</span>
                                </div>
                                <button
                                    onClick={logout}
                                    className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-400 transition-colors"
                                >
                                    <FiLogOut size={14} />
                                    <span>Logout</span>
                                </button>
                            </div>
                        ) : (
                            <>
                                {location.pathname !== '/login' && (
                                    <Link to="/login" className="text-sm text-gray-400 hover:text-white transition-colors px-4 py-2">
                                        Login
                                    </Link>
                                )}
                                {location.pathname !== '/register' && (
                                    <Link to="/register" className="btn-primary !py-2 !px-5 text-sm">
                                        Sign Up
                                    </Link>
                                )}
                            </>
                        )}
                    </div>

                    {/* Mobile menu toggle */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="md:hidden text-gray-300 hover:text-accent-cyan transition-colors p-1"
                    >
                        {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden border-t border-white/5" style={{
                    background: 'rgba(10, 10, 15, 0.95)',
                    backdropFilter: 'blur(16px)',
                }}>
                    <div className="px-6 py-5 space-y-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                onClick={() => setMenuOpen(false)}
                                className={`block py-2.5 text-sm font-medium rounded-lg px-3 transition-colors ${isActive(link.to)
                                        ? 'text-accent-cyan bg-white/5'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="pt-4 mt-3 border-t border-white/10">
                            {user ? (
                                <button
                                    onClick={() => { logout(); setMenuOpen(false); }}
                                    className="text-sm text-gray-400 hover:text-red-400 py-2.5 px-3"
                                >
                                    Logout
                                </button>
                            ) : (
                                <div className="flex gap-3 px-3">
                                    <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-secondary !py-2 !px-5 text-sm">
                                        Login
                                    </Link>
                                    <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-primary !py-2 !px-5 text-sm">
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
