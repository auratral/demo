import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Globe, Lock } from 'lucide-react';

const About = () => {
    const pillars = [
        {
            icon: Zap,
            title: 'Speed',
            desc: 'From discovery to download in under 5 minutes.',
            color: 'blue',
        },
        {
            icon: Lock,
            title: 'Trust',
            desc: 'Every record de-identified, every transfer encrypted.',
            color: 'purple',
        },
        {
            icon: Globe,
            title: 'Scale',
            desc: 'India-first datasets powering global research.',
            color: 'emerald',
        },
    ];

    const colors = {
        blue: { bg: 'from-blue-500/20 to-blue-600/5', border: 'border-blue-500/30', icon: 'text-blue-400', glow: 'bg-blue-500/10', ring: 'group-hover:shadow-blue-500/20' },
        purple: { bg: 'from-purple-500/20 to-purple-600/5', border: 'border-purple-500/30', icon: 'text-purple-400', glow: 'bg-purple-500/10', ring: 'group-hover:shadow-purple-500/20' },
        emerald: { bg: 'from-emerald-500/20 to-emerald-600/5', border: 'border-emerald-500/30', icon: 'text-emerald-400', glow: 'bg-emerald-500/10', ring: 'group-hover:shadow-emerald-500/20' },
    };

    return (
        <section id="about" className="relative py-24 overflow-hidden">
            {/* Ambient glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-purple-500/5 rounded-full blur-[180px] pointer-events-none"></div>

            <div className="container mx-auto px-8 max-w-5xl relative z-10">

                {/* Headline */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="text-center mb-16"
                >
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400 mb-4">Who we are</p>
                    <h2 className="text-3xl md:text-5xl font-extrabold text-primary leading-tight mb-5">
                        The bridge between <br className="hidden md:block" />
                        <span className="text-gradient">clinical data & breakthrough research.</span>
                    </h2>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
                        Auratral is India's first dedicated marketplace for ethically sourced, de-identified medical datasets — built so researchers spend less time searching and more time discovering.
                    </p>
                </motion.div>

                {/* Three pillars */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: { staggerChildren: 0.15 }
                        }
                    }}
                >
                    {pillars.map((p) => {
                        const c = colors[p.color];
                        const Icon = p.icon;
                        return (
                            <motion.div
                                key={p.title}
                                variants={{
                                    hidden: { opacity: 0, y: 30, scale: 0.95 },
                                    visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 80, damping: 14 } }
                                }}
                                className={`group relative bg-gradient-to-b ${c.bg} backdrop-blur-sm border ${c.border} rounded-2xl p-8 text-center hover:shadow-2xl ${c.ring} transition-all duration-500 cursor-default`}
                            >
                                {/* Icon circle */}
                                <div className={`mx-auto w-14 h-14 rounded-xl ${c.glow} border ${c.border} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                                    <Icon size={24} className={c.icon} />
                                </div>
                                <h3 className="text-xl font-bold text-primary mb-2">{p.title}</h3>
                                <p className="text-sm text-slate-400 leading-relaxed">{p.desc}</p>
                            </motion.div>
                        );
                    })}
                </motion.div>

            </div>
        </section>
    );
};

export default About;
