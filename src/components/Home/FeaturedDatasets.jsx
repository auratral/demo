import React from 'react';
import { Link } from 'react-router-dom';
import { Star, FileText, Database, ShieldCheck, Download, Code2, Box } from 'lucide-react';
import './FeaturedDatasets.css';

const datasets = [
    {
        id: 'AUR-EHR-00087',
        name: 'Longitudinal ICU Encounters â€” Critical Care Dataset',
        category: 'EHR',
        subCategory: 'ICU & Critical Care',
        records: '186,000',
        formats: ['CSV', 'Parquet', 'FHIR'],
        compliance: ['HIPAA Safe Harbor', 'GDPR-Ready'],
        rating: 4.9,
        reviews: 124,
        startingPrice: '149',
        delivery: ['api', 'docker'],
    },
    {
        id: 'AUR-IMG-00143',
        name: 'High-Res Chest X-Ray Annotated Dataset with Clinical Notes',
        category: 'Imaging',
        subCategory: 'Radiology',
        records: '45,200',
        formats: ['DICOM', 'JSON'],
        compliance: ['HIPAA Safe Harbor'],
        rating: 4.8,
        reviews: 89,
        startingPrice: '299',
        delivery: ['download'],
    },
    {
        id: 'AUR-PVM-00021',
        name: 'FDA FAERS Curated Extract: Post-Market Surveillance',
        category: 'Pharmacovigilance',
        subCategory: 'Adverse Drug Reactions',
        records: '2.4M',
        formats: ['CSV', 'Parquet', 'SQL'],
        compliance: ['Aggregated', 'Open License'],
        rating: 4.7,
        reviews: 215,
        startingPrice: '599',
        delivery: ['api', 'docker', 'download'],
    },
    {
        id: 'AUR-GEN-00092',
        name: 'Cancer Genome Atlas Subset: Oncology Biomarkers',
        category: 'Genomics',
        subCategory: 'Whole Genome Sequencing',
        records: '12,500',
        formats: ['VCF', 'CSV', 'JSON'],
        compliance: ['HIPAA Safe Harbor', 'IRB DUA'],
        rating: 5.0,
        reviews: 42,
        startingPrice: 'Custom',
        delivery: ['docker'],
    }
];

const FeaturedDatasets = () => {
    return (
        <section className="featured-section">
            <div className="container mx-auto px-8">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-3xl font-bold mb-2 text-primary">Featured Datasets</h2>
                        <p className="text-secondary">Highly-rated datasets recently cleared by our clinical compliance team.</p>
                    </div>
                    <Link to="/gallery" className="btn btn-outline hidden md:inline-flex">View All Datasets</Link>
                </div>

                <div className="datasets-carousel">
                    {datasets.map((dataset) => (
                        <div key={dataset.id} className="dataset-card glass-panel group">
                            <div className="mb-4">
                                <div className="flex gap-2 mb-3 flex-wrap">
                                    <span className="text-xs font-semibold px-2 py-1 rounded bg-slate-800 text-blue-400 border border-slate-700">
                                        {dataset.category}
                                    </span>
                                    <span className="text-xs px-2 py-1 rounded bg-slate-800/50 text-slate-300 border border-slate-700/50">
                                        {dataset.subCategory}
                                    </span>
                                </div>
                                <h3 className="text-lg font-semibold text-primary mb-2 line-clamp-2 leading-tight group-hover:text-purple-400 transition-colors">
                                    {dataset.name}
                                </h3>

                                <div className="flex items-center gap-1 text-sm text-yellow-500 mb-4">
                                    <Star size={14} fill="currentColor" />
                                    <span className="font-medium text-slate-200">{dataset.rating}</span>
                                    <span className="text-slate-500 ml-1">({dataset.reviews} reviews)</span>
                                </div>
                            </div>

                            <div className="dataset-meta mb-5 space-y-2">
                                <div className="meta-row">
                                    <Database size={14} className="text-slate-400" />
                                    <span>{dataset.records} Patient Records</span>
                                </div>
                                <div className="meta-row">
                                    <FileText size={14} className="text-slate-400" />
                                    <div className="flex gap-1">
                                        {dataset.formats.map((fmt) => (
                                            <span key={fmt} className="format-tag">{fmt}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="meta-row mt-2 pt-2 border-t border-glass-border">
                                    <ShieldCheck size={14} className="text-blue-400" />
                                    <div className="flex gap-1 flex-wrap">
                                        {dataset.compliance.map((comp) => (
                                            <span key={comp} className="text-xs text-blue-300">{comp}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="dataset-footer mt-auto pt-4 border-t border-glass-border flex items-center justify-between">
                                <div>
                                    <div className="text-xs text-slate-400 mb-1">Starting from</div>
                                    <div className="font-bold text-lg text-primary">
                                        {dataset.startingPrice === 'Custom' ? 'Enterprise Quote' : `$${dataset.startingPrice}`}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    {dataset.delivery.includes('download') && <span title="Direct Download" className="delivery-icon"><Download size={16} /></span>}
                                    {dataset.delivery.includes('api') && <span title="API Access" className="delivery-icon"><Code2 size={16} /></span>}
                                    {dataset.delivery.includes('docker') && <span title="Docker Container" className="delivery-icon"><Box size={16} /></span>}
                                </div>
                            </div>

                            <Link to={`/dataset/${dataset.id}`} className="absolute inset-0 z-10"><span className="sr-only">View Details</span></Link>
                        </div>
                    ))}
                </div>

                <div className="mt-8 text-center md:hidden">
                    <Link to="/gallery" className="btn btn-outline w-full justify-center">View All Datasets</Link>
                </div>
            </div>
        </section>
    );
};

export default FeaturedDatasets;
