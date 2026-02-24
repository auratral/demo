import React from 'react';
import { Link } from 'react-router-dom';
import { Database, ShieldCheck, Activity, Users } from 'lucide-react';
import './Hero.css';

const Hero = () => {
    return (
        <section className="hero-section">
            {/* Animated Background Elements */}
            <div className="hero-bg-gradient"></div>
            <div className="hero-grid"></div>

            <div className="hero-content">
                <div className="inline-badge mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    <ShieldCheck size={16} className="text-blue-400" />
                    <span>The World's Most Trusted Medical Dataset Platform</span>
                </div>

                <h1 className="hero-title animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    Accelerate Healthcare AI &amp; Clinical Research
                </h1>

                <p className="hero-subtitle animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                    Discover, customize, and purchase high-quality, de-identified medical datasets directly from leading healthcare providers in under five minutes.
                </p>

                <div className="hero-ctas animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                    <Link to="/gallery" className="btn btn-primary btn-lg">
                        Explore Healthcare Datasets
                    </Link>
                    <Link to="/custom-request" className="btn btn-outline btn-lg">
                        Request Custom Dataset
                    </Link>
                </div>

                {/* Platform Stats */}
                <div className="hero-stats animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                    <div className="stat-card glass-panel">
                        <Database className="text-blue-400 mb-2" size={24} />
                        <div className="stat-value">500+</div>
                        <div className="stat-label">Datasets Available</div>
                    </div>
                    <div className="stat-card glass-panel">
                        <Users className="text-purple-400 mb-2" size={24} />
                        <div className="stat-value">50M+</div>
                        <div className="stat-label">Patient Records</div>
                    </div>
                    <div className="stat-card glass-panel">
                        <Activity className="text-pink-400 mb-2" size={24} />
                        <div className="stat-value">8</div>
                        <div className="stat-label">Medical Sub-Domains</div>
                    </div>
                    <div className="stat-card glass-panel">
                        <ShieldCheck className="text-blue-400 mb-2" size={24} />
                        <div className="stat-value text-sm font-semibold">HIPAA / GDPR</div>
                        <div className="stat-label">Compliance Certified</div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
