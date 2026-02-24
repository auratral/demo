import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Send, FileText, UploadCloud, ShieldCheck, CheckCircle2 } from 'lucide-react';

const CustomRequest = () => {
    const navigate = useNavigate();
    const [isSubmitted, setIsSubmitted] = useState(false);

    if (isSubmitted) {
        return (
            <div className="pt-32 pb-24 min-h-screen flex items-center justify-center">
                <div className="glass-panel p-12 text-center max-w-xl mx-auto border-t-4 border-t-blue-500">
                    <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-400">
                        <CheckCircle2 size={40} />
                    </div>
                    <h2 className="text-3xl font-bold text-primary mb-4">Request Submitted</h2>
                    <p className="text-secondary mb-8 leading-relaxed">
                        Your custom dataset request has been securely forwarded to our Clinical Data Operations team. We will review the feasibility under HIPAA Safe Harbor rules and return a preliminary quote within 5 business days.
                    </p>
                    <button onClick={() => navigate('/gallery')} className="btn btn-primary justify-center w-full sm:w-auto">
                        Return to Gallery
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-32 pb-16 min-h-screen">
            <div className="bg-slate-800/50 border-b border-glass-border py-12 mb-12">
                <div className="container mx-auto px-8 max-w-6xl text-center lg:text-left flex flex-col lg:flex-row items-center justify-between gap-8">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl font-bold text-primary mb-4">Request a Custom Medical Dataset</h1>
                        <p className="text-secondary text-lg leading-relaxed">
                            Can't find the exact clinical cohort in our gallery? Our data operations team can source, extract, and de-identify custom datasets through our network of over 150 healthcare provider partners.
                        </p>
                    </div>
                    <div className="shrink-0 flex items-center gap-4 bg-black/20 p-4 border border-white/5 rounded-xl">
                        <div className="text-left">
                            <div className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-1">Guaranteed</div>
                            <div className="text-sm font-bold text-primary flex items-center gap-2">
                                <ShieldCheck size={16} className="text-blue-400" /> HIPAA Compliant
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-8 max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Left Sidebar - Information */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="glass-panel p-8 sticky top-28 border-blue-500/20">
                            <h3 className="text-xl font-bold text-primary mb-6">The Process</h3>
                            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-700 before:to-transparent hidden lg:block"></div>

                            {/* Process steps styled as a simplified timeline for the sidebar */}
                            <ul className="space-y-8 relative z-10">
                                <li className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-purple-500 flex items-center justify-center shrink-0 font-bold text-sm text-purple-400">1</div>
                                    <div>
                                        <h4 className="text-primary font-bold mb-1">Submit Specs</h4>
                                        <p className="text-sm text-slate-400">Define your inclusion/exclusion criteria.</p>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-blue-500 flex items-center justify-center shrink-0 font-bold text-sm text-blue-400">2</div>
                                    <div>
                                        <h4 className="text-primary font-bold mb-1">Feasibility & Quote</h4>
                                        <p className="text-sm text-slate-400">We query our network and price the extract within 5 days.</p>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-indigo-500 flex items-center justify-center shrink-0 font-bold text-sm text-indigo-400">3</div>
                                    <div>
                                        <h4 className="text-primary font-bold mb-1">Extraction & De-ID</h4>
                                        <p className="text-sm text-slate-400">Data is gathered and stripped of PHI via Expert Determination.</p>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-pink-500 flex items-center justify-center shrink-0 font-bold text-sm text-pink-400">4</div>
                                    <div>
                                        <h4 className="text-primary font-bold mb-1">Secure Delivery</h4>
                                        <p className="text-sm text-slate-400">Access your cohort via API, direct download, or secure Docker env.</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Right Area - Form */}
                    <div className="lg:col-span-8">
                        <div className="glass-panel p-8 sm:p-12">
                            <form className="space-y-12" onSubmit={(e) => { e.preventDefault(); setIsSubmitted(true); }}>

                                {/* Section 1: Contact Details */}
                                <div>
                                    <div className="flex items-center gap-3 mb-6 pb-2 border-b border-glass-border">
                                        <span className="flex items-center justify-center w-8 h-8 rounded bg-purple-500/20 text-purple-400 font-bold">1</span>
                                        <h3 className="text-2xl font-bold text-primary">Requester Details</h3>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-300 mb-2">First Name *</label>
                                            <input type="text" required className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3.5 text-primary focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all shadow-inner" placeholder="Jane" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-300 mb-2">Last Name *</label>
                                            <input type="text" required className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3.5 text-primary focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all shadow-inner" placeholder="Doe" />
                                        </div>
                                        <div className="sm:col-span-2">
                                            <label className="block text-sm font-semibold text-slate-300 mb-2">Institutional Email *</label>
                                            <input type="email" required className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3.5 text-primary focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all shadow-inner" placeholder="name@university.edu" />
                                        </div>
                                        <div className="sm:col-span-2">
                                            <label className="block text-sm font-semibold text-slate-300 mb-2">Institution / Company *</label>
                                            <input type="text" required className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3.5 text-primary focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all shadow-inner" placeholder="Full organization name" />
                                        </div>
                                    </div>
                                </div>

                                {/* Section 2: Clinical Requirements */}
                                <div>
                                    <div className="flex items-center gap-3 mb-6 pb-2 border-b border-glass-border">
                                        <span className="flex items-center justify-center w-8 h-8 rounded bg-blue-500/20 text-blue-400 font-bold">2</span>
                                        <h3 className="text-2xl font-bold text-primary">Clinical Requirements</h3>
                                    </div>
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-300 mb-2">Primary Medical Domain *</label>
                                            <select required className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3.5 text-primary focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none appearance-none shadow-inner">
                                                <option value="">Select a domain...</option>
                                                <option>Clinical Trials & Studies</option>
                                                <option>Electronic Health Records (EHR)</option>
                                                <option>Medical Imaging</option>
                                                <option>Genomics & Proteomics</option>
                                                <option>Pharmacovigilance</option>
                                                <option>Mental & Behavioral Health</option>
                                                <option>Rare Diseases</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-slate-300 mb-2">Specific Conditions / ICD Codes</label>
                                            <input type="text" className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3.5 text-primary focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all shadow-inner" placeholder="e.g., E11 (Type 2 Diabetes), Sepsis cohort" />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-slate-300 mb-2">Clinical Description & Objectives *</label>
                                            <p className="text-xs text-slate-500 mb-3">Describe the specific clinical variables you need, inclusion/exclusion criteria, and the use case for the data.</p>
                                            <textarea required rows="6" className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3.5 text-primary focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none transition-all shadow-inner" placeholder="We are building an ML model to predict..."></textarea>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-300 mb-2">Target Record Volume</label>
                                                <select className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3.5 text-primary focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none appearance-none shadow-inner">
                                                    <option>&lt; 10,000</option>
                                                    <option>10,000 - 50,000</option>
                                                    <option>50,000 - 250,000</option>
                                                    <option>&gt; 250,000</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-300 mb-2">Intended License Type</label>
                                                <select className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3.5 text-primary focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none appearance-none shadow-inner">
                                                    <option>Academic / Research</option>
                                                    <option>Commercial - Single Product</option>
                                                    <option>Commercial - Enterprise</option>
                                                    <option>Government / Policy</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Section 3: Compliance & Uploads */}
                                <div>
                                    <div className="flex items-center gap-3 mb-6 pb-2 border-b border-glass-border">
                                        <span className="flex items-center justify-center w-8 h-8 rounded bg-indigo-500/20 text-indigo-400 font-bold">3</span>
                                        <h3 className="text-2xl font-bold text-primary">Supporting Documents</h3>
                                    </div>

                                    <div className="border border-dashed border-white/20 rounded-xl p-10 text-center bg-black/20 hover:bg-black/40 transition-all cursor-pointer group">
                                        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all">
                                            <UploadCloud size={32} className="text-slate-400 group-hover:text-indigo-400" />
                                        </div>
                                        <div className="text-primary font-semibold mb-2 text-lg">Click to upload or drag and drop</div>
                                        <div className="text-sm text-slate-400 max-w-md mx-auto">Attach study protocols, exact schema examples (CSV/JSON), or ethics committee approvals (max 20MB)</div>
                                    </div>

                                    <div className="mt-8 bg-slate-800/30 border border-slate-700/50 rounded-xl p-5 flex items-start gap-4">
                                        <ShieldCheck className="text-blue-500 shrink-0 mt-0.5" size={24} />
                                        <div className="text-sm text-slate-300 leading-relaxed">
                                            By submitting this request, you understand that all datasets sourced by Auratral are subject to strict de-identification standards under the HIPAA Privacy Rule.
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-glass-border flex flex-col sm:flex-row justify-end gap-4">
                                    <button type="button" onClick={() => navigate('/')} className="btn btn-outline py-3 px-8 order-2 sm:order-1">Cancel</button>
                                    <button type="submit" className="btn btn-primary py-3 px-8 flex items-center justify-center gap-2 order-1 sm:order-2">
                                        Submit Request <Send size={18} />
                                    </button>
                                </div>

                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CustomRequest;
