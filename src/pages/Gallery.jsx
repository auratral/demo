import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Database, ShieldCheck, Download, Code2, Box, Star, ChevronDown, Activity, ArrowRight, X } from 'lucide-react';
import { allDatasets as fallbackDatasets } from '../data/datasetsRegistry';

const categories = ['All', 'EHR', 'Imaging', 'Pharma', 'Genomics', 'Mental Health', 'Trials'];

const priceRanges = [
    { label: 'Under ₹15,000', min: 0, max: 15000 },
    { label: '₹15,000 – ₹25,000', min: 15000, max: 25000 },
    { label: '₹25,000 – ₹40,000', min: 25000, max: 40000 },
    { label: 'Above ₹40,000', min: 40000, max: Infinity },
];

const formatOptions = ['JSON', 'CSV', 'Parquet', 'FHIR R4', 'DICOM', 'VCF', 'SQL'];

const sortOptions = [
    { label: 'Most Relevant', key: 'relevant' },
    { label: 'Price: Low to High', key: 'price_asc' },
    { label: 'Price: High to Low', key: 'price_desc' },
    { label: 'Highest Rated', key: 'rating' },
    { label: 'Record Count', key: 'records' },
];

const Gallery = () => {
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPriceRange, setSelectedPriceRange] = useState(null);
    const [selectedFormats, setSelectedFormats] = useState([]);
    const [sortBy, setSortBy] = useState('relevant');

    // Load instantly from local registry — no Firestore delay
    const datasets = fallbackDatasets;

    const toggleFormat = (fmt) => {
        setSelectedFormats(prev =>
            prev.includes(fmt) ? prev.filter(f => f !== fmt) : [...prev, fmt]
        );
    };

    const clearAllFilters = () => {
        setActiveCategory('All');
        setSearchQuery('');
        setSelectedPriceRange(null);
        setSelectedFormats([]);
        setSortBy('relevant');
    };

    const activeFilterCount = (activeCategory !== 'All' ? 1 : 0)
        + (searchQuery ? 1 : 0)
        + (selectedPriceRange !== null ? 1 : 0)
        + selectedFormats.length;

    const filteredDatasets = useMemo(() => {
        let results = datasets.filter(ds => {
            // Category filter
            if (activeCategory !== 'All' && ds.category !== activeCategory) return false;

            // Search filter
            if (searchQuery) {
                const q = searchQuery.toLowerCase();
                if (!ds.name.toLowerCase().includes(q) && !ds.description.toLowerCase().includes(q) && !ds.category.toLowerCase().includes(q)) return false;
            }

            // Price range filter
            if (selectedPriceRange !== null) {
                const range = priceRanges[selectedPriceRange];
                const price = typeof ds.price === 'number' ? ds.price : 0;
                if (price < range.min || price >= range.max) return false;
            }

            // Export format filter
            if (selectedFormats.length > 0) {
                const dsFormats = (ds.formats || []).map(f => f.toUpperCase());
                const hasMatch = selectedFormats.some(f => dsFormats.includes(f.toUpperCase()));
                if (!hasMatch) return false;
            }

            return true;
        });

        // Sorting
        if (sortBy === 'price_asc') {
            results = [...results].sort((a, b) => (a.price || 0) - (b.price || 0));
        } else if (sortBy === 'price_desc') {
            results = [...results].sort((a, b) => (b.price || 0) - (a.price || 0));
        } else if (sortBy === 'rating') {
            results = [...results].sort((a, b) => (b.rating || 0) - (a.rating || 0));
        } else if (sortBy === 'records') {
            results = [...results].sort((a, b) => (parseInt(b.records) || 0) - (parseInt(a.records) || 0));
        }

        return results;
    }, [datasets, activeCategory, searchQuery, selectedPriceRange, selectedFormats, sortBy]);

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
                        {searchQuery && (
                            <button onClick={() => setSearchQuery('')} className="mr-2 text-slate-500 hover:text-slate-300 transition-colors">
                                <X size={18} />
                            </button>
                        )}
                        <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-3 px-8 rounded-full hover:shadow-lg hover:shadow-purple-500/25 transition-all text-sm tracking-wide">
                            Search
                        </button>
                    </div>
                </div>
            </div>

            {/* Active Filter Tags */}
            {activeFilterCount > 0 && (
                <div className="container mx-auto px-8 relative z-10 mb-4">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs text-slate-500 font-semibold uppercase tracking-widest mr-1">Active Filters:</span>
                        {activeCategory !== 'All' && (
                            <span className="inline-flex items-center gap-1.5 bg-blue-500/15 border border-blue-500/30 text-blue-400 text-xs font-semibold px-3 py-1 rounded-full">
                                {activeCategory}
                                <X size={12} className="cursor-pointer hover:text-white" onClick={() => setActiveCategory('All')} />
                            </span>
                        )}
                        {selectedPriceRange !== null && (
                            <span className="inline-flex items-center gap-1.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold px-3 py-1 rounded-full">
                                {priceRanges[selectedPriceRange].label}
                                <X size={12} className="cursor-pointer hover:text-white" onClick={() => setSelectedPriceRange(null)} />
                            </span>
                        )}
                        {selectedFormats.map(fmt => (
                            <span key={fmt} className="inline-flex items-center gap-1.5 bg-purple-500/15 border border-purple-500/30 text-purple-400 text-xs font-semibold px-3 py-1 rounded-full">
                                {fmt}
                                <X size={12} className="cursor-pointer hover:text-white" onClick={() => toggleFormat(fmt)} />
                            </span>
                        ))}
                        <button onClick={clearAllFilters} className="text-xs text-red-400 hover:text-red-300 font-semibold ml-2 transition-colors">
                            Clear All
                        </button>
                    </div>
                </div>
            )}

            {/* Main Content Layout */}
            <div className="container mx-auto px-8 flex flex-col lg:flex-row gap-12 relative z-10">

                {/* Sidebar Filters */}
                <div className="lg:w-1/4 shrink-0">
                    <div className="glass-panel p-8 sticky top-32 border-t-2 border-t-purple-500">
                        <div className="flex items-center justify-between mb-8 pb-4 border-b border-glass-border">
                            <h3 className="text-primary font-bold text-lg flex items-center gap-2">
                                <Filter size={18} className="text-purple-400" /> Filters
                                {activeFilterCount > 0 && (
                                    <span className="ml-1 bg-purple-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                        {activeFilterCount}
                                    </span>
                                )}
                            </h3>
                            <button
                                className="text-xs text-slate-500 hover:text-blue-400 font-semibold transition-colors"
                                onClick={clearAllFilters}
                            >
                                Clear All
                            </button>
                        </div>

                        {/* Medical Domain Filter */}
                        <div className="mb-8">
                            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4 flex items-center justify-between">
                                Medical Domain <ChevronDown size={14} />
                            </h3>
                            <div className="space-y-3">
                                {categories.map(cat => (
                                    <div
                                        key={cat}
                                        className="flex items-center gap-3 cursor-pointer group"
                                        onClick={() => setActiveCategory(cat)}
                                    >
                                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${activeCategory === cat ? 'bg-blue-500 border-blue-500' : 'bg-slate-800 border-slate-600 group-hover:border-blue-400'}`}>
                                            {activeCategory === cat && <div className="w-2.5 h-2.5 bg-slate-900 rounded-sm"></div>}
                                        </div>
                                        <span
                                            className={`text-sm tracking-wide ${activeCategory === cat ? 'text-blue-400 font-bold' : 'text-slate-300 font-medium group-hover:text-primary transition-colors'}`}
                                        >
                                            {cat}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Price Range Filter */}
                        <div className="mb-8">
                            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4 flex items-center justify-between">
                                Price Range <ChevronDown size={14} />
                            </h3>
                            <div className="space-y-3">
                                {priceRanges.map((range, idx) => (
                                    <div
                                        key={range.label}
                                        className="flex items-center gap-3 cursor-pointer group"
                                        onClick={() => setSelectedPriceRange(selectedPriceRange === idx ? null : idx)}
                                    >
                                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedPriceRange === idx ? 'bg-emerald-500 border-emerald-500' : 'bg-slate-800 border-slate-600 group-hover:border-emerald-400'}`}>
                                            {selectedPriceRange === idx && <div className="w-2.5 h-2.5 bg-slate-900 rounded-sm"></div>}
                                        </div>
                                        <span className={`text-sm tracking-wide ${selectedPriceRange === idx ? 'text-emerald-400 font-bold' : 'text-slate-300 font-medium group-hover:text-primary transition-colors'}`}>
                                            {range.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Export Format Filter */}
                        <div className="mb-4">
                            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4 flex items-center justify-between">
                                Export Format <ChevronDown size={14} />
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {formatOptions.map(fmt => (
                                    <span
                                        key={fmt}
                                        onClick={() => toggleFormat(fmt)}
                                        className={`px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-all duration-200 shadow-sm ${
                                            selectedFormats.includes(fmt)
                                                ? 'bg-purple-500/20 border border-purple-500 text-purple-400 shadow-purple-500/10'
                                                : 'bg-slate-800 border border-slate-700 text-slate-400 hover:border-purple-500 hover:text-purple-400'
                                        }`}
                                    >
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
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-slate-900 border border-slate-700 text-sm text-primary rounded-lg px-4 py-2 outline-none focus:border-purple-500 font-medium"
                            >
                                {sortOptions.map(opt => (
                                    <option key={opt.key} value={opt.key}>{opt.label}</option>
                                ))}
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
                                onClick={clearAllFilters}
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
