import React from 'react';
import { ArrowRight, Newspaper, Activity, Database, HeartPulse } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const mainNews = {
    category: "AI in Indian Healthcare",
    title: "India's Digital Health Mission Accelerates AI Adoption in Rural Diagnostics",
    excerpt: "With the Ayushman Bharat Digital Mission (ABDM) standardizing health records, Indian AI startups are leveraging unified data to deploy diagnostic models in remote villages, dramatically reducing screening times for diseases like diabetic retinopathy and TB.",
    date: "Feb 22, 2026",
    link: "/news/abdm-ai-diagnostics",
    icon: <Activity className="text-blue-400 mb-4" size={32} />
};

const newsArticles = [
    {
        category: "Data Infrastructure",
        title: "Upgrading Legacy EHRs: How Indian Startups are Structuring Data for ML",
        date: "Feb 18, 2026",
        link: "/news/ehr-structuring-india",
        icon: <Database size={20} className="text-purple-400" />
    },
    {
        category: "Diversity & Inclusion",
        title: "The Need for Diverse Clinical Datasets: Representing the 1.4 Billion",
        date: "Feb 10, 2026",
        link: "/news/diverse-datasets-india",
        icon: <HeartPulse size={20} className="text-blue-400" />
    },
    {
        category: "Platform Updates",
        title: "Auratral Adds 500k Verified South Asian Cardiovascular Records",
        date: "Feb 02, 2026",
        link: "/news/south-asian-cardio-records",
        icon: <Newspaper size={20} className="text-emerald-400" />
    }
];

const LatestAINews = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 30, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 100, damping: 12 }
        }
    };

    return (
        <section className="py-24 overflow-hidden">
            <motion.div
                className="container mx-auto px-8 grid grid-cols-1 xl:grid-cols-12 gap-16"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
            >

                {/* Main Featured News Column */}
                <motion.div variants={itemVariants} className="xl:col-span-8 flex flex-col h-full">
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <h2 className="text-3xl font-bold text-primary">Latest in AI Healthcare</h2>
                            <p className="text-slate-400 mt-2">Insights and breakthroughs focusing on India's healthcare evolution</p>
                        </div>
                        <Link to="/news" className="text-sm font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 shrink-0">
                            All News <ArrowRight size={16} />
                        </Link>
                    </div>

                    <div className="glass-panel p-8 flex flex-col justify-center h-full relative overflow-hidden group">
                        {/* Decorative background element */}
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-700"></div>

                        <div className="relative z-10">
                            {mainNews.icon}
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">{mainNews.category}</span>
                                <span className="text-xs text-slate-500">{mainNews.date}</span>
                            </div>
                            <Link to={mainNews.link}>
                                <h3 className="text-2xl font-bold text-primary mb-4 leading-tight group-hover:text-blue-300 transition-colors">
                                    {mainNews.title}
                                </h3>
                            </Link>
                            <p className="text-secondary text-sm leading-relaxed mb-6">
                                {mainNews.excerpt}
                            </p>
                            <Link to={mainNews.link} className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-blue-400 transition-colors">
                                Read Full Article <ArrowRight size={16} />
                            </Link>
                        </div>
                    </div>
                </motion.div>

                {/* Additional News & Subscribe Column */}
                <motion.div variants={itemVariants} className="xl:col-span-4 flex flex-col h-full">
                    <div className="flex justify-between items-end mb-8">
                        <h2 className="text-3xl font-bold text-primary opacity-0 select-none">More</h2> {/* Spacer to align with left */}
                    </div>

                    <div className="glass-panel p-6 flex-grow flex flex-col gap-6">
                        {newsArticles.map((n, idx) => (
                            <Link to={n.link} key={idx} className="group block border-b border-glass-border pb-4 last:border-0 last:pb-0 flex gap-4 items-start">
                                <div className="mt-1 p-2 bg-slate-800/50 rounded-lg border border-slate-700/50 group-hover:border-slate-600 transition-colors">
                                    {n.icon}
                                </div>
                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{n.category}</span>
                                        <span className="text-[10px] text-slate-500">{n.date}</span>
                                    </div>
                                    <h3 className="font-semibold text-primary text-sm leading-snug group-hover:text-blue-400 transition-colors">
                                        {n.title}
                                    </h3>
                                </div>
                            </Link>
                        ))}

                        <div className="mt-auto pt-4">
                            <div className="p-5 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl text-center shadow-lg">
                                <h4 className="text-sm font-bold text-white mb-2">Subscribe to Insights</h4>
                                <p className="text-xs text-slate-400 mb-4">Get the latest updates on AI datasets and healthcare ML.</p>
                                <div className="flex flex-col gap-2">
                                    <input type="email" placeholder="Email address" className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2.5 text-xs text-slate-300 outline-none focus:border-blue-500 transition-colors" />
                                    <button className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded px-3 py-2.5 text-xs font-bold transition-colors">Subscribe</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

            </motion.div>
        </section>
    );
};

export default LatestAINews;
