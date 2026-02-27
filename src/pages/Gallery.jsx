import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Database, ShieldCheck, Download, Code2, Box, Star, ChevronDown, Activity, ArrowRight } from 'lucide-react';

const allDatasets = [
    {
        id: 'AUR-EHR-00087', name: 'Longitudinal ICU Encounters', category: 'EHR', records: '186,000',
        formats: ['CSV', 'Parquet', 'FHIR'], compliance: ['HIPAA Safe Harbor', 'DPDP Compliant'], rating: 4.9, price: 12367,
        delivery: ['api', 'docker'], description: 'Comprehensive intensive care unit records including vitals and outcomes.'
    },
    {
        id: 'AUR-IMG-00143', name: 'High-Res Chest X-Ray Annotations', category: 'Imaging', records: '45,200',
        formats: ['DICOM', 'JSON'], compliance: ['HIPAA Safe Harbor', 'DPDP Compliant'], rating: 4.8, price: 24817,
        delivery: ['download'], description: 'Expert radiologist annotated chest x-rays for pneumonia detection.'
    },
    {
        id: 'AUR-PVM-00021', name: 'FDA FAERS Curated Extract', category: 'Pharma', records: '2,400,000',
        formats: ['CSV', 'SQL'], compliance: ['Aggregated'], rating: 4.7, price: 49717,
        delivery: ['api', 'docker', 'download'], description: 'Post-market drug safety and adverse reaction monitoring extract.'
    },
    {
        id: 'AUR-GEN-00092', name: 'Cancer Genome Atlas Subset', category: 'Genomics', records: '12,500',
        formats: ['VCF', 'CSV'], compliance: ['HIPAA Safe Harbor', 'DPDP Compliant'], rating: 5.0, price: 'Custom',
        delivery: ['docker'], description: 'Whole genome sequencing data mapped to clinical oncology outcomes.'
    },
    {
        id: 'AUR-MNT-00034', name: 'PHQ-9 Population Cohort', category: 'Mental Health', records: '340,000',
        formats: ['JSON', 'CSV'], compliance: ['GDPR-Ready', 'HIPAA', 'DPDP Compliant'], rating: 4.6, price: 16517,
        delivery: ['download', 'api'], description: 'Large scale depression screening results linked to socioeconomic indicators.'
    },
    {
        id: 'AUR-RLW-00105', name: 'Real-World Diabetes Outcomes', category: 'Trials', records: '56,000',
        formats: ['Parquet', 'CSV'], compliance: ['HIPAA Safe Harbor', 'DPDP Compliant'], rating: 4.8, price: 33117,
        delivery: ['docker', 'api'], description: 'Longitudinal HbA1c tracking and medication adherence in Type 2 Diabetes.'
    }
];

const categories = ['All', 'EHR', 'Imaging', 'Pharma', 'Genomics', 'Mental Health', 'Trials'];

const Gallery = () => {
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredDatasets = allDatasets.filter(ds =>
        (activeCategory === 'All' || ds.category === activeCategory) &&
        (ds.name.toLowerCase().includes(searchQuery.toLowerCase()) || ds.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="pt-24 pb-24 min-h-screen font-sans relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[150px] pointer-events-none"></div>
            <div className="absolute top-40 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[150px] pointer-events-none"></div>

            {/* Gallery Hero Section */}
            <div className="relative z-10 container mx-auto px-8 pt-16 pb-12 text-center max-w-4xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/50 text-xs font-semibold text-blue-400 mb-6">
                    <Activity size={14} className="text-blue-400" /> Live Data Network
                </div>
                <h1 className="text-4xl md:text-6xl font-extrabold text-primary mb-6 tracking-tight leading-tight">
                    Discover <span className="text-gradient">Premium Healthcare Data</span>
                </h1>
                <p className="text-lg text-slate-400 mb-10 leading-relaxed max-w-2xl mx-auto">
                    Browse our catalog of highly-curated, de-identified medical datasets. Filter by clinical domain, data modality, or compliance standard to find the exact cohort for your research.
                </p>

                {/* Centered Search Bar */}
                <div className="relative max-w-2xl mx-auto group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
                    <div className="relative flex items-center bg-slate-900 border border-slate-700 rounded-full p-2 pl-4 shadow-2xl">
                        <Search className="text-slate-400" size={24} />
                        <input
                            type="text"
                            placeholder="Search datasets, ICD codes, clinical terms..."
                            className="w-full bg-transparent py-3 pl-4 pr-4 text-primary focus:outline-none placeholder-slate-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-3 px-8 rounded-full hover:shadow-lg hover:shadow-purple-500/25 transition-all text-sm tracking-wide">
                            Search
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content Layout */}
            <div className="container mx-auto px-8 flex flex-col lg:flex-row gap-12 relative z-10">

                {/* Sidebar Filters */}
                <div className="lg:w-1/4 shrink-0">
                    <div className="glass-panel p-8 sticky top-32 border-t-2 border-t-purple-500">
                        <div className="flex items-center justify-between mb-8 pb-4 border-b border-glass-border">
                            <h3 className="text-primary font-bold text-lg flex items-center gap-2">
                                <Filter size={18} className="text-purple-400" /> Filters
                            </h3>
                            <button
                                className="text-xs text-slate-500 hover:text-blue-400 font-semibold"
                                onClick={() => { setActiveCategory('All'); setSearchQuery(''); }}
                            >
                                Clear All
                            </button>
                        </div>

                        <div className="mb-8">
                            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4 flex items-center justify-between">
                                Medical Domain <ChevronDown size={14} />
                            </h3>
                            <div className="space-y-3">
                                {categories.map(cat => (
                                    <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${activeCategory === cat ? 'bg-blue-500 border-blue-500' : 'bg-slate-800 border-slate-600 group-hover:border-blue-400'}`}>
                                            {activeCategory === cat && <div className="w-2.5 h-2.5 bg-slate-900 rounded-sm"></div>}
                                        </div>
                                        <span
                                            className={`text-sm tracking-wide ${activeCategory === cat ? 'text-blue-400 font-bold' : 'text-slate-300 font-medium group-hover:text-primary transition-colors'}`}
                                            onClick={() => setActiveCategory(cat)}
                                        >
                                            {cat}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="mb-8">
                            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4 flex items-center justify-between">
                                Compliance Level <ChevronDown size={14} />
                            </h3>
                            <div className="space-y-3">
                                {['HIPAA Safe Harbor', 'GDPR Article 9 Ready', 'DPDP Act India', 'IRB-Compatible DUA'].map(comp => (
                                    <label key={comp} className="flex items-center gap-3 cursor-pointer group">
                                        <input type="checkbox" className="w-5 h-5 rounded border-slate-600 bg-slate-800 text-purple-500 focus:ring-purple-500 focus:ring-offset-slate-900 focus:ring-offset-2 accent-purple-500" />
                                        <span className="text-sm font-medium text-slate-300 group-hover:text-primary transition-colors">{comp}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="mb-4">
                            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4 flex items-center justify-between">
                                Export Format <ChevronDown size={14} />
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {['JSON', 'CSV', 'Parquet', 'FHIR R4', 'DICOM'].map(fmt => (
                                    <span key={fmt} className="bg-slate-800 border border-slate-700 text-slate-400 px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer hover:border-purple-500 hover:text-purple-400 transition-colors shadow-sm">
                                        {fmt}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dataset Results Grid */}
                <div className="flex-grow">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                        <div className="text-slate-400 text-sm">Showing <span className="text-primary font-bold text-lg">{filteredDatasets.length}</span> verified datasets</div>
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">Sort by:</span>
                            <select className="bg-slate-900 border border-slate-700 text-sm text-primary rounded-lg px-4 py-2 outline-none focus:border-purple-500 font-medium">
                                <option>Most Relevant</option>
                                <option>Newest Additions</option>
                                <option>Highest Rated</option>
                                <option>Record Count</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col gap-6">
                        {filteredDatasets.map(dataset => (
                            <div key={dataset.id} className="group relative bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 sm:p-8 flex flex-col xl:flex-row gap-6 hover:border-blue-500/50 hover:bg-slate-800/60 transition-all duration-300 shadow-xl overflow-hidden">
                                {/* Hover Glow */}
                                <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                                <div className="flex-grow relative z-10">
                                    <div className="flex flex-wrap gap-3 items-center mb-3">
                                        <span className="text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                                            {dataset.category}
                                        </span>
                                        <span className="text-xs font-mono text-slate-500">{dataset.id}</span>
                                    </div>

                                    <Link to={`/dataset/${dataset.id}`}>
                                        <h3 className="text-2xl font-bold text-primary mb-3 group-hover:text-blue-400 transition-colors inline-block">{dataset.name}</h3>
                                    </Link>

                                    <p className="text-slate-400 text-sm mb-6 leading-relaxed max-w-3xl">{dataset.description}</p>

                                    <div className="flex flex-wrap items-center gap-6 text-sm bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                                        <div className="flex items-center gap-2 text-slate-300 font-medium">
                                            <Database size={16} className="text-purple-400" /> {dataset.records} Records
                                        </div>
                                        <div className="w-px h-4 bg-slate-700 hidden sm:block"></div>
                                        <div className="flex items-center gap-2 text-slate-300 font-medium">
                                            <ShieldCheck size={16} className="text-blue-500" /> {dataset.compliance.join(', ')}
                                        </div>
                                        <div className="w-px h-4 bg-slate-700 hidden sm:block"></div>
                                        <div className="flex items-center gap-2">
                                            <div className="flex gap-2">
                                                {dataset.formats.map(fmt => <span key={fmt} className="bg-slate-800 border border-slate-700 text-xs font-semibold px-2 py-1 rounded text-slate-400">{fmt}</span>)}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="xl:w-56 shrink-0 flex flex-col justify-between border-t xl:border-t-0 xl:border-l border-slate-700 pt-6 xl:pt-0 xl:pl-8 relative z-10">
                                    <div className="flex flex-col xl:items-end text-left xl:text-right mb-6 xl:mb-0">
                                        <div className="flex items-center gap-1.5 text-yellow-500 mb-1">
                                            <Star size={16} fill="currentColor" />
                                            <span className="font-bold text-primary">{dataset.rating}</span>
                                        </div>
                                        <div className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mb-6">Auratral Quality Score</div>

                                        <div className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mb-1">Starting From</div>
                                        <div className="text-3xl font-bold text-primary">
                                            {dataset.price === 'Custom' ? 'Custom' : `₹${dataset.price.toLocaleString()}`}
                                        </div>
                                    </div>

                                    <Link to={`/dataset/${dataset.id}`} className="btn btn-primary w-full justify-center py-3 text-sm shadow-lg shadow-blue-500/20 group-hover:scale-[1.02] transition-transform">
                                        View Details
                                    </Link>
                                </div>

                            </div>
                        ))}
                    </div>

                    {filteredDatasets.length === 0 && (
                        <div className="text-center py-24 glass-panel mt-4">
                            <div className="inline-flex w-20 h-20 rounded-full bg-slate-800 border border-slate-700 items-center justify-center text-slate-500 mb-6 shadow-inner">
                                <Search size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-primary mb-3">No datasets found</h3>
                            <p className="text-slate-400 max-w-md mx-auto leading-relaxed">
                                We couldn't find any medical datasets matching your current filters. Try adjusting your search or requesting a custom cohort.
                            </p>
                            <button
                                className="mt-8 btn btn-primary py-3 px-8 shadow-lg shadow-purple-500/20"
                                onClick={() => { setActiveCategory('All'); setSearchQuery(''); }}
                            >
                                Clear All Filters
                            </button>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default Gallery;
