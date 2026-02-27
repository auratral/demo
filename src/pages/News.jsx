import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, ChevronRight, Mail } from 'lucide-react';

const newsItems = [
    {
        id: 1,
        category: "Platform Updates",
        title: "Docker Delivery Now Available for Enterprise Cohorts",
        date: "Feb 18, 2026",
        author: "Auratral Product Team",
        excerpt: "We are thrilled to announce that enterprise customers can now provision custom clinical cohorts entirely within secure, self-contained Docker environments. This update significantly reduces the infrastructure overhead for biomedical R&D teams by providing a pre-configured database, Jupyter lab, and essential ML libraries out of the box.",
        imageUrl: "https://picsum.photos/seed/docker/800/400",
    },
    {
        id: 2,
        category: "Regulatory",
        title: "Understanding HIPAA & DPDP Compliance for AI Model Training",
        date: "Feb 10, 2026",
        author: "Sarah Jenkins, VP Compliance",
        excerpt: "As healthcare AI scales, the Safe Harbor de-identification standard is often insufficient for complex longitudinal datasets. We explore how Auratral utilizes Expert Determination to preserve clinical utility while guaranteeing privacy, providing a transparent framework for regulatory review.",
        imageUrl: "https://picsum.photos/seed/compliance/800/400",
    },
    {
        id: 3,
        category: "New Dataset",
        title: "Expansion: 500k New Records Added to the Cardiovascular Cohort",
        date: "Feb 02, 2026",
        author: "Auratral Data Ops",
        excerpt: "Our flagship longitudinal cardiovascular dataset has been updated with half a million new encounters spanning the latest 18 months. This release includes high-resolution ECG telemetry mapped directly to medication adherence logs and subsequent readmission events.",
        imageUrl: "https://picsum.photos/seed/cardio/800/400",
    },
    {
        id: 4,
        category: "Healthcare AI",
        title: "Combating Demographic Bias in Clinical Machine Learning",
        date: "Jan 24, 2026",
        author: "Dr. Alistair Vance",
        excerpt: "A deep dive into why representative training data is the biggest bottleneck in medical AI, and how our new demographic bias configuration tool helps engineering teams build fairer algorithms by explicitly visualizing underlying population distributions before purchase.",
        imageUrl: "https://picsum.photos/seed/ai/800/400",
    },
    {
        id: 5,
        category: "Company News",
        title: "Auratral Achieves ISO 27001 Certification Phase 1",
        date: "Jan 15, 2026",
        author: "Auratral Executive Team",
        excerpt: "We are proud to announce the successful completion of our Phase 1 audit for ISO 27001 certification. As a trusted medical data broker, security remains our foundational operating principle, ensuring end-to-end encryption from hospital node to researcher sandbox.",
        imageUrl: "https://picsum.photos/seed/security/800/400",
    }
];

const categories = ["All", "Platform Updates", "New Dataset", "Regulatory", "Healthcare AI", "Company News"];

const News = () => {
    return (
        <div className="pt-32 pb-24 min-h-screen">

            {/* Header Section */}
            <div className="container mx-auto px-8 max-w-7xl mb-16">
                <div className="flex flex-col items-start gap-4 border-b border-glass-border pb-8">
                    <span className="text-blue-400 font-bold tracking-widest uppercase text-sm">Auratral Insights</span>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-primary">News & Research</h1>
                    <p className="text-secondary max-w-2xl text-lg md:text-xl leading-relaxed">
                        Stay informed on the latest platform announcements, deep dives into healthcare data regulation, and best practices for clinical AI.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-8 max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-12">

                {/* Main Content Column */}
                <div className="lg:col-span-8 flex flex-col gap-10">

                    {/* Featured Article */}
                    <div className="glass-panel overflow-hidden group hover:border-blue-500/50 transition-all duration-300 shadow-2xl flex flex-col">
                        <div className="h-72 sm:h-96 relative overflow-hidden">
                            <div className="absolute inset-0 bg-slate-800 animate-pulse"></div>
                            <img
                                src={newsItems[0].imageUrl}
                                alt={newsItems[0].title}
                                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-transform duration-700 relative z-10"
                            />
                            <div className="absolute top-6 left-6 z-20">
                                <span className="bg-blue-500 text-slate-900 text-xs font-black uppercase tracking-wider px-4 py-1.5 rounded-sm shadow-lg">
                                    {newsItems[0].category}
                                </span>
                            </div>
                        </div>

                        <div className="p-8 md:p-10 flex flex-col flex-grow bg-slate-800/80">
                            <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-400 mb-4 tracking-wide uppercase">
                                <span className="flex items-center gap-1.5"><Calendar size={14} className="text-blue-400" /> {newsItems[0].date}</span>
                                <span className="flex items-center gap-1.5"><User size={14} className="text-purple-400" /> {newsItems[0].author}</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-black text-primary mb-6 group-hover:text-blue-400 transition-colors leading-tight">
                                {newsItems[0].title}
                            </h2>
                            <p className="text-slate-300 text-base md:text-lg mb-8 leading-relaxed line-clamp-3">
                                {newsItems[0].excerpt}
                            </p>
                            <div className="mt-auto">
                                <Link to={`/news/${newsItems[0].id}`} className="inline-flex items-center gap-2 text-primary font-bold hover:text-blue-400 transition-colors bg-white/5 hover:bg-white/10 px-6 py-3 rounded-lg border border-white/10">
                                    Read Full Article <ArrowRight size={18} />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Standard Articles Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {newsItems.slice(1).map((item) => (
                            <div key={item.id} className="glass-panel overflow-hidden group hover:border-purple-500/40 transition-all duration-300 flex flex-col shadow-lg bg-slate-800/50">
                                <div className="h-56 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-slate-800 animate-pulse"></div>
                                    <img
                                        src={item.imageUrl}
                                        alt={item.title}
                                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-transform duration-700 relative z-10"
                                    />
                                    <div className="absolute top-4 left-4 z-20">
                                        <span className="bg-black/40 backdrop-blur border border-white/10 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded">
                                            {item.category}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-6 md:p-8 flex flex-col flex-grow">
                                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                                        <Calendar size={12} className="text-purple-400" /> {item.date}
                                    </div>
                                    <h3 className="text-xl md:text-2xl font-bold text-primary mb-4 group-hover:text-purple-400 transition-colors leading-snug line-clamp-2">
                                        {item.title}
                                    </h3>
                                    <p className="text-slate-400 text-sm mb-6 flex-grow leading-relaxed line-clamp-3">
                                        {item.excerpt}
                                    </p>
                                    <Link to={`/news/${item.id}`} className="inline-flex items-center gap-2 text-blue-400 text-sm font-bold hover:text-blue-300 transition-colors mt-auto">
                                        Read Article <ArrowRight size={16} />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Load More Button */}
                    <div className="text-center pt-8 border-t border-glass-border">
                        <button className="btn btn-outline px-10 py-3 rounded-xl border-slate-600 hover:border-slate-400 text-slate-300 font-bold tracking-wide">
                            Load More Articles
                        </button>
                    </div>
                </div>

                {/* Sidebar Column */}
                <div className="lg:col-span-4 flex flex-col gap-10">

                    {/* Newsletter Subscribe */}
                    <div className="glass-panel p-8 relative overflow-hidden border-blue-500/30">
                        <div className="absolute top-0 right-0 p-6 opacity-10">
                            <Mail size={100} />
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-xl font-black text-primary mb-3 flex items-center gap-2">
                                <Mail size={20} className="text-blue-400" /> Subscribe
                            </h3>
                            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                                Get the latest updates on medical data compliance, new longitudinal cohorts, and AI breakthroughs straight to your inbox.
                            </p>
                            <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
                                <input
                                    type="email"
                                    placeholder="Enter your work email"
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-sm text-primary focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all placeholder:text-white/40"
                                    required
                                />
                                <button type="submit" className="w-full btn btn-primary py-3 justify-center shadow-lg shadow-blue-500/20 font-bold">
                                    Subscribe to Insights
                                </button>
                            </form>
                            <p className="text-[10px] text-slate-500 mt-4 text-center">We respect your privacy. No spam, ever.</p>
                        </div>
                    </div>

                    {/* Categories List */}
                    <div className="glass-panel p-8 list-none">
                        <h3 className="text-lg font-bold text-primary mb-6 border-b border-glass-border pb-4">Browse Categories</h3>
                        <ul className="flex flex-col gap-2">
                            {categories.map((cat, idx) => (
                                <li key={idx}>
                                    <Link to="#" className="flex justify-between items-center text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg py-2.5 px-3 transition-colors group">
                                        {cat}
                                        <ChevronRight size={16} className="text-slate-600 group-hover:text-blue-400 transition-colors" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default News;
