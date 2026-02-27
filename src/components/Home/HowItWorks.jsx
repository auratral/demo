import React from 'react';
import { Search, Settings2, FileSignature, Download } from 'lucide-react';
import { motion } from 'framer-motion';

const steps = [
    {
        icon: Search,
        title: '1. Browse or Request',
        desc: 'Explore the Healthcare Dataset Gallery or submit a Custom Data Request for specific clinical cohorts.',
    },
    {
        icon: Settings2,
        title: '2. Customize Cohort',
        desc: 'Select record volume, clinical attributes, demographic parameters, and preferred license type.',
    },
    {
        icon: FileSignature,
        title: '3. Legal Agreement',
        desc: 'Review and accept the 12-condition legal agreement strictly covering NDA, HIPAA, DPDP Act, and ethical use.',
    },
    {
        icon: Download,
        title: '4. Instant Access',
        desc: 'Deploy data seamlessly via secure Direct Download, REST API endpoints, or Docker containers.',
    }
];

const HowItWorks = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15
            }
        }
    };

    const itemVariants = {
        hidden: { y: 50, opacity: 0, scale: 0.9 },
        visible: {
            y: 0,
            opacity: 1,
            scale: 1,
            transition: { type: "spring", bounce: 0.4, duration: 0.8 }
        }
    };

    return (
        <section className="py-24 bg-transparent border-y border-glass-border overflow-hidden">
            <div className="container mx-auto px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ type: "spring", stiffness: 100, damping: 10 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl font-bold mb-4 text-primary">How Auratral Works</h2>
                    <p className="text-secondary max-w-2xl mx-auto">
                        A streamlined, fully compliant process to provision premium medical data for your organization in under 5 minutes.
                    </p>
                </motion.div>

                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                >
                    {/* Connecting line for larger screens */}
                    <div className="hidden lg:block absolute top-[2.5rem] left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-blue-400/20 via-purple-500/20 to-blue-400/20 z-0"></div>

                    {steps.map((step, idx) => {
                        const Icon = step.icon;
                        return (
                            <motion.div variants={itemVariants} key={idx} className="relative z-10 flex flex-col items-center text-center p-6 glass-panel">
                                <div className="w-16 h-16 rounded-full bg-slate-800 border border-glass-border flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(168,85,247,0.2)] text-purple-400">
                                    <Icon size={32} />
                                </div>
                                <h3 className="text-xl font-semibold text-primary mb-3">{step.title}</h3>
                                <p className="text-sm text-secondary leading-relaxed">{step.desc}</p>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
};

export default HowItWorks;
