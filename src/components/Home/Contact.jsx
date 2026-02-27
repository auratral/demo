import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Instagram, Linkedin, MapPin, MessageSquare, ArrowRight } from 'lucide-react';

const Contact = () => {
    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 20
            }
        }
    };

    const hoverVariants = {
        rest: { scale: 1, boxShadow: "0px 0px 0px rgba(168, 85, 247, 0)" },
        hover: {
            scale: 1.05,
            y: -5,
            boxShadow: "0px 10px 30px rgba(168, 85, 247, 0.2)",
            borderColor: "rgba(168, 85, 247, 0.5)",
            transition: { type: "spring", stiffness: 300 }
        }
    };

    return (
        <section id="contact" className="py-24 relative overflow-hidden">
            {/* Background Accents (Keeps the Premium Vibe) */}
            <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none transform -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none"></div>

            <div className="container mx-auto px-8 relative z-10">

                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/50 text-xs font-semibold text-purple-400 mb-6"
                    >
                        <MessageSquare size={14} className="text-purple-400" /> Get in Touch
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-3xl md:text-5xl font-bold text-primary mb-6"
                    >
                        Let's Connect & <span className="text-gradient">Collaborate</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-slate-400 text-lg leading-relaxed"
                    >
                        Whether you need a custom dataset, partnership inquiries, or platform support, our team is ready to assist you in accelerating healthcare AI.
                    </motion.p>
                </div>

                {/* Contact Cards Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
                >
                    {/* Phone Card */}
                    <motion.a
                        href="tel:+917676376731"
                        variants={cardVariants}
                        whileHover="hover"
                        initial="rest"
                        className="glass-panel p-8 rounded-3xl flex flex-col items-center text-center group cursor-pointer border border-slate-700/50 block"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700 flex flex-col items-center justify-center mb-6 text-blue-400 group-hover:text-blue-300 group-hover:scale-110 transition-all duration-300 shadow-inner">
                            <Phone size={28} />
                        </div>
                        <h3 className="text-lg font-bold text-primary mb-2">Call Us</h3>
                        <p className="text-slate-300 font-medium mb-4 group-hover:text-blue-400 transition-colors">+91 7676376731</p>
                        <span className="mt-auto text-xs font-semibold text-slate-500 flex items-center gap-1 group-hover:text-blue-400 transition-colors">
                            Mon-Fri, 9am - 6pm <ArrowRight size={12} className="opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                        </span>
                    </motion.a>

                    {/* Email Card */}
                    <motion.a
                        href="mailto:connect@auratral.com"
                        variants={cardVariants}
                        whileHover="hover"
                        initial="rest"
                        className="glass-panel p-8 rounded-3xl flex flex-col items-center text-center group cursor-pointer border border-slate-700/50 block"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700 flex flex-col items-center justify-center mb-6 text-purple-400 group-hover:text-purple-300 group-hover:scale-110 transition-all duration-300 shadow-inner">
                            <Mail size={28} />
                        </div>
                        <h3 className="text-lg font-bold text-primary mb-2">Email Us</h3>
                        <p className="text-slate-300 font-medium mb-4 group-hover:text-purple-400 transition-colors">connect@auratral.com</p>
                        <span className="mt-auto text-xs font-semibold text-slate-500 flex items-center gap-1 group-hover:text-purple-400 transition-colors">
                            Drop a message <ArrowRight size={12} className="opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                        </span>
                    </motion.a>

                    {/* LinkedIn Card */}
                    <motion.a
                        href="https://www.linkedin.com/company/auratral/"
                        target="_blank"
                        rel="noopener noreferrer"
                        variants={cardVariants}
                        whileHover="hover"
                        initial="rest"
                        className="glass-panel p-8 rounded-3xl flex flex-col items-center text-center group cursor-pointer border border-slate-700/50 block"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700 flex flex-col items-center justify-center mb-6 text-blue-500 group-hover:text-blue-400 group-hover:scale-110 transition-all duration-300 shadow-inner">
                            <Linkedin size={28} />
                        </div>
                        <h3 className="text-lg font-bold text-primary mb-2">LinkedIn</h3>
                        <p className="text-slate-400 text-sm mb-4">Follow our company updates & research.</p>
                        <span className="mt-auto text-xs font-semibold text-slate-500 flex items-center gap-1 group-hover:text-blue-500 transition-colors">
                            Connect <ArrowRight size={12} className="opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                        </span>
                    </motion.a>

                    {/* Instagram Card */}
                    <motion.a
                        href="https://www.instagram.com/auratral/"
                        target="_blank"
                        rel="noopener noreferrer"
                        variants={cardVariants}
                        whileHover="hover"
                        initial="rest"
                        className="glass-panel p-8 rounded-3xl flex flex-col items-center text-center group cursor-pointer border border-slate-700/50 block relative overflow-hidden"
                    >
                        {/* Insta Gradient Hover Sub-Background */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-yellow-500/10 via-pink-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                        <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700 flex flex-col items-center justify-center mb-6 text-pink-400 group-hover:text-pink-300 group-hover:scale-110 transition-all duration-300 shadow-inner relative z-10">
                            <Instagram size={28} />
                        </div>
                        <h3 className="text-lg font-bold text-primary mb-2 relative z-10">Instagram</h3>
                        <p className="text-slate-400 text-sm mb-4 relative z-10">See our culture and events.</p>
                        <span className="mt-auto text-xs font-semibold text-slate-500 flex items-center gap-1 group-hover:text-pink-400 transition-colors relative z-10">
                            Follow Us <ArrowRight size={12} className="opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                        </span>
                    </motion.a>

                </motion.div>
            </div>
        </section>
    );
};

export default Contact;
