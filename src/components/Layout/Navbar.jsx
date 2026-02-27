import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShieldCheck, ChevronDown, LogOut, Image as ImageIcon, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const { user, logout, updateProfilePicture } = useAuth();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [mobileNavOpen, setMobileNavOpen] = useState(false);

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

    // Close mobile nav when clicking a link
    const handleMobileLinkClick = () => {
        setMobileNavOpen(false);
    };

    return (
        <nav className={`navbar ${scrolled ? 'scrolled glass-panel' : ''}`}>
            <div className="navbar-container">
                {/* Logo */}
                <Link to="/" className="navbar-logo flex items-center shrink-0">
                    <img src={`${import.meta.env.BASE_URL}logo.png`} alt="Auratral" className="h-8 w-auto mix-blend-screen" />
                </Link>

                {/* Desktop Navigation Links */}
                <div className="navbar-links hidden lg:flex">
                    <Link to="/gallery">Dataset Gallery</Link>
                    <Link to="/custom-request">Custom Request</Link>
                    <Link to="/news">News</Link>
                </div>

                {/* Desktop Search Bar */}
                <div className="navbar-search hidden md:block">
                    <Search size={16} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search datasets, ICD codes..."
                        className="search-input"
                    />
                </div>

                {/* Desktop Compliance Badges */}
                <div className="navbar-compliance hidden xl:flex">
                    <ShieldCheck size={16} className="text-blue-400" />
                    <span>HIPAA / GDPR / DPDP Ready</span>
                </div>

                {/* CTAs & Profile (Desktop + Mobile) */}
                <div className="navbar-actions flex items-center gap-2 md:gap-4 shrink-0">
                    {user ? (
                        <div className="relative z-50">
                            <button
                                onClick={() => setMenuOpen(!menuOpen)}
                                className="flex items-center gap-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 p-1.5 pr-2 md:pr-3 rounded-full transition-all"
                            >
                                <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full border border-slate-600 bg-black/20 object-cover" />
                                <span className="text-sm font-semibold text-slate-200 hidden sm:block">{user.name}</span>
                                <ChevronDown size={14} className="text-slate-400" />
                            </button>

                            {/* Profile Dropdown Menu */}
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
                        <div className="hidden lg:flex gap-4">
                            <Link to="/login" className="btn btn-outline">Log In</Link>
                            <Link to="/signup" className="btn btn-primary">Sign Up</Link>
                        </div>
                    )}

                    {/* Mobile Menu Toggle Button */}
                    <button
                        className="lg:hidden p-2 text-slate-300 hover:text-white transition-colors"
                        onClick={() => setMobileNavOpen(!mobileNavOpen)}
                    >
                        {mobileNavOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Dropdown Pane */}
            {mobileNavOpen && (
                <div className="lg:hidden absolute top-full left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-b border-slate-800 shadow-2xl p-4 flex flex-col gap-4 z-40">
                    <div className="relative mb-2">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search datasets..."
                            className="w-full bg-slate-800/80 border border-slate-700 rounded-full py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-purple-500"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Link to="/gallery" onClick={handleMobileLinkClick} className="px-4 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-800 rounded-lg transition-colors">Dataset Gallery</Link>
                        <Link to="/custom-request" onClick={handleMobileLinkClick} className="px-4 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-800 rounded-lg transition-colors">Custom Request</Link>
                        <Link to="/news" onClick={handleMobileLinkClick} className="px-4 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-800 rounded-lg transition-colors">News</Link>
                    </div>

                    {!user && (
                        <div className="flex flex-col gap-2 mt-2 pt-4 border-t border-slate-800">
                            <Link to="/login" onClick={handleMobileLinkClick} className="btn btn-outline text-center w-full justify-center">Log In</Link>
                            <Link to="/signup" onClick={handleMobileLinkClick} className="btn btn-primary text-center w-full justify-center mt-2">Sign Up</Link>
                        </div>
                    )}

                    <div className="mt-4 flex items-center justify-center gap-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                        <ShieldCheck size={16} className="text-blue-400" />
                        <span className="text-xs font-semibold text-blue-300">HIPAA / GDPR / DPDP Ready</span>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
