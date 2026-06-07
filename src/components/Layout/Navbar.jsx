import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ChevronDown, LogOut, Image as ImageIcon, Menu, X, Coins } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const { user, logout, updateProfilePicture } = useAuth();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const [credits, setCredits] = useState(() => {
        const localBal = localStorage.getItem('auratral_credits_balance');
        return localBal ? Number(localBal) : 12500;
    });

    const [creditsOpen, setCreditsOpen] = useState(false);
    const [creditsHistory, setCreditsHistory] = useState([]);

    useEffect(() => {
        const handleCreditsUpdate = () => {
            const localBal = localStorage.getItem('auratral_credits_balance');
            setCredits(localBal ? Number(localBal) : 12500);
        };
        window.addEventListener('auratral_credits_updated', handleCreditsUpdate);
        window.addEventListener('storage', handleCreditsUpdate);
        return () => {
            window.removeEventListener('auratral_credits_updated', handleCreditsUpdate);
            window.removeEventListener('storage', handleCreditsUpdate);
        };
    }, []);

    useEffect(() => {
        const loadHistory = () => {
            const historyStr = localStorage.getItem('auratral_credits_history');
            if (historyStr) {
                setCreditsHistory(JSON.parse(historyStr));
            } else {
                const initialHistory = [
                    { id: 1, date: 'Jun 07, 2026', type: 'debit', desc: 'RandomForest execution (train_model.py)', amount: 6 },
                    { id: 2, date: 'Jun 07, 2026', type: 'debit', desc: 'Exploratory data analysis (explore_data.py)', amount: 2 },
                    { id: 3, date: 'Jun 06, 2026', type: 'debit', desc: 'Longitudinal ICU Encounters Sandbox Activation', amount: 1237 },
                    { id: 4, date: 'Jun 05, 2026', type: 'credit', desc: 'Credit Pack Top Up (Development Mode)', amount: 12500 }
                ];
                localStorage.setItem('auratral_credits_history', JSON.stringify(initialHistory));
                setCreditsHistory(initialHistory);
            }
        };
        loadHistory();
        window.addEventListener('auratral_credits_updated', loadHistory);
        window.addEventListener('storage', loadHistory);
        return () => {
            window.removeEventListener('auratral_credits_updated', loadHistory);
            window.removeEventListener('storage', loadHistory);
        };
    }, []);

    const handleSearchKeyDown = (e) => {
        if (e.key === 'Enter' && searchTerm.trim()) {
            navigate(`/gallery?q=${encodeURIComponent(searchTerm.trim())}`);
            setSearchTerm('');
            setMobileNavOpen(false);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handlePictureChange = () => {
        document.getElementById('avatar-upload-input')?.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Please select an image file.');
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            alert('Please select an image smaller than 2MB.');
            return;
        }

        try {
            const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage');
            const { storage } = await import('../../firebase');
            
            const storageRef = ref(storage, `avatars/${user.uid}`);
            const snapshot = await uploadBytes(storageRef, file);
            const downloadUrl = await getDownloadURL(snapshot.ref);
            
            await updateProfilePicture(downloadUrl);
            alert('Profile picture uploaded successfully to Firebase Storage!');
        } catch (err) {
            console.warn("Firebase Storage upload failed, falling back to local base64 storage:", err);
            
            const reader = new FileReader();
            reader.onload = async (event) => {
                const base64Url = event.target?.result;
                if (base64Url) {
                    await updateProfilePicture(base64Url);
                    localStorage.setItem(`avatar_${user.uid}`, base64Url);
                    alert('Profile picture updated locally! (Firebase Storage was uninitialized)');
                }
            };
            reader.readAsDataURL(file);
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
                    {user && (
                        <Link to={user.role === 'consumer' ? '/dashboard' : '/provider-dashboard'} className="font-semibold text-purple-400">
                            Dashboard
                        </Link>
                    )}
                </div>

                {/* Desktop Search Bar */}
                <div className="navbar-search hidden md:block">
                    <Search size={16} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search datasets, ICD codes..."
                        className="search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={handleSearchKeyDown}
                    />
                </div>



                {/* CTAs & Profile (Desktop + Mobile) */}
                <div className="navbar-actions flex items-center gap-2 md:gap-4 shrink-0">
                    {user && (
                        <div className="relative z-50">
                            <button
                                onClick={() => { setCreditsOpen(!creditsOpen); setMenuOpen(false); }}
                                className="flex items-center gap-1.5 bg-slate-800/60 hover:bg-slate-700/60 border border-purple-500/30 px-3.5 py-1.5 rounded-full text-xs font-bold text-purple-400 select-none transition-all cursor-pointer"
                            >
                                <Coins size={12} className="text-purple-400" />
                                <span>{credits.toLocaleString()} Cr</span>
                                <ChevronDown size={10} className="text-purple-400" />
                            </button>

                            {/* Credits Dropdown */}
                            {creditsOpen && (
                                <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden z-50 text-left font-sans">
                                    <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/40">
                                        <div>
                                            <div className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Compute Credits</div>
                                            <div className="text-base font-extrabold text-primary mt-0.5">{credits.toLocaleString()} Cr</div>
                                        </div>
                                        <button 
                                            onClick={() => { setCreditsOpen(false); navigate('/buy-credits'); }}
                                            className="btn btn-primary text-[10px] py-1.5 px-3 font-semibold flex items-center gap-1"
                                        >
                                            Buy Credits
                                        </button>
                                    </div>

                                    {/* History list */}
                                    <div className="max-h-60 overflow-y-auto divide-y divide-slate-800/60 p-2">
                                        <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider p-2">Recent Transactions</div>
                                        {creditsHistory.length === 0 ? (
                                            <div className="text-xs text-slate-500 italic p-3 text-center">No transaction history.</div>
                                        ) : (
                                            creditsHistory.slice(0, 5).map(tx => (
                                                <div key={tx.id} className="p-2 hover:bg-slate-800/30 rounded-lg flex justify-between items-start text-xs gap-3">
                                                    <div className="min-w-0 flex-1">
                                                        <div className="font-semibold text-slate-200 leading-tight truncate">{tx.desc}</div>
                                                        <div className="text-[10px] text-slate-500 mt-1">{tx.date}</div>
                                                    </div>
                                                    <span className={`font-mono font-bold shrink-0 ${tx.type === 'credit' ? 'text-green-400' : 'text-red-400'}`}>
                                                        {tx.type === 'credit' ? '+' : '-'}{tx.amount.toLocaleString()}
                                                    </span>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                    <div className="p-2 border-t border-slate-800/85 bg-slate-950/20 text-center">
                                        <button 
                                            onClick={() => { setCreditsOpen(false); navigate('/buy-credits'); }}
                                            className="text-[10px] font-semibold text-purple-400 hover:text-purple-300 transition-colors py-1 block w-full text-center cursor-pointer"
                                        >
                                            View Full Billing Page
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    {user ? (
                        <div className="relative z-50">
                            <button
                                onClick={() => { setMenuOpen(!menuOpen); setCreditsOpen(false); }}
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
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleSearchKeyDown}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Link to="/gallery" onClick={handleMobileLinkClick} className="px-4 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-800 rounded-lg transition-colors">Dataset Gallery</Link>
                        <Link to="/custom-request" onClick={handleMobileLinkClick} className="px-4 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-800 rounded-lg transition-colors">Custom Request</Link>
                        <Link to="/news" onClick={handleMobileLinkClick} className="px-4 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-800 rounded-lg transition-colors">News</Link>
                        {user && (
                            <Link to={user.role === 'consumer' ? '/dashboard' : '/provider-dashboard'} onClick={handleMobileLinkClick} className="px-4 py-3 text-sm font-semibold text-purple-400 hover:bg-slate-800 rounded-lg transition-colors">Dashboard</Link>
                        )}
                    </div>

                    {!user && (
                        <div className="flex flex-col gap-2 mt-2 pt-4 border-t border-slate-800">
                            <Link to="/login" onClick={handleMobileLinkClick} className="btn btn-outline text-center w-full justify-center">Log In</Link>
                            <Link to="/signup" onClick={handleMobileLinkClick} className="btn btn-primary text-center w-full justify-center mt-2">Sign Up</Link>
                        </div>
                    )}


                </div>
            )}
            
            {/* Hidden upload input */}
            {user && (
                <input 
                    type="file" 
                    id="avatar-upload-input" 
                    accept="image/*" 
                    style={{ display: 'none' }} 
                    onChange={handleFileChange} 
                />
            )}
        </nav>
    );
};

export default Navbar;
