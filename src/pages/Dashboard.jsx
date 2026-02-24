import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Database, Key, CreditCard, Activity, ArrowRight, Download, Settings, FileText, File } from 'lucide-react';

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');

    // Mock user data
    const user = {
        name: 'Jane Doe',
        institution: 'Global Health Institute',
        plan: 'Academic Research',
        credits: 12500
    };

    const activeDatasets = [
        { id: 'AUR-EHR-00087', name: 'Longitudinal ICU Encounters', access: 'API & Download', status: 'Active' },
        { id: 'AUR-IMG-00102', name: 'Annotated Chest X-Rays', access: 'Docker Env', status: 'Provisioning' }
    ];

    const recentActivity = [
        { action: 'API Key Generated', time: '2 hours ago', detail: 'Production Key - Read Only' },
        { action: 'Dataset Downloaded', time: 'Yesterday', detail: 'AUR-EHR-00087 Subset (JSON)' },
        { action: 'Subscription Renewed', time: 'Oct 1, 2026', detail: 'Academic Research Tier' }
    ];

    return (
        <div className="pt-32 pb-16 min-h-screen">
            <div className="container mx-auto px-8 max-w-7xl">

                {/* Dashboard Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                    <div>
                        <h1 className="text-3xl font-bold text-primary mb-2">Welcome back, {user.name}</h1>
                        <p className="text-secondary flex items-center gap-2">
                            <span>{user.institution}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                            <span className="text-blue-400">{user.plan}</span>
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <Link to="/gallery" className="btn btn-outline py-2.5 px-6 flex items-center gap-2">
                            Browse Datasets
                        </Link>
                        <Link to="/custom-request" className="btn btn-primary py-2.5 px-6 flex items-center gap-2">
                            New Request <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex gap-2 mb-8 border-b border-slate-800 pb-px">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`px-6 py-3 text-sm font-semibold transition-all flex items-center gap-2 ${activeTab === 'overview' ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-500/5' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                        <Activity size={16} /> Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('docs')}
                        className={`px-6 py-3 text-sm font-semibold transition-all flex items-center gap-2 ${activeTab === 'docs' ? 'text-orange-400 border-b-2 border-orange-400 bg-orange-500/5' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                        <FileText size={16} /> My Documents
                    </button>
                </div>

                {/* Main Content Area */}
                {activeTab === 'overview' ? (
                    <>
                        {/* KPI Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                            <div className="glass-panel p-6 border-t-2 border-t-purple-500">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Active Cohorts</h3>
                                    <Database size={20} className="text-purple-400" />
                                </div>
                                <div className="text-3xl font-bold text-primary mb-1">3</div>
                                <div className="text-xs text-blue-400 flex items-center gap-1">
                                    <Activity size={12} /> Syncing live updates
                                </div>
                            </div>

                            <div className="glass-panel p-6 border-t-2 border-t-blue-500">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">API Requests</h3>
                                    <Activity size={20} className="text-blue-400" />
                                </div>
                                <div className="text-3xl font-bold text-primary mb-1">12.4k</div>
                                <div className="text-xs text-slate-500">Last 30 days</div>
                            </div>

                            <div className="glass-panel p-6 border-t-2 border-t-indigo-500">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Storage Used</h3>
                                    <Download size={20} className="text-indigo-400" />
                                </div>
                                <div className="text-3xl font-bold text-primary mb-1">42.8 GB</div>
                                <div className="text-xs text-slate-500">of 100 GB (Academic Plan)</div>
                            </div>

                            <div className="glass-panel p-6 border-t-2 border-t-pink-500">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Compute Credits</h3>
                                    <CreditCard size={20} className="text-pink-400" />
                                </div>
                                <div className="text-3xl font-bold text-primary mb-1">{user.credits.toLocaleString()}</div>
                                <div className="text-xs text-slate-500">Available for Cloud Docker env</div>
                            </div>
                        </div>

                        {/* Main Content Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                            {/* Left Column: Datasets & API */}
                            <div className="lg:col-span-2 space-y-8">

                                {/* Provisioned Datasets */}
                                <div className="glass-panel p-8">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                                            <Database size={20} className="text-purple-400" /> Provisioned Datasets
                                        </h2>
                                        <button className="text-sm text-blue-400 hover:text-blue-300 font-semibold">View All</button>
                                    </div>

                                    <div className="space-y-4">
                                        {activeDatasets.map((ds, idx) => (
                                            <div key={idx} className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-purple-500/30 transition-colors">
                                                <div>
                                                    <div className="text-xs font-mono text-slate-400 mb-1">{ds.id}</div>
                                                    <h3 className="font-bold text-primary">{ds.name}</h3>
                                                    <div className="text-sm text-slate-400 mt-1">Access: {ds.access}</div>
                                                </div>
                                                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4">
                                                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${ds.status === 'Active' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'}`}>
                                                        {ds.status}
                                                    </span>
                                                    <button className="btn btn-outline py-1.5 px-4 text-xs">Manage</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* API Keys */}
                                <div className="glass-panel p-8">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                                            <Key size={20} className="text-blue-400" /> API Keys
                                        </h2>
                                        <button className="btn btn-primary py-1.5 px-4 text-xs">Generate New Key</button>
                                    </div>

                                    <div className="bg-black/20 border border-white/10 rounded-lg overflow-hidden">
                                        <table className="w-full text-left text-sm">
                                            <thead className="bg-slate-800/80 border-b border-slate-700">
                                                <tr>
                                                    <th className="px-6 py-4 font-semibold text-slate-300">Name</th>
                                                    <th className="px-6 py-4 font-semibold text-slate-300">Created</th>
                                                    <th className="px-6 py-4 font-semibold text-slate-300">Last Used</th>
                                                    <th className="px-6 py-4 text-right"></th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-700/50 text-slate-300">
                                                <tr>
                                                    <td className="px-6 py-4 font-medium">Production Data Pipeline</td>
                                                    <td className="px-6 py-4 text-slate-400">Oct 12, 2026</td>
                                                    <td className="px-6 py-4 text-slate-400">2 mins ago</td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button className="text-slate-400 hover:text-white"><Settings size={16} /></button>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="px-6 py-4 font-medium">Jupyter Research Env</td>
                                                    <td className="px-6 py-4 text-slate-400">Nov 03, 2026</td>
                                                    <td className="px-6 py-4 text-slate-400">Yesterday</td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button className="text-slate-400 hover:text-white"><Settings size={16} /></button>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Activity & Billing */}
                            <div className="space-y-8">
                                {/* Activity Feed */}
                                <div className="glass-panel p-8">
                                    <h2 className="text-xl font-bold text-primary mb-6">Recent Activity</h2>
                                    <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-slate-700/50">
                                        {recentActivity.map((log, idx) => (
                                            <div key={idx} className="relative flex items-start pl-8 md:pl-0">
                                                {/* Timeline Dot */}
                                                <div className="absolute left-0 md:left-1/2 w-4 h-4 rounded-full bg-purple-500 border-2 border-primary -translate-x-1.5 md:-translate-x-2 mt-1 z-10 shadow-lg shadow-purple-500/50"></div>

                                                <div className="md:w-1/2 md:pr-8 md:text-right hidden md:block">
                                                    <div className="text-xs text-slate-500 font-semibold">{log.time}</div>
                                                </div>

                                                <div className="md:w-1/2 md:pl-8 w-full block">
                                                    <div className="text-xs text-slate-500 font-semibold block md:hidden mb-1">{log.time}</div>
                                                    <h4 className="font-bold text-sm text-primary">{log.action}</h4>
                                                    <p className="text-xs text-slate-400 mt-1">{log.detail}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Quick CTA */}
                                <div className="bg-gradient-to-br from-purple-900/40 to-slate-900 border border-purple-500/30 rounded-xl p-8 relative overflow-hidden">
                                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-500/20 blur-2xl rounded-full"></div>
                                    <h3 className="font-bold text-primary mb-2 relative z-10">Need a specialized cohort?</h3>
                                    <p className="text-sm text-slate-400 mb-6 relative z-10">Our Clinical Ops team can curate custom data tailored to your inclusion criteria.</p>
                                    <Link to="/custom-request" className="btn bg-white text-slate-900 hover:bg-slate-200 w-full py-2.5 text-sm relative z-10">
                                        Request Custom Data
                                    </Link>
                                </div>
                            </div>

                        </div>
                    </>
                ) : (
                    <DocumentsTab />
                )}
            </div>
        </div>
    );
};

const DocumentsTab = () => (
    <div className="glass-panel p-8">
        <h2 className="text-2xl font-bold text-primary mb-2 flex items-center gap-3">
            <FileText className="text-orange-400" /> Consumer Documents
        </h2>
        <p className="text-slate-400 mb-8 border-b border-slate-800 pb-6">Access your executed Data Use Agreements (DUAs), invoices, and API access credentials here.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5 flex justify-between items-center hover:border-orange-500/30 transition-colors">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-400/10 rounded-lg text-blue-400"><File size={24} /></div>
                    <div>
                        <h4 className="font-bold text-primary">Signed DUA - AUR-EHR-00087.pdf</h4>
                        <div className="text-xs text-slate-400">Added Oct 12, 2026 â€¢ 1.2 MB</div>
                    </div>
                </div>
                <button className="text-slate-400 hover:text-white"><Download size={20} /></button>
            </div>

            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5 flex justify-between items-center hover:border-orange-500/30 transition-colors">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-red-400/10 rounded-lg text-red-400"><File size={24} /></div>
                    <div>
                        <h4 className="font-bold text-primary">Invoice #INV-2026-089.pdf</h4>
                        <div className="text-xs text-slate-400">Added Oct 12, 2026 â€¢ 245 KB</div>
                    </div>
                </div>
                <button className="text-slate-400 hover:text-white"><Download size={20} /></button>
            </div>

            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5 flex justify-between items-center hover:border-orange-500/30 transition-colors">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-red-400/10 rounded-lg text-red-400"><File size={24} /></div>
                    <div>
                        <h4 className="font-bold text-primary">Enterprise API Architecture Docs.pdf</h4>
                        <div className="text-xs text-slate-400">Added Sep 01, 2026 â€¢ 8.4 MB</div>
                    </div>
                </div>
                <button className="text-slate-400 hover:text-white"><Download size={20} /></button>
            </div>

            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5 flex justify-between items-center hover:border-orange-500/30 transition-colors">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-400/10 rounded-lg text-blue-400"><File size={24} /></div>
                    <div>
                        <h4 className="font-bold text-primary">Docker Quickstart Guide.pdf</h4>
                        <div className="text-xs text-slate-400">Added Nov 02, 2026 â€¢ 3.1 MB</div>
                    </div>
                </div>
                <button className="text-slate-400 hover:text-white"><Download size={20} /></button>
            </div>
        </div>
    </div>
);

export default Dashboard;
