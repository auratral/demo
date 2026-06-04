import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, Lock, Activity } from 'lucide-react';
import './Footer.css';

const Footer = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleAboutClick = (e) => {
        e.preventDefault();
        if (location.pathname === '/') {
            // Already on home page — just scroll
            const el = document.getElementById('about');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        } else {
            // Navigate home, then scroll after render
            navigate('/');
            setTimeout(() => {
                const el = document.getElementById('about');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 300);
        }
    };

    return (
        <footer className="footer border-t border-glass-border">
            <div className="container mx-auto px-8 max-w-7xl py-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">

                    {/* Left: Brand & Copyright */}
                    <div className="flex flex-col items-center md:items-start gap-1">
                        <Link to="/" className="flex items-center">
                            <img src={`${import.meta.env.BASE_URL}logo.png`} alt="Auratral" className="h-8 w-auto mix-blend-screen opacity-80 hover:opacity-100 transition-opacity" />
                        </Link>
                        <p className="text-xs text-slate-500">
                            &copy; {new Date().getFullYear()} Auratral Dataspace Pvt Ltd. All rights reserved.
                        </p>
                    </div>

                    {/* Middle: Minimal Links */}
                    <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-slate-400 font-medium">
                        <Link to="/gallery" className="hover:text-blue-400 transition-colors">Gallery</Link>
                        <Link to="/pricing" className="hover:text-blue-400 transition-colors">Pricing</Link>
                        <Link to="/custom-request" className="hover:text-blue-400 transition-colors">Enterprise</Link>
                        <a href="/#about" onClick={handleAboutClick} className="hover:text-blue-400 transition-colors cursor-pointer">About</a>
                        <Link to="/legal/privacy" className="hover:text-blue-400 transition-colors">Privacy</Link>
                    </div>

                    {/* Right: Compliance Badges */}
                    <div className="flex gap-3">
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-xs text-slate-300 shadow-sm">
                            <ShieldCheck size={14} className="text-blue-400" />
                            HIPAA
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-xs text-slate-300 shadow-sm">
                            <Lock size={14} className="text-purple-400" />
                            GDPR
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-xs text-slate-300 shadow-sm">
                            <ShieldCheck size={14} className="text-green-400" />
                            DPDP
                        </div>
                    </div>

                </div>
            </div>
        </footer>
    );
};

export default Footer;

