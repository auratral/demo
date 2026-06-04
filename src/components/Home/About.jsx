import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Globe, Lock, Layers, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
    const capabilities = [
        {
            icon: Layers,
            title: 'Acquire & Process',
            desc: 'We source raw clinical data and transform it — annotating, structuring, and de-identifying every record to research-grade standards.',
            color: 'blue',
        },
        {
            icon: ShieldCheck,
            title: 'Compliance-Ready',
            desc: 'Every dataset is governed under HIPAA, GDPR, and DPDP frameworks — so your team can focus on insights, not paperwork.',
            color: 'purple',
        },
        {
            icon: Sparkles,
            title: 'AI-Ready Delivery',
            desc: 'Structured, labeled, and export-ready in formats like CSV, FHIR R4, and JSON — plug directly into your ML pipelines.',
            color: 'emerald',
        },
        {
            icon: Globe,
            title: 'India-First, Global Reach',
            desc: 'Building the centralized data infrastructure India\'s research ecosystem has been missing — serving startups, labs, and enterprises alike.',
            color: 'amber',
        },
    ];

    const colors = {
        blue:    { bg: 'from-blue-500/15 to-transparent', border: 'border-blue-500/20', icon: 'text-blue-400', iconBg: 'bg-blue-500/10', hover: 'hover:border-blue-500/40' },
        purple:  { bg: 'from-purple-500/15 to-transparent', border: 'border-purple-500/20', icon: 'text-purple-400', iconBg: 'bg-purple-500/10', hover: 'hover:border-purple-500/40' },
        emerald: { bg: 'from-emerald-500/15 to-transparent', border: 'border-emerald-500/20', icon: 'text-emerald-400', iconBg: 'bg-emerald-500/10', hover: 'hover:border-emerald-500/40' },
        amber:   { bg: 'from-amber-500/15 to-transparent', border: 'border-amber-500/20', icon: 'text-amber-400', iconBg: 'bg-amber-500/10', hover: 'hover:border-amber-500/40' },
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.12 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 25, scale: 0.97 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 80, damping: 14 } }
    };

    return (
        <section id="about" className="relative py-28 overflow-hidden">
            {/* Ambient glows */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[160px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[140px] pointer-events-none"></div>

            <div className="container mx-auto px-8 max-w-6xl relative z-10">

                {/* Top section: headline + description side by side */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-20">

                    {/* Left: Headline */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.4 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                    >
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400 mb-4">About Auratral</p>
                        <h2 className="text-3xl md:text-4xl lg:text-[2.6rem] font-extrabold text-primary leading-tight mb-6">
                            Not a marketplace.<br />
                            A <span className="text-gradient">Data-as-a-Service</span> platform.
                        </h2>
                        <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                    </motion.div>

                    {/* Right: Description */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.4 }}
                        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
                    >
                        <p className="text-slate-400 text-[1.05rem] leading-[1.8] mb-5">
                            <span className="text-primary font-semibold">Auratral Dataspace</span> is a pioneering DaaS platform transforming how organizations access research-grade data in India. We don't simply collect and sell datasets — we <span className="text-slate-200">acquire, process, and enhance</span> data by annotating, de-identifying, structuring, and making it compliance-ready.
                        </p>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            Our mission is to build a centralized, secure, and compliant data infrastructure where organizations can seamlessly access ethically governed, high-quality data for innovation across AI, analytics, and decision-making.
                        </p>
                    </motion.div>
                </div>

                {/* Capability cards */}
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 gap-5"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                >
                    {capabilities.map((cap) => {
                        const c = colors[cap.color];
                        const Icon = cap.icon;
                        return (
                            <motion.div
                                key={cap.title}
                                variants={itemVariants}
                                className={`group relative bg-gradient-to-br ${c.bg} backdrop-blur-sm border ${c.border} ${c.hover} rounded-2xl p-7 transition-all duration-400 cursor-default`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`shrink-0 w-11 h-11 rounded-xl ${c.iconBg} border ${c.border} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                        <Icon size={20} className={c.icon} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-primary mb-1.5">{cap.title}</h3>
                                        <p className="text-sm text-slate-400 leading-relaxed">{cap.desc}</p>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Bottom CTA strip */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-6 text-center"
                >
                    <p className="text-slate-500 text-sm">Delivering high-value data solutions to researchers, startups, and enterprises.</p>
                    <Link to="/gallery" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors group">
                        Explore Datasets <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>

            </div>
        </section>
    );
};

export default About;
