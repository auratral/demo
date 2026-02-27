import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShieldCheck, ChevronDown, LogOut, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const { user, logout, updateProfilePicture } = useAuth();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handlePictureChange = () => {
        const newUrl = prompt("Enter new avatar image URL (e.g. https://github.com/identicons/user.png):");
        if (newUrl) {
            updateProfilePicture(newUrl);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className={`navbar ${scrolled ? 'scrolled glass-panel' : ''}`}>
            <div className="navbar-container">
                {/* Logo */}
                <Link to="/" className="navbar-logo flex items-center">
                    <img src={`${import.meta.env.BASE_URL}logo.png`} alt="Auratral" className="h-8 w-auto mix-blend-screen" />
                </Link>

                {/* Navigation Links */}
                <div className="navbar-links">
                    <Link to="/gallery">Dataset Gallery</Link>
                    <Link to="/custom-request">Custom Request</Link>
                    <Link to="/news">News</Link>
                </div>

                {/* Search Bar */}
                <div className="navbar-search">
                    <Search size={16} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search datasets, ICD codes..."
                        className="search-input"
                    />
                </div>

                {/* Compliance Badges - Very Important for Medical */}
                <div className="navbar-compliance">
                    <ShieldCheck size={16} className="text-blue-400" />
                    <span>HIPAA / GDPR / DPDP Ready</span>
                </div>

                {/* CTAs */}
                <div className="navbar-actions">
                    {user ? (
                        <div className="relative">
                            <button
                                onClick={() => setMenuOpen(!menuOpen)}
                                className="flex items-center gap-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 p-1.5 pr-3 rounded-full transition-all"
                            >
                                <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full border border-slate-600 bg-black/20 object-cover" />
                                <span className="text-sm font-semibold text-slate-200 hidden sm:block">{user.name}</span>
                                <ChevronDown size={14} className="text-slate-400" />
                            </button>

                            {/* Dropdown Menu */}
                            {menuOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden z-50 text-left">
                                    <div className="p-3 border-b border-slate-700">
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user.role}</div>
                                        <div className="text-sm font-bold text-primary truncate">{user.name}</div>
                                    </div>
                                    <div className="p-1">
                                        <button
                                            onClick={() => { setMenuOpen(false); navigate(user.role === 'consumer' ? '/dashboard' : '/provider-dashboard'); }}
                                            className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-700/50 hover:text-white rounded-lg transition-colors flex items-center gap-2"
                                        >
                                            Dashboard
                                        </button>
                                        <button
                                            onClick={() => { setMenuOpen(false); handlePictureChange(); }}
                                            className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-700/50 hover:text-white rounded-lg transition-colors flex items-center gap-2"
                                        >
                                            <ImageIcon size={14} /> Change Picture
                                        </button>
                                        <div className="h-px bg-slate-700 my-1"></div>
                                        <button
                                            onClick={() => { setMenuOpen(false); handleLogout(); }}
                                            className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors flex items-center gap-2 font-semibold"
                                        >
                                            <LogOut size={14} /> Log Out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-outline">Log In</Link>
                            <Link to="/signup" className="btn btn-primary">Sign Up</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
