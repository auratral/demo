import React from 'react';
import { Link } from 'react-router-dom';
import { Stethoscope, Activity, FileDigit, Dna, Pill, HeartPulse, BrainCircuit, ActivitySquare } from 'lucide-react';
import './CategoryShowcase.css';

const categories = [
    { id: 'trials', name: 'Clinical Trials & Studies', count: '142', icon: Stethoscope, desc: 'RCTs, cohort and observational studies across all phases.' },
    { id: 'ehr', name: 'Electronic Health Records', count: '85', icon: FileDigit, desc: 'Inpatient, outpatient, ICU, and primary care encounters.' },
    { id: 'imaging', name: 'Medical Imaging', count: '114', icon: ActivitySquare, desc: 'X-Ray, MRI, CT, and histological slide datasets.' },
    { id: 'genomics', name: 'Genomics & Proteomics', count: '67', icon: Dna, desc: 'WGS, RNA-Seq, and multi-omic profiling data.' },
    { id: 'pharma', name: 'Pharmacovigilance', count: '43', icon: Pill, desc: 'Post-market safety and adverse drug reaction reporting.' },
    { id: 'public-health', name: 'Public Health', count: '92', icon: HeartPulse, desc: 'Disease registries, mortality, and utilisation data.' },
    { id: 'mental-health', name: 'Mental Health', count: '38', icon: BrainCircuit, desc: 'Psychiatric assessments and behavioral health records.' },
    { id: 'rare-disease', name: 'Rare Diseases', count: '51', icon: Activity, desc: 'Orphan drug trials and rare disease registries.' },
];

const CategoryShowcase = () => {
    return (
        <section className="categories-section">
            <div className="container mx-auto px-8">
                <div className="section-header text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4 text-primary">Browse by Clinical Domain</h2>
                    <p className="text-secondary max-w-2xl mx-auto">
                        Explore our curated catalog of de-identified medical datasets, categorized by clinical specialty and data modality.
                    </p>
                </div>

                <div className="categories-grid">
                    {categories.map((category) => {
                        const Icon = category.icon;
                        return (
                            <Link to={`/gallery?category=${category.id}`} key={category.id} className="category-card glass-panel group">
                                <div className="card-top flex items-start justify-between mb-4">
                                    <div className="icon-wrapper bg-slate-800/80 p-3 rounded-xl border border-glass-border text-blue-400 group-hover:text-purple-400 transition-colors">
                                        <Icon size={24} />
                                    </div>
                                    <span className="badge-count bg-slate-800 text-xs px-2 py-1 rounded-full border border-slate-700 text-slate-300">
                                        {category.count} datasets
                                    </span>
                                </div>

                                <h3 className="text-lg font-semibold text-primary mb-2 group-hover:text-blue-400 transition-colors">
                                    {category.name}
                                </h3>

                                <p className="text-sm text-secondary line-clamp-2">
                                    {category.desc}
                                </p>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default CategoryShowcase;
