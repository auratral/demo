import React from 'react';
import { motion } from 'framer-motion';
import { Layers, ShieldCheck, Sparkles, Globe, ArrowRight, Shield, Database, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
    const pipelineSteps = [
        {
            icon: Database,
            step: '01',
            title: 'Ethical Acquisition',
            desc: 'We secure diverse, high-fidelity datasets directly from certified clinical partners and healthcare institutions across India, ensuring clean and authentic raw inputs.',
            color: 'blue',
        },
        {
            icon: Shield,
            step: '02',
            title: 'De-identification & Privacy',
            desc: 'We strip all personally identifiable information (PII) using state-of-the-art anonymization protocols to guarantee patient privacy while maintaining deep clinical utility.',
            color: 'purple',
        },
        {
            icon: Layers,
            step: '03',
            title: 'Annotation & Enrichment',
            desc: 'Our experts structure and label datasets with rich clinical annotations, transforming raw healthcare files into standardized, high-value AI training data.',
            color: 'emerald',
        },
        {
            icon: Cpu,
            step: '04',
            title: 'Secure Custody Compute',
            desc: 'We mount datasets under strict governance (DPDP Act, HIPAA, and GDPR) inside network-isolated runtimes, allowing code execution without raw database downloads.',
            color: 'amber',
        },
    ];

    const colors = {
        blue:    { bg: 'from-blue-500/10 to-transparent', border: 'border-blue-500/20', icon: 'text-blue-400', iconBg: 'bg-blue-500/10', hover: 'hover:border-blue-500/40', text: 'text-blue-400' },
        purple:  { bg: 'from-purple-500/10 to-transparent', border: 'border-purple-500/20', icon: 'text-purple-400', iconBg: 'bg-purple-500/10', hover: 'hover:border-purple-500/40', text: 'text-purple-400' },
        emerald: { bg: 'from-emerald-500/10 to-transparent', border: 'border-emerald-500/20', icon: 'text-emerald-400', iconBg: 'bg-emerald-500/10', hover: 'hover:border-emerald-500/40', text: 'text-emerald-400' },
        amber:   { bg: 'from-amber-500/10 to-transparent', border: 'border-amber-500/20', icon: 'text-amber-400', iconBg: 'bg-amber-500/10', hover: 'hover:border-amber-500/40', text: 'text-amber-400' },
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } }
    };

    return (
        <section id="about" className="relative py-28 overflow-hidden bg-[#070b13]/40">
            {/* Soft Ambient Radial Lights */}
            <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-blue-500/5 rounded-full blur-[150px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-purple-500/5 rounded-full blur-[130px] pointer-events-none"></div>

            <div className="container mx-auto px-6 max-w-6xl relative z-10">

                {/* Section Introduction */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start mb-20">
                    
                    {/* Left Headline (Column Span 5) */}
                    <motion.div
                        className="lg:col-span-5"
                        initial={{ opacity: 0, y: 25 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="text-xs font-bold uppercase tracking-[0.25em] text-blue-400 bg-blue-500/10 px-3 py-1.5 rounded-full border border-blue-500/20">
                            Who We Are
                        </span>
                        <h2 className="text-3xl md:text-4xl lg:text-[2.5rem] font-black text-primary leading-tight mt-6 mb-4">
                            Pioneering India’s <span className="text-gradient">Compute-to-Data</span> Platform.
                        </h2>
                        <p className="text-slate-400 text-base md:text-lg leading-relaxed">
                            Auratral is transforming how researchers, builders, and clinical teams analyze and leverage high-quality, research-grade datasets without security risks.
                        </p>
                    </motion.div>

                    {/* Right Detailed Narrative (Column Span 7) */}
                    <motion.div
                        className="lg:col-span-7 lg:pl-4 space-y-6 text-slate-300 text-sm md:text-base leading-relaxed"
                        initial={{ opacity: 0, y: 25 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                    >
                        <p className="border-l-2 border-blue-500/40 pl-4 font-medium text-slate-200">
                            We do not transfer or sell datasets. As a dedicated Compute-to-Data platform, we host secure clinical repositories in isolated, sandboxed nodes. Researchers run code on the hosted dataset inside secure containers, exporting only the trained models, weights, and evaluation reports.
                        </p>
                        <p className="text-slate-400">
                            By acting as the secure processing and computing layer between complex clinical systems and modern AI teams, Auratral completely eliminates data custody and leakage risks. Startups, labs, and enterprise research teams can now run analysis and train models on high-fidelity clinical records in minutes rather than spending months navigating complex legal data transfers.
                        </p>
                    </motion.div>
                </div>

                {/* Visual Pipeline Showcase */}
                <div className="mb-20">
                    <motion.div
                        className="text-center mb-12"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">The Auratral Advantage</span>
                        <h3 className="text-2xl font-bold text-primary mt-2">How We Secure & Host Clinical Data</h3>
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.1 }}
                    >
                        {pipelineSteps.map((step) => {
                            const c = colors[step.color];
                            const Icon = step.icon;
                            return (
                                <motion.div
                                    key={step.title}
                                    variants={itemVariants}
                                    className={`group relative bg-gradient-to-b ${c.bg} backdrop-blur-md border ${c.border} ${c.hover} rounded-2xl p-6 transition-all duration-300 cursor-default flex flex-col justify-between`}
                                >
                                    <div>
                                        <div className="flex items-center justify-between mb-6">
                                            <div className={`w-12 h-12 rounded-xl ${c.iconBg} border ${c.border} flex items-center justify-center group-hover:scale-105 transition-transform duration-300`}>
                                                <Icon size={22} className={c.icon} />
                                            </div>
                                            <span className={`text-2xl font-extrabold opacity-25 group-hover:opacity-50 transition-opacity duration-300 ${c.text}`}>
                                                {step.step}
                                            </span>
                                        </div>
                                        <h4 className="text-lg font-bold text-primary mb-2 group-hover:text-white transition-colors">
                                            {step.title}
                                        </h4>
                                        <p className="text-xs md:text-sm text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                                            {step.desc}
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>

                {/* Detailed Mission Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="relative bg-gradient-to-r from-blue-950/20 to-purple-950/20 backdrop-blur-md border border-glass-border rounded-3xl p-8 md:p-12 overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gradient-to-tr from-purple-500/10 to-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>

                    <div className="relative z-10 max-w-4xl mx-auto text-center">
                        <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                            Our Mission
                        </span>
                        <h3 className="text-2xl md:text-3xl font-extrabold text-primary leading-snug mt-6 mb-6">
                            Building a centralized, secure, and compliant compute infrastructure where organizations can seamlessly run code on ethically governed, high-quality data.
                        </h3>
                        <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
                            Auratral is committed to fueling next-generation breakthroughs across clinical AI, healthcare analytics, and patient outcomes by making robust datasets computable, compliant, and ready to analyze.
                        </p>

                        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                            <Link to="/gallery" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all shadow-lg shadow-blue-500/20">
                                Explore Datasets <ArrowRight size={16} />
                            </Link>
                            <a href="#clinical-domains" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-sm font-semibold transition-all border border-glass-border">
                                Browse Domains
                            </a>
                        </div>
                    </div>
                </motion.div>

            </div>
        </section>
    );
};

export default About;
