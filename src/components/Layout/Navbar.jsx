import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShieldCheck } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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
                    <Link to="/testimonials">Testimonials</Link>
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
                    <ShieldCheck size={16} className="text-teal-400" />
                    <span>HIPAA / GDPR Ready</span>
                </div>

                {/* CTAs */}
                <div className="navbar-actions">
                    <Link to="/login" className="btn btn-outline">Log In</Link>
                    <Link to="/signup" className="btn btn-primary">Sign Up</Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
