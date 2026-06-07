import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, EyeOff, ClipboardCheck, ScrollText, ArrowLeft, ShieldCheck, Lock, Activity } from 'lucide-react';

const Privacy = () => {
    const navigate = useNavigate();

    return (
        <div className="pt-32 pb-24 min-h-screen font-sans text-white relative">
            <div className="container mx-auto px-8 max-w-4xl relative">
                {/* Back button */}
                <button 
                    onClick={() => navigate(-1)} 
                    className="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors text-xs font-semibold mb-8 cursor-pointer"
                >
                    <ArrowLeft size={14} /> Back
                </button>

                {/* Hero Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-bold text-blue-400 mb-6">
                        <Shield size={13} className="text-blue-400" /> Secure Clinical Dataspace
                    </div>
                    <h1 className="text-4xl font-extrabold text-primary mb-4">
                        Privacy & Security <span className="text-gradient">Framework</span>
                    </h1>
                    <p className="text-slate-400 max-w-xl mx-auto text-sm leading-relaxed">
                        Auratral enforces a strict zero-export architecture designed to protect sensitive patient records while enabling advanced medical AI research.
                    </p>
                </div>

                {/* Core Privacy Pillars Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    <div className="glass-panel p-6 border border-slate-700/40 hover:border-blue-500/30 transition-all duration-300">
                        <div className="w-10 h-10 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center mb-4">
                            <EyeOff size={20} className="text-blue-400" />
                        </div>
                        <h3 className="text-base font-bold text-slate-200 mb-2">Zero-Export Custody</h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Raw patient datasets are permanently isolated inside provider-hosted environments. Researchers write and execute scripts within secure sandbox runtimes and can only export final weights, model parameters, and statistical validation metrics.
                        </p>
                    </div>

                    <div className="glass-panel p-6 border border-slate-700/40 hover:border-purple-500/30 transition-all duration-300">
                        <div className="w-10 h-10 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center justify-center mb-4">
                            <ClipboardCheck size={20} className="text-purple-400" />
                        </div>
                        <h3 className="text-base font-bold text-slate-200 mb-2">Rigorous De-Identification</h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            All mounted datasets undergo certified pipeline sweeps to scrub protected health information (PHI) in compliance with HIPAA Safe Harbor criteria, GDPR Article 9 special-category definitions, and the India DPDP Act.
                        </p>
                    </div>

                    <div className="glass-panel p-6 border border-slate-700/40 hover:border-green-500/30 transition-all duration-300">
                        <div className="w-10 h-10 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center justify-center mb-4">
                            <Activity size={20} className="text-green-400" />
                        </div>
                        <h3 className="text-base font-bold text-slate-200 mb-2">Immutable Session Logging</h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Every compute container session is cryptographically logged. Code executions, CPU/GPU utilisation, and runtime metrics are audited automatically to verify research intent and prevent data reconstruction attempts.
                        </p>
                    </div>

                    <div className="glass-panel p-6 border border-slate-700/40 hover:border-indigo-500/30 transition-all duration-300">
                        <div className="w-10 h-10 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center mb-4">
                            <ScrollText size={20} className="text-indigo-400" />
                        </div>
                        <h3 className="text-base font-bold text-slate-200 mb-2">Ethics & DUA Auditing</h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Sandbox access is strictly gated by digitally signed Data Use Agreements (DUAs) and institutional credentials. Workspaces require predefined research project authorization before credentials are provisioned.
                        </p>
                    </div>
                </div>

                {/* Detailed Framework Terms */}
                <div className="glass-panel p-8 border border-slate-700/40 space-y-8 mb-12">
                    <div>
                        <h2 className="text-lg font-bold text-slate-200 mb-3 flex items-center gap-2">
                            <span className="w-1.5 h-4 bg-blue-500 rounded-full inline-block"></span>
                            1. Data Access & Compute Isolation
                        </h2>
                        <p className="text-xs text-slate-400 leading-relaxed pl-3.5">
                            Access to clinical datasets is granted only via authenticated workspace containers. Direct file downloading, database mirroring, or external network calls from within the running sandbox are programmatically blocked by internal routing policies.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-lg font-bold text-slate-200 mb-3 flex items-center gap-2">
                            <span className="w-1.5 h-4 bg-purple-500 rounded-full inline-block"></span>
                            2. Non-Reidentification Guarantee
                        </h2>
                        <p className="text-xs text-slate-400 leading-relaxed pl-3.5">
                            Under our Terms of Service and signed DUAs, users agree not to attempt, assist in, or execute any re-identification techniques (such as linkage attacks or demographic intersection mapping) against the de-identified datasets hosted in the runtime environment.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-lg font-bold text-slate-200 mb-3 flex items-center gap-2">
                            <span className="w-1.5 h-4 bg-green-500 rounded-full inline-block"></span>
                            3. Export Controls & Aggregated Output
                        </h2>
                        <p className="text-xs text-slate-400 leading-relaxed pl-3.5">
                            Only statistical digests, confusion matrices, evaluation metrics, and final machine learning model weights can be packaged and downloaded from the sandbox environment. Automated filters scan outgoing file downloads to ensure raw data fragments are not accidentally leaked.
                        </p>
                    </div>
                </div>

                {/* Compliance Badges Footer Section */}
                <div className="border border-slate-800/80 bg-slate-950/20 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-center gap-6">
                    <div>
                        <h4 className="text-xs font-bold text-slate-300 mb-1">Globally Audited Compliance</h4>
                        <p className="text-[10px] text-slate-500">Certified secure clinical sandboxing environment frameworks.</p>
                    </div>
                    <div className="flex gap-3 shrink-0">
                        <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-800/60 border border-slate-700 text-xs text-slate-300 font-semibold shadow-sm">
                            <ShieldCheck size={14} className="text-blue-400" />
                            HIPAA Compliant
                        </div>
                        <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-800/60 border border-slate-700 text-xs text-slate-300 font-semibold shadow-sm">
                            <Lock size={14} className="text-purple-400" />
                            GDPR Ready
                        </div>
                        <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-800/60 border border-slate-700 text-xs text-slate-300 font-semibold shadow-sm">
                            <ShieldCheck size={14} className="text-green-400" />
                            DPDP Ready
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Privacy;
