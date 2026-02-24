import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, ShieldCheck, Database, Download, Code2, Box, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DatasetDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    // Realistically we'd fetch this based on the ID, but hardcoded mock for the MVP flow.
    const dataset = {
        id: id || 'AUR-EHR-00087',
        name: 'Longitudinal ICU Encounters â€” Critical Care Dataset',
        source: 'Multi-site Academic Medical Center Network',
        category: 'EHR',
        subCategory: 'ICU & Critical Care',
        rating: 4.9,
        reviews: 124,
        records: '186,000',
        variables: 247,
        formats: ['CSV', 'Parquet', 'JSON', 'FHIR R4'],
        compliance: ['HIPAA Safe Harbor', 'GDPR Article 9 Ready'],
        updateFrequency: 'Annually Refreshed',
        price: 149,
        description: `A comprehensive, de-identified longitudinal dataset of intensive care unit (ICU) encounters. This clinical corpus includes high-resolution temporal data covering vital signs, laboratory measurements, medication administration records, fluid balance, and clinical notes spanning over a decade of admissions. 
    
Designed specifically for training clinical prediction models (e.g., sepsis onset, mortality risk, length of stay), epidemiological research, and health economics analysis.`,
        qualityScore: 92,
    };

    const [activeTab, setActiveTab] = useState('overview');

    const handleProtectedAction = (e, path) => {
        e.preventDefault();
        if (!user) {
            navigate('/login');
        } else if (path) {
            navigate(path);
        } else {
            alert('This action requires a simulated backend response.');
        }
    };

    return (
        <div className="pt-32 pb-16 min-h-screen">

            {/* Header context */}
            <div className="bg-slate-800/50 border-b border-glass-border pt-6 pb-12 mb-8">
                <div className="container mx-auto px-8">
                    <Link to="/gallery" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-blue-400 mb-6 transition-colors">
                        <ArrowLeft size={16} /> Back to Gallery
                    </Link>

                    <div className="flex flex-col lg:flex-row gap-8 justify-between items-start">
                        <div className="max-w-3xl">
                            <div className="flex gap-2 mb-4">
                                <span className="text-xs font-semibold px-2 py-1 rounded bg-slate-800 text-blue-400 border border-slate-700">{dataset.category}</span>
                                <span className="text-xs px-2 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">{dataset.subCategory}</span>
                                <span className="text-xs px-2 py-1 rounded bg-slate-900 text-slate-400 border border-slate-700 font-mono">{dataset.id}</span>
                            </div>

                            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4 leading-tight">{dataset.name}</h1>

                            <div className="flex items-center gap-4 text-sm text-slate-300 mb-6">
                                <div className="flex items-center gap-1 text-yellow-500">
                                    <Star size={16} fill="currentColor" />
                                    <span className="font-bold text-primary">{dataset.rating}</span>
                                    <span className="text-slate-500">({dataset.reviews} verified reviews)</span>
                                </div>
                                <div className="w-1 h-1 rounded-full bg-slate-600"></div>
                                <div className="flex items-center gap-2 text-slate-400">
                                    <ShieldCheck size={16} className="text-blue-500" /> Auratral Compliance Verified
                                </div>
                            </div>

                            <p className="text-secondary leading-relaxed">{dataset.description}</p>
                        </div>

                        {/* Sticky Pricing Panel Component (visually inside header here but would float) */}
                        <div className="glass-panel p-6 w-full lg:w-80 shrink-0 relative lg:-mt-4 lg:sticky lg:top-32 border-purple-500/20">
                            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">Base Research License</div>
                            <div className="flex items-baseline gap-2 mb-4">
                                <span className="text-4xl font-bold text-primary">${dataset.price}</span>
                                <span className="text-slate-500 text-sm">/ subset</span>
                            </div>

                            <button
                                onClick={(e) => handleProtectedAction(e, '/customize')}
                                className="w-full btn btn-primary py-3 justify-center mb-3 cursor-pointer text-center block"
                            >
                                Customize Cohort & Buy
                            </button>
                            <button
                                onClick={(e) => handleProtectedAction(e, null)}
                                className="w-full btn btn-outline py-2 text-sm justify-center mb-6 cursor-pointer text-center block"
                            >
                                Request Free Data Sample
                            </button>

                            <div className="space-y-3 pt-4 border-t border-glass-border text-sm text-slate-300">
                                <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-blue-400" /> {dataset.records} Patient Records</div>
                                <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-blue-400" /> {dataset.variables} Clinical Variables</div>
                                <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-blue-400" /> Medical API Access</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-8 flex gap-12">
                {/* Main Details Area */}
                <div className="flex-grow max-w-4xl space-y-12">

                    <div className="glass-panel p-8">
                        <h2 className="text-2xl font-bold text-primary mb-6 border-b border-glass-border pb-4">Clinical Metadata</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">

                            <div>
                                <div className="text-xs text-slate-500 mb-1">Data Source Attribution</div>
                                <div className="text-primary text-sm font-medium">{dataset.source}</div>
                            </div>
                            <div>
                                <div className="text-xs text-slate-500 mb-1">Auratral Quality Score (0-100)</div>
                                <div className="text-blue-400 text-lg font-bold flex items-baseline gap-1">
                                    {dataset.qualityScore} <span className="text-xs font-normal text-slate-500">/ High Completeness</span>
                                </div>
                            </div>
                            <div>
                                <div className="text-xs text-slate-500 mb-1">Update Frequency</div>
                                <div className="text-primary text-sm font-medium">{dataset.updateFrequency}</div>
                            </div>
                            <div>
                                <div className="text-xs text-slate-500 mb-1">De-Identification Method</div>
                                <div className="text-primary text-sm font-medium">{dataset.compliance[0]}</div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel p-8">
                        <h2 className="text-2xl font-bold text-primary mb-6 border-b border-glass-border pb-4">Delivery Options</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl flex flex-col items-center text-center hover:border-purple-500/50 transition-colors">
                                <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center text-slate-300 mb-4 border border-slate-700 shadow-lg">
                                    <Download size={24} />
                                </div>
                                <h3 className="font-bold text-primary mb-2">Direct Download</h3>
                                <p className="text-xs text-slate-400 mb-4">Secure, signed URLs for raw file extraction.</p>
                                <div className="flex flex-wrap justify-center gap-1 mt-auto">
                                    {dataset.formats.filter(f => ['CSV', 'Parquet', 'JSON'].includes(f)).map(f => (
                                        <span key={f} className="text-[10px] bg-slate-800 border border-slate-600 px-1.5 py-0.5 rounded text-slate-300">{f}</span>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl flex flex-col items-center text-center hover:border-purple-500/50 transition-colors">
                                <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center text-slate-300 mb-4 border border-slate-700 shadow-lg">
                                    <Code2 size={24} />
                                </div>
                                <h3 className="font-bold text-primary mb-2">REST API Endpoint</h3>
                                <p className="text-xs text-slate-400 mb-4">Paginated, queryable access via Auratral keys.</p>
                                <div className="flex flex-wrap justify-center gap-1 mt-auto">
                                    <span className="text-[10px] bg-slate-800 border border-slate-600 px-1.5 py-0.5 rounded text-slate-300">JSON</span>
                                    <span className="text-[10px] bg-slate-800 border border-slate-600 px-1.5 py-0.5 rounded text-blue-400 font-semibold border-blue-500/30">FHIR R4</span>
                                </div>
                            </div>

                            <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl flex flex-col items-center text-center hover:border-purple-500/50 transition-colors">
                                <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center text-slate-300 mb-4 border border-slate-700 shadow-lg">
                                    <Box size={24} />
                                </div>
                                <h3 className="font-bold text-primary mb-2">Docker Container</h3>
                                <p className="text-xs text-slate-400">Pre-loaded in PostgreSQL with Jupyter env.</p>
                                <div className="mt-auto pt-4 text-[10px] font-bold text-purple-400 uppercase tracking-widest">
                                    Enterprise Tier
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DatasetDetail;
