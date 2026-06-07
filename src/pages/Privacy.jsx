import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, EyeOff, ClipboardCheck, ScrollText, ArrowLeft, ShieldCheck, Lock, Activity, Users, FileKey, CheckSquare, Heart } from 'lucide-react';

const Privacy = () => {
    const navigate = useNavigate();

    return (
        <div className="pt-32 pb-24 min-h-screen font-sans text-white relative">
            <div className="container mx-auto px-8 max-w-5xl relative">
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
                        <Shield size={13} className="text-blue-400" /> Secure Clinical Governance
                    </div>
                    <h1 className="text-4xl font-extrabold text-primary mb-4">
                        Privacy & Security <span className="text-gradient">Protocol</span>
                    </h1>
                    <p className="text-slate-400 max-w-2xl mx-auto text-sm leading-relaxed">
                        A comprehensive breakdown of our Compute-to-Data sandboxing rules, IRB/IEC compliance, ethics declarations, and user profile data protection.
                    </p>
                </div>

                {/* Main 2-Column Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-12">
                    
                    {/* Left Column: Quick Navigation / Core Pillars Summary */}
                    <div className="space-y-6 lg:col-span-1">
                        <div className="glass-panel p-6 border border-slate-700/40 bg-slate-900/20">
                            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">Governance Summary</h3>
                            <ul className="space-y-3.5 text-xs text-slate-400">
                                <li className="flex items-center gap-2">
                                    <ShieldCheck size={14} className="text-blue-400 shrink-0" />
                                    <span>Zero-Export Compute Isolation</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Lock size={14} className="text-purple-400 shrink-0" />
                                    <span>IRB / IEC Ethical Clearance</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Heart size={14} className="text-pink-400 shrink-0" />
                                    <span>Ethics & Non-Reidentification</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Users size={14} className="text-green-400 shrink-0" />
                                    <span>Researcher Profile Encryption</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <FileKey size={14} className="text-indigo-400 shrink-0" />
                                    <span>Encrypted Document Buckets</span>
                                </li>
                            </ul>
                        </div>

                        {/* Security Note */}
                        <div className="glass-panel p-6 border border-blue-500/10 bg-blue-500/5 rounded-2xl">
                            <div className="flex items-center gap-2 mb-2">
                                <Lock size={14} className="text-blue-400" />
                                <h4 className="text-xs font-bold text-blue-300 uppercase tracking-wider">Zero Data-Out</h4>
                            </div>
                            <p className="text-[11px] text-slate-400 leading-relaxed">
                                Under our strict Compute-to-Data architecture, raw patient data is hosted in network-isolated read-only vaults. Outputs are programmatically scanned to ensure zero patient level records escape the sandbox environment.
                            </p>
                        </div>
                    </div>

                    {/* Right Column: Detailed Clauses */}
                    <div className="space-y-8 lg:col-span-2">
                        
                        {/* Section 1: Compute-to-Data Security Agreement */}
                        <div className="glass-panel p-8 border border-slate-700/40 space-y-6">
                            <h2 className="text-lg font-bold text-slate-200 mb-2 flex items-center gap-2 border-b border-slate-800 pb-3">
                                <Shield size={18} className="text-blue-400" />
                                1. Compute-to-Data Security Agreement
                            </h2>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Researchers executing workflows on Auratral operate under the Compute-to-Data Security Agreement, which enforces specific operational constraints:
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/80">
                                    <h4 className="text-xs font-semibold text-slate-300 mb-1">Read-Only Mounting</h4>
                                    <p className="text-[10px] text-slate-400 leading-relaxed">
                                        Clinical datasets are mounted into your workspace as read-only volumes. Raw databases cannot be modified, deleted, or overwritten by workspace processes.
                                    </p>
                                </div>
                                <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/80">
                                    <h4 className="text-xs font-semibold text-slate-300 mb-1">Network Outbound Block</h4>
                                    <p className="text-[10px] text-slate-400 leading-relaxed">
                                        Running sandboxes exist in highly secure VPCs with outbound internet traffic blocked to prevent unauthorised clinical transmissions.
                                    </p>
                                </div>
                                <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/80">
                                    <h4 className="text-xs font-semibold text-slate-300 mb-1">Model Weight Scanning</h4>
                                    <p className="text-[10px] text-slate-400 leading-relaxed">
                                        All exportable model weights (e.g. `.pkl`, `.onnx` files) undergo automated reconstruction audits to detect membership inference leaks.
                                    </p>
                                </div>
                                <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/80">
                                    <h4 className="text-xs font-semibold text-slate-300 mb-1">Inactivity Teardowns</h4>
                                    <p className="text-[10px] text-slate-400 leading-relaxed">
                                        Containers automatically detach clinical volumes and dismount workspaces after 30 minutes of idle session inactivity to secure data.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: IRB / IEC Governance & DUA */}
                        <div className="glass-panel p-8 border border-slate-700/40 space-y-4">
                            <h2 className="text-lg font-bold text-slate-200 mb-2 flex items-center gap-2 border-b border-slate-800 pb-3">
                                <ScrollText size={18} className="text-purple-400" />
                                2. IRB / IEC Protocol & DUA Governance
                            </h2>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Every project accessing medical sandboxes must obtain institutional clearances prior to credentials release:
                            </p>
                            <ul className="space-y-3 pl-2 text-xs text-slate-400">
                                <li className="flex items-start gap-2.5">
                                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1.5 shrink-0"></span>
                                    <span><strong>Protocol Verification:</strong> Institutional Review Boards (IRB) or Ethics Committees (IEC) must review the research intent, and users must input approved protocol numbers during workspace configuration.</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1.5 shrink-0"></span>
                                    <span><strong>Data Use Agreement (DUA):</strong> Digitally signed DUAs hold the user's sponsoring institution contractually accountable to ethical clinical execution.</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1.5 shrink-0"></span>
                                    <span><strong>Scope Limitations:</strong> Runtimes are locked to the specific parameters declared in the approved IRB protocol (e.g. target cohort metrics, demographics filters).</span>
                                </li>
                            </ul>
                        </div>

                        {/* Section 3: Ethics Declarations */}
                        <div className="glass-panel p-8 border border-slate-700/40 space-y-4">
                            <h2 className="text-lg font-bold text-slate-200 mb-2 flex items-center gap-2 border-b border-slate-800 pb-3">
                                <Heart size={18} className="text-pink-400" />
                                3. Ethics Declarations
                            </h2>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Researchers are bound by ethical declarations governing patient dignity and research integrity:
                            </p>
                            <ul className="space-y-3 pl-2 text-xs text-slate-400">
                                <li className="flex items-start gap-2.5">
                                    <span className="w-1.5 h-1.5 bg-pink-500 rounded-full mt-1.5 shrink-0"></span>
                                    <span><strong>No Re-identification Attempts:</strong> Any attempt to link, correlate, or re-identify anonymised patient records or clinical encounter identifiers is strictly prohibited and results in immediate access revocation.</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <span className="w-1.5 h-1.5 bg-pink-500 rounded-full mt-1.5 shrink-0"></span>
                                    <span><strong>Non-Malicious Scripting:</strong> Code running inside the Monaco Editor workspace sandbox must solely serve diagnostic, analytical, or generative AI purposes. Scanning runtimes or copying file segments out of context is flagged as suspicious.</span>
                                </li>
                            </ul>
                        </div>

                        {/* Section 4: User Profile & Details Privacy */}
                        <div className="glass-panel p-8 border border-slate-700/40 space-y-4">
                            <h2 className="text-lg font-bold text-slate-200 mb-2 flex items-center gap-2 border-b border-slate-800 pb-3">
                                <Users size={18} className="text-green-400" />
                                4. User Profile & Account Details Privacy
                            </h2>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Sponsoring researcher profiles, identity verification files, and billing information are secured using high-grade encryption:
                            </p>
                            <ul className="space-y-3 pl-2 text-xs text-slate-400">
                                <li className="flex items-start gap-2.5">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 shrink-0"></span>
                                    <span><strong>Credential Encryption:</strong> Sponsoring institution details, researcher avatars, credentials, and passwords are encrypted in transit (TLS 1.3) and at rest (AES-256).</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 shrink-0"></span>
                                    <span><strong>No Third-Party Access:</strong> Sponsoring profiles and academic affiliations are never sold, shared, or shared with commercial entities.</span>
                                </li>
                            </ul>
                        </div>

                        {/* Section 5: IRB / IEC Form & Document Privacy */}
                        <div className="glass-panel p-8 border border-slate-700/40 space-y-4">
                            <h2 className="text-lg font-bold text-slate-200 mb-2 flex items-center gap-2 border-b border-slate-800 pb-3">
                                <FileKey size={18} className="text-indigo-400" />
                                5. IRB / IEC Form & Document Privacy
                            </h2>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Uploaded ethics approvals, signed DUAs, and custom cohort forms are treated with the highest security protocol:
                            </p>
                            <ul className="space-y-3 pl-2 text-xs text-slate-400">
                                <li className="flex items-start gap-2.5">
                                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 shrink-0"></span>
                                    <span><strong>Encrypted Object Vaults:</strong> All uploaded IRB protocols and ethics committee approval PDF forms are stored in isolated, access-restricted storage buckets.</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 shrink-0"></span>
                                    <span><strong>Auditor-Only Restrictions:</strong> Sourced IRB protocol document text and credentials metadata can only be read by authorized compliance officers during checkout reviews.</span>
                                </li>
                            </ul>
                        </div>

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
