import React from 'react';
import { Link } from 'react-router-dom';
import { Database, ShieldCheck, Activity, Users } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './Hero.css';

const Hero = () => {
    const { scrollYProgress, scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 1000], [0, 400]); // Deeper background movement
    const y2 = useTransform(scrollY, [0, 1000], [0, -150]); // Stats move up faster
    const scaleBg = useTransform(scrollY, [0, 1000], [1, 1.2]); // Zoom in background as we scroll
    const opacityBg = useTransform(scrollY, [0, 800], [1, 0.4]); // Fade slightly

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 100, damping: 10 }
        }
    };

    return (
        <section className="hero-section overflow-hidden">
            {/* Animated Background Elements */}
            <motion.div className="hero-bg-gradient" style={{ y: y1, scale: scaleBg, opacity: opacityBg }}></motion.div>

            <motion.div
                className="hero-content"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div variants={itemVariants} className="inline-badge mb-6">
                    <ShieldCheck size={16} className="text-blue-400" />
                    <span>The World's Most Trusted Medical Dataset Platform</span>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-300 mb-2">
                        Crafting India's Tomorrow:
                    </h2>
                    <h1 className="hero-title mt-0">
                        Where Every <span className="text-gradient">Dataset Inspires Innovation</span>
                    </h1>
                </motion.div>

                <motion.p variants={itemVariants} className="hero-subtitle">
                    Discover, customize, and purchase high-quality, de-identified medical datasets directly from leading healthcare providers in under five minutes.
                </motion.p>

                <motion.div variants={itemVariants} className="hero-ctas">
                    <Link to="/gallery" className="btn btn-primary btn-lg">
                        Explore Healthcare Datasets
                    </Link>
                    <Link to="/custom-request" className="btn btn-outline btn-lg">
                        Request Custom Dataset
                    </Link>
                </motion.div>

                {/* Platform Stats */}
                <motion.div variants={itemVariants} className="hero-stats" style={{ y: y2 }}>
                    <div className="stat-card glass-panel group hover:-translate-y-2 transition-transform duration-300">
                        <Database className="text-blue-400 mb-2 group-hover:scale-110 transition-transform" size={24} />
                        <div className="stat-value">500+</div>
                        <div className="stat-label">Datasets Available</div>
                    </div>
                    <div className="stat-card glass-panel group hover:-translate-y-2 transition-transform duration-300">
                        <Users className="text-purple-400 mb-2 group-hover:scale-110 transition-transform" size={24} />
                        <div className="stat-value">50M+</div>
                        <div className="stat-label">Patient Records</div>
                    </div>
                    <div className="stat-card glass-panel group hover:-translate-y-2 transition-transform duration-300">
                        <Activity className="text-pink-400 mb-2 group-hover:scale-110 transition-transform" size={24} />
                        <div className="stat-value">8</div>
                        <div className="stat-label">Medical Sub-Domains</div>
                    </div>
                    <div className="stat-card glass-panel group hover:-translate-y-2 transition-transform duration-300">
                        <ShieldCheck className="text-blue-400 mb-2 group-hover:scale-110 transition-transform" size={24} />
                        <div className="stat-value text-sm font-semibold">HIPAA / GDPR / DPDP</div>
                        <div className="stat-label">Compliance Certified</div>
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
};

export default Hero;
