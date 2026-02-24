import React, { useState } from 'react';
import {
    Activity, BarChart3, Database, UploadCloud, FileText,
    Star, Users, DollarSign, Settings, Download, CheckCircle, File
} from 'lucide-react';

const ProviderDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');

    return (
        <div className="min-h-screen pt-24 pb-12 font-sans text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header & Rating */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-primary mb-2">Provider Console</h1>
                        <p className="text-slate-400">Manage your dataset portfolio and monitor API consumption.</p>
                    </div>

                    {/* Auratral Rating Section */}
                    <div className="glass-panel px-6 py-4 flex items-center gap-4 border-t-2 border-t-yellow-400 rounded-xl bg-slate-800/30">
                        <div>
                            <div className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-1">Auratral Provider Rating</div>
                            <div className="flex gap-1 text-yellow-400">
                                <Star fill="currentColor" size={20} />
                                <Star fill="currentColor" size={20} />
                                <Star fill="currentColor" size={20} />
                                <Star fill="currentColor" size={20} />
                                <Star fill="currentColor" size={20} />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-primary ml-2">5.0</div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                    {/* Sidebar Navigation */}
                    <div className="lg:col-span-1">
                        <div className="glass-panel p-4 flex flex-col gap-2 sticky top-28">
                            <button
                                onClick={() => setActiveTab('overview')}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${activeTab === 'overview' ? 'bg-blue-500/20 text-blue-400' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}
                            >
                                <BarChart3 size={18} />
                                Overview
                            </button>
                            <button
                                onClick={() => setActiveTab('api')}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${activeTab === 'api' ? 'bg-purple-500/20 text-purple-400' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}
                            >
                                <Activity size={18} />
                                API Usage
                            </button>
                            <button
                                onClick={() => setActiveTab('upload')}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${activeTab === 'upload' ? 'bg-blue-500/20 text-blue-400' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}
                            >
                                <UploadCloud size={18} />
                                Upload Dataset
                            </button>
                            <button
                                onClick={() => setActiveTab('docs')}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${activeTab === 'docs' ? 'bg-orange-500/20 text-orange-400' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}
                            >
                                <FileText size={18} />
                                Documents
                            </button>

                            <hr className="border-slate-800 my-2" />

                            <button className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-all">
                                <Settings size={18} />
                                Account Settings
                            </button>
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="lg:col-span-3">
                        {activeTab === 'overview' && <OverviewTab />}
                        {activeTab === 'api' && <ApiUsageTab />}
                        {activeTab === 'upload' && <UploadDatasetTab />}
                        {activeTab === 'docs' && <DocumentsTab />}
                    </div>

                </div>
            </div>
        </div>
    );
};

// Sub-components for Tabs

const OverviewTab = () => (
    <div className="space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-panel p-6 border-b-2 border-b-blue-500">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-blue-500/10 rounded-lg"><Database className="text-blue-400" size={24} /></div>
                </div>
                <div className="text-3xl font-bold text-primary mb-1">12</div>
                <div className="text-sm text-slate-400 font-medium">Active Datasets</div>
            </div>

            <div className="glass-panel p-6 border-b-2 border-b-purple-500">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-purple-500/10 rounded-lg"><Users className="text-purple-400" size={24} /></div>
                </div>
                <div className="text-3xl font-bold text-primary mb-1">1,402</div>
                <div className="text-sm text-slate-400 font-medium">Consumer Queries</div>
            </div>

            <div className="glass-panel p-6 border-b-2 border-b-blue-500">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-blue-500/10 rounded-lg"><DollarSign className="text-blue-400" size={24} /></div>
                </div>
                <div className="text-3xl font-bold text-primary mb-1">$45.2k</div>
                <div className="text-sm text-slate-400 font-medium">Credits Earned (YTD)</div>
            </div>
        </div>

        {/* Recent Datasets List */}
        <div className="glass-panel p-6">
            <h3 className="text-xl font-bold text-primary mb-6 flex items-center gap-3">
                <FileText className="text-blue-400" size={20} />
                Recent Datasets
            </h3>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                    <thead>
                        <tr className="border-b border-slate-700/50 text-sm text-slate-400">
                            <th className="pb-3 font-semibold pr-4">Dataset Name</th>
                            <th className="pb-3 font-semibold px-4">Status</th>
                            <th className="pb-3 font-semibold px-4">Records</th>
                            <th className="pb-3 font-semibold px-4">Last Updated</th>
                            <th className="pb-3 font-semibold text-right pl-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm text-slate-300">
                        <tr className="border-b border-slate-700/50">
                            <td className="py-4 font-medium text-primary pr-4">Oncology EHR Cohort (2020-2023)</td>
                            <td className="py-4 px-4"><span className="px-2.5 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs font-semibold">Published</span></td>
                            <td className="py-4 px-4">1.2M</td>
                            <td className="py-4 px-4">2 days ago</td>
                            <td className="py-4 pl-4 text-right"><button className="text-blue-400 hover:text-blue-300 font-medium">Manage</button></td>
                        </tr>
                        <tr className="border-b border-slate-700/50">
                            <td className="py-4 font-medium text-primary pr-4">Pediatric MRI Scans - Anonymized</td>
                            <td className="py-4 px-4"><span className="px-2.5 py-1 bg-yellow-500/10 text-yellow-400 rounded-full text-xs font-semibold">Validating</span></td>
                            <td className="py-4 px-4">45,000</td>
                            <td className="py-4 px-4">5 days ago</td>
                            <td className="py-4 pl-4 text-right"><button className="text-blue-400 hover:text-blue-300 font-medium">Manage</button></td>
                        </tr>
                        <tr>
                            <td className="py-4 font-medium text-primary pr-4">Cardiology Clinical Trial Results</td>
                            <td className="py-4 px-4"><span className="px-2.5 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs font-semibold">Published</span></td>
                            <td className="py-4 px-4">8,500</td>
                            <td className="py-4 px-4">2 weeks ago</td>
                            <td className="py-4 pl-4 text-right"><button className="text-blue-400 hover:text-blue-300 font-medium">Manage</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
);

const ApiUsageTab = () => (
    <div className="glass-panel p-8">
        <h2 className="text-2xl font-bold text-primary mb-2">API Usage Analytics</h2>
        <p className="text-slate-400 mb-8 border-b border-slate-800 pb-6">Monitor how consumers are integrating with your published data assets.</p>

        {/* Mock Chart Area */}
        <div className="h-64 rounded-xl border border-slate-700/50 bg-slate-800/20 flex items-end p-4 gap-2 mb-8">
            {/* Generating some random-looking bars for the mock chart */}
            {[40, 60, 45, 80, 50, 90, 75, 100, 85, 120, 95, 110].map((height, i) => (
                <div key={i} className="flex-1 bg-gradient-to-t from-purple-500/80 to-blue-400/80 rounded-t-sm transition-all hover:opacity-80 relative group" style={{ height: `${height}%` }}>
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {height * 14} reqs
                    </div>
                </div>
            ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-800/30 p-5 rounded-xl border border-slate-700/50">
                <h4 className="font-semibold text-primary mb-1">Total API Calls (30d)</h4>
                <div className="text-3xl font-bold text-purple-400">124.5k</div>
                <div className="text-xs text-blue-400 mt-2 flex items-center gap-1">â†‘ 12.5% vs last month</div>
            </div>
            <div className="bg-slate-800/30 p-5 rounded-xl border border-slate-700/50">
                <h4 className="font-semibold text-primary mb-1">Top Consumer</h4>
                <div className="text-xl font-bold text-blue-400 truncate">Mayo Clinic Research Div.</div>
                <div className="text-xs text-slate-400 mt-2">45k requests this month</div>
            </div>
        </div>
    </div>
);

const UploadDatasetTab = () => {
    const [format, setFormat] = useState('CSV');

    return (
        <div className="glass-panel p-8">
            <div className="mb-8 border-b border-slate-800 pb-6">
                <h2 className="text-2xl font-bold text-primary mb-2 flex items-center gap-3">
                    <UploadCloud className="text-blue-400" /> Upload New Dataset
                </h2>
                <p className="text-slate-400">Provision a new dataset to the Auratral marketplace. All uploads go through automated HIPAA/GDPR compliance checks.</p>
            </div>

            <form className="space-y-8">
                {/* Section 1: Basic Info */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-primary flex items-center gap-2"><div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold">1</div> Dataset Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-300 mb-2">Dataset Name</label>
                            <input type="text" className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-primary outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-inner" placeholder="e.g. Multi-center Cardiology EHR Cohort" />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-300 mb-2">Dataset Description</label>
                            <textarea rows="3" className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-primary outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-inner" placeholder="Provide a detailed description of the dataset..."></textarea>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Number of Records (Approx)</label>
                            <input type="text" className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-primary outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-inner" placeholder="e.g. 500,000" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Number of Columns / Features</label>
                            <input type="text" className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-primary outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-inner" placeholder="e.g. 45" />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-300 mb-2">Data Format</label>
                            <div className="flex flex-wrap gap-3">
                                {['CSV', 'JSON', 'DICOM', 'Parquet', 'FHIR'].map(fmt => (
                                    <button
                                        key={fmt} type="button"
                                        onClick={() => setFormat(fmt)}
                                        className={`px-4 py-2 rounded-lg border text-sm font-semibold transition-all ${format === fmt ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-500'}`}
                                    >
                                        {fmt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <hr className="border-slate-800" />

                {/* Verification & Quality */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-primary flex items-center gap-2"><div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold">2</div> Verification & Quality</h3>
                    <div className="bg-slate-800/30 p-5 rounded-xl border border-slate-700/50 space-y-4">
                        <label className="flex items-start gap-3 cursor-pointer group">
                            <div className="mt-0.5 relative flex items-center justify-center">
                                <input type="checkbox" className="peer w-5 h-5 rounded border-slate-600 bg-slate-700 appearance-none checked:bg-blue-500 checked:border-blue-500 transition-all cursor-pointer" />
                                <CheckCircle size={14} className="text-white absolute opacity-0 peer-checked:opacity-100 pointer-events-none" />
                            </div>
                            <div>
                                <div className="font-semibold text-slate-200 group-hover:text-blue-400 transition-colors">Dataset is Verified</div>
                                <div className="text-sm text-slate-400">Check this if your dataset has been validated and cleaned</div>
                            </div>
                        </label>

                        <label className="flex items-start gap-3 cursor-pointer group">
                            <div className="mt-0.5 relative flex items-center justify-center">
                                <input type="checkbox" className="peer w-5 h-5 rounded border-slate-600 bg-slate-700 appearance-none checked:bg-blue-500 checked:border-blue-500 transition-all cursor-pointer" />
                                <CheckCircle size={14} className="text-white absolute opacity-0 peer-checked:opacity-100 pointer-events-none" />
                            </div>
                            <div>
                                <div className="font-semibold text-slate-200 group-hover:text-blue-400 transition-colors">Regularly Updated</div>
                                <div className="text-sm text-slate-400">Check this if you plan to provide regular updates</div>
                            </div>
                        </label>

                        <label className="flex items-start gap-3 cursor-pointer group">
                            <div className="mt-0.5 relative flex items-center justify-center">
                                <input type="checkbox" className="peer w-5 h-5 rounded border-slate-600 bg-slate-700 appearance-none checked:bg-blue-500 checked:border-blue-500 transition-all cursor-pointer" />
                                <CheckCircle size={14} className="text-white absolute opacity-0 peer-checked:opacity-100 pointer-events-none" />
                            </div>
                            <div>
                                <div className="font-semibold text-slate-200 group-hover:text-blue-400 transition-colors">API Access Available</div>
                                <div className="text-sm text-slate-400">Check this if you can provide API access to this dataset</div>
                            </div>
                        </label>
                    </div>
                </div>

                <hr className="border-slate-800" />

                {/* Section 3: File Upload */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-primary flex items-center gap-2"><div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold">3</div> Data & Metadata Payload</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="border-2 border-dashed border-slate-700 rounded-xl p-8 text-center bg-slate-800/30 hover:bg-slate-800/50 transition-colors cursor-pointer group">
                            <Download className="mx-auto text-slate-500 group-hover:text-blue-400 transition-colors mb-3" size={36} />
                            <h4 className="text-md font-bold text-primary mb-1">Upload Data Files</h4>
                            <p className="text-xs text-slate-400 mb-4">Support for up to 50GB via web.</p>
                            <button type="button" className="btn btn-outline py-2 text-xs bg-slate-800 hover:bg-slate-700">Browse Data</button>
                        </div>

                        <div className="border-2 border-dashed border-slate-700 rounded-xl p-8 text-center bg-slate-800/30 hover:bg-slate-800/50 transition-colors cursor-pointer group">
                            <FileText className="mx-auto text-slate-500 group-hover:text-blue-400 transition-colors mb-3" size={36} />
                            <h4 className="text-md font-bold text-primary mb-1">Upload Metadata</h4>
                            <p className="text-xs text-slate-400 mb-4">Data dictionaries, codebooks (PDF/JSON).</p>
                            <button type="button" className="btn btn-outline py-2 text-xs bg-slate-800 hover:bg-slate-700">Browse Metadata</button>
                        </div>
                    </div>
                </div>

                <hr className="border-slate-800" />

                {/* Section 4: Compliance */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-primary flex items-center gap-2"><div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold">4</div> Compliance Affirmation</h3>
                    <div className="bg-slate-800/30 p-5 rounded-xl border border-slate-700/50 space-y-3">
                        <label className="flex items-start gap-3 cursor-pointer">
                            <input type="checkbox" className="mt-1 w-4 h-4 rounded border-slate-600 text-blue-500 bg-slate-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900" />
                            <span className="text-sm text-slate-300">I certify that this dataset has been completely de-identified in accordance with the HIPAA Privacy Rule (Safe Harbor method or Expert Determination).</span>
                        </label>
                        <label className="flex items-start gap-3 cursor-pointer">
                            <input type="checkbox" className="mt-1 w-4 h-4 rounded border-slate-600 text-blue-500 bg-slate-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900" />
                            <span className="text-sm text-slate-300">I confirm that uploading this data does not violate any institutional review board (IRB) restrictions or patient consent agreements.</span>
                        </label>
                    </div>
                </div>

                <div className="pt-4 flex justify-end gap-4">
                    <button type="button" className="btn btn-outline hover:bg-slate-800">Save as Draft</button>
                    <button type="button" className="btn bg-blue-600 hover:bg-blue-500 border border-blue-500 text-white shadow-lg shadow-blue-500/20">Submit for Validation</button>
                </div>
            </form>
        </div>
    );
};

const DocumentsTab = () => (
    <div className="glass-panel p-8">
        <h2 className="text-2xl font-bold text-primary mb-2 flex items-center gap-3">
            <FileText className="text-orange-400" /> My Documents
        </h2>
        <p className="text-slate-400 mb-8 border-b border-slate-800 pb-6">Access your dataset pricing documents, receipts, and API guidelines here.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5 flex justify-between items-center hover:border-orange-500/30 transition-colors">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-red-400/10 rounded-lg text-red-400"><File size={24} /></div>
                    <div>
                        <h4 className="font-bold text-primary">Dataset Pricing Guidelines.pdf</h4>
                        <div className="text-xs text-slate-400">Added Oct 12, 2026 â€¢ 2.4 MB</div>
                    </div>
                </div>
                <button className="text-slate-400 hover:text-white"><Download size={20} /></button>
            </div>

            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5 flex justify-between items-center hover:border-orange-500/30 transition-colors">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-red-400/10 rounded-lg text-red-400"><File size={24} /></div>
                    <div>
                        <h4 className="font-bold text-primary">AuraAPI Documentation v2.pdf</h4>
                        <div className="text-xs text-slate-400">Added Nov 02, 2026 â€¢ 5.1 MB</div>
                    </div>
                </div>
                <button className="text-slate-400 hover:text-white"><Download size={20} /></button>
            </div>

            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5 flex justify-between items-center hover:border-orange-500/30 transition-colors">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-400/10 rounded-lg text-blue-400"><File size={24} /></div>
                    <div>
                        <h4 className="font-bold text-primary">Payout Receipt - Sep 2026</h4>
                        <div className="text-xs text-slate-400">Added Oct 01, 2026 â€¢ 120 KB</div>
                    </div>
                </div>
                <button className="text-slate-400 hover:text-white"><Download size={20} /></button>
            </div>

            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5 flex justify-between items-center hover:border-orange-500/30 transition-colors">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-red-400/10 rounded-lg text-red-400"><File size={24} /></div>
                    <div>
                        <h4 className="font-bold text-primary">Legal Terms & Addendums.pdf</h4>
                        <div className="text-xs text-slate-400">Added Jan 15, 2026 â€¢ 1.1 MB</div>
                    </div>
                </div>
                <button className="text-slate-400 hover:text-white"><Download size={20} /></button>
            </div>
        </div>
    </div>
);

export default ProviderDashboard;
