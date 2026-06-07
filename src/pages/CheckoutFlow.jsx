import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, Lock, AlertTriangle, Info, FileText, ClipboardList, Clock, Activity, Cpu } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { DATASET_REGISTRY as fallbackRegistry } from '../utils/computeHelpers';

export const Customize = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const datasetId = location.state?.datasetId || 'AUR-EHR-101';

    // Instant local lookup
    const dataset = fallbackRegistry[datasetId]
        || Object.values(fallbackRegistry).find(d => d.id?.toLowerCase() === datasetId?.toLowerCase())
        || fallbackRegistry[Object.keys(fallbackRegistry)[0]];

    // State for compute environment selections
    const [envType, setEnvType] = useState('Python 3.10 (SciPy/Pandas)');
    const [instanceTier, setInstanceTier] = useState('Standard CPU'); // 'Standard CPU' | 'High-Memory CPU' | 'GPU Cluster'
    const [persistentStorage, setPersistentStorage] = useState(false);
    const [irbPack, setIrbPack] = useState(false);
    const [supportSla, setSupportSla] = useState(false);

    // Demographic cohort mounting filters
    const [districts, setDistricts] = useState('All Districts');
    const [region, setRegion] = useState('All Regions');
    const [ageMin, setAgeMin] = useState(18);
    const [ageMax, setAgeMax] = useState(85);
    const [gender, setGender] = useState('Balanced (50-50)');

    // Pricing calculation in Credits
    const basePrice = dataset?.price || 1237;
    const tierCost = instanceTier === 'High-Memory CPU' ? 200 : instanceTier === 'GPU Cluster' ? 1500 : 0;
    const storageCost = persistentStorage ? 500 : 0;
    const irbCost = irbPack ? 500 : 0;
    const slaCost = supportSla ? 300 : 0;
    const additionalServicesPrice = tierCost + storageCost + irbCost + slaCost;
    const total = basePrice + additionalServicesPrice;

    return (
        <div className="pt-32 pb-16 min-h-screen">
            <div className="container mx-auto px-8 max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left Column: Configuration */}
                    <div className="lg:col-span-2 space-y-10">
                        <div>
                            <h1 className="text-3xl font-bold text-primary mb-2">Sandbox Configuration</h1>
                            <p className="text-secondary pb-6 border-b border-glass-border">Configure compute runtimes and cohort filters for {dataset?.name}</p>
                        </div>

                        {/* Runtimes */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-primary">Select Compute Environment</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {[
                                    { id: 'Python 3.10 (SciPy/Pandas)', desc: 'Preloaded with NumPy, Pandas, Scikit-Learn, SciPy' },
                                    { id: 'R 4.2 (Bioconductor)', desc: 'Clinical stats, Bioconductor packages, ggplot2' },
                                    { id: 'PyTorch 2.1 (CUDA)', desc: 'Deep learning libraries, PyTorch, torchvision, CUDA' }
                                ].map(env => (
                                    <div
                                        key={env.id}
                                        onClick={() => setEnvType(env.id)}
                                        className={`p-4 rounded-xl border cursor-pointer transition-all ${envType === env.id ? 'bg-purple-500/20 border-purple-500' : 'bg-slate-800/50 border-slate-700 hover:border-slate-500'}`}
                                    >
                                        <div className={`font-bold ${envType === env.id ? 'text-purple-400' : 'text-primary'}`}>{env.id}</div>
                                        <div className="text-xs text-slate-400 mt-1">{env.desc}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Machine Specifications */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-primary">Hardware Cluster Profile</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {[
                                    { id: 'Standard CPU', specs: '2 vCPU · 8 GB RAM', cost: 0, desc: 'Ideal for basic statistical analysis' },
                                    { id: 'High-Memory CPU', specs: '8 vCPU · 32 GB RAM', cost: 200, desc: 'Optimized for larger tabular cohorts' },
                                    { id: 'GPU Cluster', specs: '12 vCPU · 48 GB · NVIDIA A100', cost: 1500, desc: 'Required for imaging and deep models' }
                                ].map(tier => (
                                    <div
                                        key={tier.id}
                                        onClick={() => setInstanceTier(tier.id)}
                                        className={`p-4 rounded-xl border cursor-pointer transition-all ${instanceTier === tier.id ? 'bg-purple-500/20 border-purple-500' : 'bg-slate-800/50 border-slate-700 hover:border-slate-500'}`}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className={`font-bold ${instanceTier === tier.id ? 'text-purple-400' : 'text-primary'}`}>{tier.id}</div>
                                            {tier.cost > 0 && <span className="text-xs text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded font-mono">+{tier.cost} Cr</span>}
                                        </div>
                                        <div className="text-xs font-semibold text-slate-300 mt-1">{tier.specs}</div>
                                        <div className="text-[11px] text-slate-500 mt-2">{tier.desc}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Cohort Slice Filters */}
                        <div className="space-y-4 pt-4 border-t border-glass-border">
                            <h3 className="text-xl font-bold text-primary flex items-center gap-2"><Cpu size={20} className="text-purple-400" /> Sandboxed Cohort Mounting</h3>
                            <p className="text-xs text-slate-400">Select demographics to compile and mount as a read-only subset `/data/sensitive_records.parquet` inside the container.</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Geographic Range</label>
                                    <select value={districts} onChange={(e) => setDistricts(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-primary outline-none focus:border-purple-500">
                                        <option>All Districts</option>
                                        <option>1 District</option>
                                        <option>5 Districts</option>
                                        <option>10 Districts</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Region Focus</label>
                                    <select value={region} onChange={(e) => setRegion(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-primary outline-none focus:border-purple-500">
                                        <option>All Regions</option>
                                        <option>North</option>
                                        <option>South</option>
                                        <option>East</option>
                                        <option>West</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Demographic Filters */}
                        <div className="space-y-4 pt-4 border-t border-glass-border">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Age Range</label>
                                    <div className="flex items-center gap-3">
                                        <input type="number" value={ageMin} onChange={(e) => setAgeMin(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-primary outline-none focus:border-purple-500 text-center" />
                                        <span className="text-slate-500 text-sm">to</span>
                                        <input type="number" value={ageMax} onChange={(e) => setAgeMax(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-primary outline-none focus:border-purple-500 text-center" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Gender Distribution</label>
                                    <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-primary outline-none focus:border-purple-500">
                                        <option>Balanced (50-50)</option>
                                        <option>Female Skewed (&gt;60%)</option>
                                        <option>Male Skewed (&gt;60%)</option>
                                        <option>Natural Distribution</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Additional Services */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-glass-border">
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold text-primary">Container Storage Options</h3>
                                <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg border border-slate-700 bg-slate-800/50 hover:border-purple-500/50 transition-colors">
                                    <input type="checkbox" checked={persistentStorage} onChange={() => setPersistentStorage(!persistentStorage)} className="w-5 h-5 mt-0.5 rounded border-slate-600 bg-slate-800 accent-purple-500 shrink-0" />
                                    <div>
                                        <div className="text-primary font-bold">Persistent Storage <span className="text-xs text-purple-400 ml-2">+500 Cr/yr</span></div>
                                        <div className="text-xs text-slate-400 mt-1">Persist scripts, model weights & logs between sandbox sessions</div>
                                    </div>
                                </label>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xl font-bold text-primary">Compliance & Support</h3>
                                <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg border border-slate-700 bg-slate-800/50 hover:border-purple-500/50 transition-colors mb-3">
                                    <input type="checkbox" checked={irbPack} onChange={() => setIrbPack(!irbPack)} className="w-5 h-5 mt-0.5 rounded border-slate-600 bg-slate-800 accent-purple-500 shrink-0" />
                                    <div>
                                        <div className="text-primary font-bold">IRB Protocol Compliance <span className="text-xs text-purple-400 ml-2">+500 Cr</span></div>
                                        <div className="text-xs text-slate-400 mt-1">Generate signed, audit-ready IRB DUA compliance certificates</div>
                                    </div>
                                </label>
                                <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg border border-slate-700 bg-slate-800/50 hover:border-purple-500/50 transition-colors">
                                    <input type="checkbox" checked={supportSla} onChange={() => setSupportSla(!supportSla)} className="w-5 h-5 mt-0.5 rounded border-slate-600 bg-slate-800 accent-purple-500 shrink-0" />
                                    <div>
                                        <div className="text-primary font-bold">Priority Sandbox SLA <span className="text-xs text-purple-400 ml-2">+300 Cr/yr</span></div>
                                        <div className="text-xs text-slate-400 mt-1">Guaranteed dedicated compute nodes with 24/7 technical support</div>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Order Summary (Sticky) */}
                    <div className="hidden lg:block relative">
                        <div className="sticky top-32 glass-panel p-6 shadow-2xl border-t-2 border-purple-500">
                            <h3 className="text-xl font-bold text-primary mb-6 flex items-center gap-2"><div className="w-2 h-6 bg-purple-500 rounded-sm"></div> Order Summary</h3>

                            <div className="space-y-4 text-sm mb-6 border-b border-glass-border pb-6">
                                <div className="flex justify-between items-start">
                                    <span className="text-slate-400">Dataset Workspace</span>
                                    <span className="text-primary font-semibold text-right max-w-[150px]">{dataset?.name}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400">Cluster Specs</span>
                                    <span className="text-primary font-semibold">{instanceTier}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400">Environment</span>
                                    <span className="text-primary font-semibold">{envType.split(' ')[0]}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400">License Term</span>
                                    <span className="text-purple-400 font-semibold">1-Year License</span>
                                </div>
                            </div>

                            <div className="space-y-3 mb-6 border-b border-glass-border pb-6 text-sm">
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400">Annual Activation Fee</span>
                                    <span className="text-primary font-medium">{basePrice.toLocaleString()} Credits</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400">Compute & Services Upgrades</span>
                                    <span className="text-primary font-medium">{additionalServicesPrice.toLocaleString()} Credits</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-end mb-8">
                                <span className="text-lg font-bold text-slate-300">Total Credits</span>
                                <span className="text-3xl font-bold text-purple-400">{total.toLocaleString()} Cr</span>
                            </div>

                            <div className="space-y-3">
                                <button
                                    onClick={() => {
                                        navigate('/agreement', {
                                            state: {
                                                total,
                                                basePrice,
                                                additionalServicesPrice,
                                                envType,
                                                instanceTier,
                                                persistentStorage,
                                                irbPack,
                                                supportSla,
                                                districts,
                                                region,
                                                ageMin,
                                                ageMax,
                                                gender,
                                                datasetId: dataset.id,
                                                datasetName: dataset.name,
                                                category: dataset.category,
                                                doi: dataset.doi
                                            }
                                        });
                                    }}
                                    className="w-full btn btn-primary py-3.5 justify-center shadow-lg shadow-purple-500/20 text-sm tracking-wide"
                                >
                                    Proceed to Security Agreement
                                </button>
                                <button className="w-full btn btn-outline py-3 justify-center text-sm">
                                    Save Config
                                </button>
                            </div>

                            <div className="mt-6 flex items-start gap-3 bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                                <ShieldCheck size={20} className="text-purple-500 shrink-0" />
                                <div className="text-[11px] text-slate-400 leading-tight">
                                    <strong className="text-slate-300 block mb-0.5">Secure Sandboxed Compute</strong>
                                    All computations are executed inside isolated sandboxes. Raw medical data downloads are strictly disabled.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const Agreement = () => {
    const navigate = useNavigate();
    const { state: orderState } = useLocation();
    const [agreements, setAgreements] = useState({
        computeIsolation: false,
        zeroDataLeakage: false,
        noReconstruction: false,
        outputAuditing: false,
        ethicsClearance: false,
        billingCredits: false
    });

    const allAgreed = Object.values(agreements).every(Boolean);

    const toggleAgreement = (key) => {
        setAgreements(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="pt-32 pb-16 min-h-screen">
            <div className="container mx-auto px-8 max-w-4xl">
                <div className="flex items-center gap-3 mb-6 border-b border-glass-border pb-4">
                    <ShieldCheck size={32} className="text-purple-400" />
                    <h1 className="text-3xl font-bold text-primary">Compute-to-Data Security Agreement</h1>
                </div>

                <div className="bg-purple-500/10 border border-purple-500/50 rounded-xl p-4 mb-8 flex items-start gap-4">
                    <AlertTriangle className="text-purple-400 shrink-0 mt-0.5" size={24} />
                    <div>
                        <h4 className="font-bold text-purple-400">Strict Sandbox Regulations</h4>
                        <p className="text-sm text-purple-200/80 mt-1">To protect patient privacy, all researchers must sign this Compute custody agreement before accessing the sandbox environment.</p>
                    </div>
                </div>

                <div className="space-y-4 mb-8">
                    {[
                        { id: 'computeIsolation', title: 'Isolated Compute Sandbox Compliance', text: 'I agree to run analysis code exclusively within the provided Docker container workspace. I will not attempt to bypass kernel namespaces, scale privileges, or initiate unauthorized outbound network requests.' },
                        { id: 'zeroDataLeakage', title: 'Zero Patient-Level Data Leakage', text: 'I acknowledge that patient-level raw records cannot be downloaded, queried via external APIs, or copied. I will not write scripts designed to print, dump, or exfiltrate raw database rows from the sandbox.' },
                        { id: 'noReconstruction', title: 'Prohibition of Patient Reconstruction Attacks', text: 'I promise not to train generative adversarial networks (GANs), large language models, or other models configured to reconstruct individual patient records, identifiers, or clinical notes.' },
                        { id: 'outputAuditing', title: 'Trained Weights & Metrics Export Restrictions', text: 'I understand that only trained model weights (.pkl, .h5), evaluation performance metrics (.csv, .json), and compiler logs are exportable. All exports are subject to automated data leakage auditing.' },
                        { id: 'ethicsClearance', title: 'IRB Protocol Alignment', text: 'I certify that our research team holds appropriate Institutional Review Board (IRB) or ethics board approvals matching the scope of clinical research defined in our query.' },
                        { id: 'billingCredits', title: 'Compute Credit Burn Consent', text: 'I consent to the deduction of workspace license activation credits and active per-minute container execution burn rates based on our selected cluster profile.' }
                    ].map((item) => (
                        <div key={item.id} className="glass-panel p-5 border-l-4 border-l-transparent hover:border-l-purple-500 transition-all flex items-start gap-4 cursor-pointer" onClick={() => toggleAgreement(item.id)}>
                            <div className="mt-1 relative flex items-center justify-center shrink-0">
                                <input
                                    type="checkbox"
                                    checked={agreements[item.id]}
                                    readOnly
                                    className="peer w-5 h-5 rounded border-slate-600 bg-slate-800 appearance-none checked:bg-purple-500 checked:border-purple-500 transition-all cursor-pointer"
                                />
                                {agreements[item.id] && <svg className="w-3.5 h-3.5 text-white absolute pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                            </div>
                            <div>
                                <h4 className="font-bold text-primary mb-1">{item.title}</h4>
                                <p className="text-sm text-slate-400 leading-relaxed">{item.text}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 mb-8 flex items-start gap-4">
                    <Info className="text-purple-400 shrink-0 mt-0.5" size={24} />
                    <div>
                        <h4 className="font-bold text-purple-400">Sandbox Provisioning Protocol</h4>
                        <p className="text-sm text-purple-200/70 mt-1 leading-relaxed">Upon signing, your ethics review details will be forwarded to the IRB committee for rapid digital sign-off. Once approved (typically within 24 hours), your credit balance will be debited, and the sandbox instance will be deployed.</p>
                    </div>
                </div>

                <div className="flex justify-end gap-4 border-t border-glass-border pt-6">
                    <button onClick={() => navigate(-1)} className="btn btn-outline py-3 px-6">Go Back</button>
                    <button
                        onClick={() => navigate('/irb-review', { state: orderState })}
                        className={`btn py-3 px-8 transition-all ${allAgreed ? 'btn-primary bg-emerald-600 hover:bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'}`}
                        disabled={!allAgreed}
                    >
                        Sign & Proceed to IRB Review
                    </button>
                </div>
            </div>
        </div>
    );
};

export const IrbReview = () => {
    const navigate = useNavigate();
    const { state: orderState } = useLocation();
    const [irb, setIrb] = useState({
        piName: '',
        piEmail: '',
        institution: '',
        researchScope: '',
        studyTitle: '',
        studyType: '',
        dataUsagePurpose: '',
        expectedDuration: '',
        estimatedSampleSize: '',
        fundingSource: '',
        additionalNotes: '',
        confirmAccuracy: false,
        confirmEthics: false,
    });

    const update = (field, value) => setIrb(prev => ({ ...prev, [field]: value }));

    const requiredFilled = irb.piName && irb.piEmail && irb.institution && irb.researchScope && irb.studyTitle && irb.studyType && irb.dataUsagePurpose && irb.confirmAccuracy && irb.confirmEthics;

    return (
        <div className="pt-32 pb-16 min-h-screen">
            <div className="container mx-auto px-8 max-w-4xl">

                {/* Header */}
                <div className="flex items-center gap-3 mb-6 border-b border-glass-border pb-4">
                    <ClipboardList size={32} className="text-purple-400" />
                    <div>
                        <h1 className="text-3xl font-bold text-primary">IRB / IEC Ethics Declaration</h1>
                        <p className="text-secondary text-sm mt-1">Institutional Review Board / Independent Ethics Committee Submission</p>
                    </div>
                </div>

                {/* Info Banner */}
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 mb-8 flex items-start gap-4">
                    <FileText className="text-purple-400 shrink-0 mt-0.5" size={24} />
                    <div>
                        <h4 className="font-bold text-purple-400">Compute Session Ethics Review</h4>
                        <p className="text-sm text-purple-200/70 mt-1 leading-relaxed">Provide your institutional study protocol details below. Our data governance board reviews all submissions to verify that the planned sandboxed ML model training complies with patient data protection mandates.</p>
                    </div>
                </div>

                {/* Principal Investigator Details */}
                <div className="glass-panel p-6 mb-6">
                    <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                        <div className="w-2 h-5 bg-purple-500 rounded-sm"></div>
                        Principal Investigator Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Full Name <span className="text-red-400">*</span></label>
                            <input type="text" value={irb.piName} onChange={e => update('piName', e.target.value)} placeholder="Dr. Sophia Patel" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-primary outline-none focus:border-purple-500 transition-colors" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Institutional Email <span className="text-red-400">*</span></label>
                            <input type="email" value={irb.piEmail} onChange={e => update('piEmail', e.target.value)} placeholder="sophia.patel@aiims.edu" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-primary outline-none focus:border-purple-500 transition-colors" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-400 mb-2">Research Institution <span className="text-red-400">*</span></label>
                            <input type="text" value={irb.institution} onChange={e => update('institution', e.target.value)} placeholder="e.g. AIIMS Delhi / Tata Memorial Hospital" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-primary outline-none focus:border-purple-500 transition-colors" />
                        </div>
                    </div>
                </div>

                {/* Research Scope & Study Details */}
                <div className="glass-panel p-6 mb-6">
                    <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                        <div className="w-2 h-5 bg-purple-500 rounded-sm"></div>
                        Scope of Research
                    </h3>
                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Study Title <span className="text-red-400">*</span></label>
                            <input type="text" value={irb.studyTitle} onChange={e => update('studyTitle', e.target.value)} placeholder="e.g. Training Neural Networks on Medical Scans for Automated Pathology Classification" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-primary outline-none focus:border-purple-500 transition-colors" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Study Type <span className="text-red-400">*</span></label>
                                <select value={irb.studyType} onChange={e => update('studyType', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-primary outline-none focus:border-purple-500 transition-colors">
                                    <option value="">Select study type...</option>
                                    <option>Observational Study</option>
                                    <option>Retrospective Analysis</option>
                                    <option>Prospective Study</option>
                                    <option>Clinical Trial (Phase I-IV)</option>
                                    <option>Epidemiological Study</option>
                                    <option>Health Services Research</option>
                                    <option>Machine Learning / AI Research</option>
                                    <option>Public Health Research</option>
                                    <option>Quality Improvement Study</option>
                                    <option>Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Purpose of Data Usage <span className="text-red-400">*</span></label>
                                <select value={irb.dataUsagePurpose} onChange={e => update('dataUsagePurpose', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-primary outline-none focus:border-purple-500 transition-colors">
                                    <option value="">Select purpose...</option>
                                    <option>Academic Research</option>
                                    <option>Commercial R&D</option>
                                    <option>Drug Discovery & Development</option>
                                    <option>Diagnostic Tool Development</option>
                                    <option>Health Policy Analysis</option>
                                    <option>Population Health Study</option>
                                    <option>Training AI/ML Models</option>
                                    <option>Clinical Decision Support</option>
                                    <option>Other</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Detailed Research Scope & Model Description <span className="text-red-400">*</span></label>
                            <textarea value={irb.researchScope} onChange={e => update('researchScope', e.target.value)} rows={4} placeholder="Describe the objectives, algorithms (e.g., CNN, ResNet, XGBoost), and expected metrics you plan to extract from the sandbox environment. Detail how model output weights will be utilized downstream..." className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-primary outline-none focus:border-purple-500 transition-colors resize-none" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Sandbox License Period</label>
                                <select value={irb.expectedDuration} onChange={e => update('expectedDuration', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-primary outline-none focus:border-purple-500 transition-colors">
                                    <option>1-Year License Period</option>
                                    <option>2-Year License Period</option>
                                    <option>3-Year License Period</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Preloaded Package Setups</label>
                                <input type="text" value={irb.estimatedSampleSize} onChange={e => update('estimatedSampleSize', e.target.value)} placeholder="e.g. scikit-learn, pytorch, pandas" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-primary outline-none focus:border-purple-500 transition-colors" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Funding Source</label>
                                <input type="text" value={irb.fundingSource} onChange={e => update('fundingSource', e.target.value)} placeholder="e.g. Government, Institutional, Commercial" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-primary outline-none focus:border-purple-500 transition-colors" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Declarations */}
                <div className="glass-panel p-6 mb-8">
                    <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                        <div className="w-2 h-5 bg-amber-500 rounded-sm"></div>
                        Ethics Declarations
                    </h3>
                    <div className="space-y-4">
                        <label className="flex items-start gap-3 cursor-pointer group p-3 rounded-lg border border-slate-700 bg-slate-800/50 hover:border-purple-500/50 transition-colors">
                            <div className="mt-0.5 relative flex items-center justify-center shrink-0">
                                <input
                                    type="checkbox"
                                    checked={irb.confirmAccuracy}
                                    onChange={() => update('confirmAccuracy', !irb.confirmAccuracy)}
                                    className="peer w-5 h-5 rounded border-slate-600 bg-slate-800 appearance-none checked:bg-purple-500 checked:border-purple-500 transition-all cursor-pointer"
                                />
                                {irb.confirmAccuracy && <svg className="w-3.5 h-3.5 text-white absolute pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                            </div>
                            <div>
                                <span className="text-primary font-medium">Protocol Authenticity <span className="text-red-400">*</span></span>
                                <p className="text-xs text-slate-400 mt-1">I certify that the clinical study description matches our institution's authorized research aims, and that no model extraction will be used to reconstruct private records.</p>
                            </div>
                        </label>
                        <label className="flex items-start gap-3 cursor-pointer group p-3 rounded-lg border border-slate-700 bg-slate-800/50 hover:border-purple-500/50 transition-colors">
                            <div className="mt-0.5 relative flex items-center justify-center shrink-0">
                                <input
                                    type="checkbox"
                                    checked={irb.confirmEthics}
                                    onChange={() => update('confirmEthics', !irb.confirmEthics)}
                                    className="peer w-5 h-5 rounded border-slate-600 bg-slate-800 appearance-none checked:bg-purple-500 checked:border-purple-500 transition-all cursor-pointer"
                                />
                                {irb.confirmEthics && <svg className="w-3.5 h-3.5 text-white absolute pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                            </div>
                            <div>
                                <span className="text-primary font-medium">Data Safety Ethics Compliance <span className="text-red-400">*</span></span>
                                <p className="text-xs text-slate-400 mt-1">I agree to immediately terminate computation and report any unexpected data exposures or leakages encountered during sandbox runtimes.</p>
                            </div>
                        </label>
                    </div>
                </div>

                {/* Processing Time Notice */}
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-8 flex items-start gap-4">
                    <Clock className="text-amber-400 shrink-0 mt-0.5" size={24} />
                    <div>
                        <h4 className="font-bold text-amber-400">Governance Clearance Time</h4>
                        <p className="text-sm text-amber-200/70 mt-1 leading-relaxed">Once submitted, your sandbox allocation request is queued for ethics committee clearance. Decisions are typically delivered within <strong className="text-amber-300">24 hours</strong>. Approved requests will automatically trigger credit debit and workspace deployment.</p>
                    </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-end gap-4 border-t border-glass-border pt-6">
                    <button onClick={() => navigate(-1)} className="btn btn-outline py-3 px-6">Go Back</button>
                    <button
                        onClick={() => navigate('/checkout', { state: orderState })}
                        className={`btn py-3 px-8 transition-all flex items-center gap-2 ${requiredFilled ? 'btn-primary bg-purple-600 hover:bg-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.3)]' : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'}`}
                        disabled={!requiredFilled}
                    >
                        <ShieldCheck size={16} />
                        Proceed to Credit Allocation
                    </button>
                </div>

            </div>
        </div>
    );
};

export const Checkout = () => {
    const navigate = useNavigate();
    const { state: order } = useLocation();
    const { user } = useAuth();
    const [submitting, setSubmitting] = useState(false);

    const total = order?.total ?? 0;
    const basePrice = order?.basePrice ?? 0;
    const addons = order?.additionalServicesPrice ?? 0;
    const envType = order?.envType ?? '--';
    const instanceTier = order?.instanceTier ?? '--';
    
    // Mock researcher credit balance
    const [balance, setBalance] = useState(() => {
        const localBal = localStorage.getItem('auratral_credits_balance');
        return localBal ? Number(localBal) : 12500;
    });

    const isSufficient = balance >= total;

    const handleDebitAndDeploy = async () => {
        if (!user) {
            alert("Please log in to complete sandbox provisioning.");
            navigate('/login');
            return;
        }

        if (!isSufficient) {
            alert("Insufficient credits. Please purchase a credit pack first or top up.");
            return;
        }

        setSubmitting(true);
        
        // Save workspace to Firestore (active runtimes list)
        const workspaceData = {
            userId: user.uid,
            datasetId: order?.datasetId || 'AUR-EHR-101',
            datasetName: order?.datasetName || 'Longitudinal ICU Encounters',
            category: order?.category || 'EHR',
            price: total,
            envType: envType,
            instanceTier: instanceTier,
            persistentStorage: order?.persistentStorage || false,
            irbPack: order?.irbPack || false,
            supportSla: order?.supportSla || false,
            cohortFilters: {
                districts: order?.districts || 'All Districts',
                region: order?.region || 'All Regions',
                ageRange: `${order?.ageMin || 18} - ${order?.ageMax || 85}`,
                gender: order?.gender || 'Balanced (50-50)'
            },
            purchaseDate: new Date().toISOString(),
            status: 'Active',
            license: '1-Year Sandboxed Compute License',
            doi: order?.doi || '10.5281/auratral.ehr.ehr-101'
        };
        try {
            // Optimistic debit update
            const newBal = balance - total;
            setBalance(newBal);
            localStorage.setItem('auratral_credits_balance', String(newBal));
            window.dispatchEvent(new Event('auratral_credits_updated'));

            // Save to localStorage immediately as local persistence fallback
            const localPurchases = JSON.parse(localStorage.getItem('auratral_local_purchases') || '[]');
            localPurchases.push(workspaceData);
            localStorage.setItem('auratral_local_purchases', JSON.stringify(localPurchases));

            // Set flag in localStorage to tell dashboard to auto-launch this new workspace
            localStorage.setItem('auratral_just_deployed', order?.datasetId || 'AUR-EHR-101');

            // Try saving to Firestore asynchronously (non-blocking)
            addDoc(collection(db, 'purchases'), workspaceData).catch(dbErr => {
                console.warn("Firestore save failed, running in local-only storage fallback:", dbErr);
            });

            navigate('/dashboard');
        } catch (err) {
            console.error("Error during deployment:", err);
            alert("Could not provision workspace. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="pt-32 pb-16 min-h-screen">
            <div className="container mx-auto px-8 max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-12">

                <div>
                    <h1 className="text-3xl font-bold text-primary mb-2">Compute Credit Allocation</h1>
                    <p className="text-secondary mb-8">Debiting sandbox workspace activation credits</p>

                    <div className="space-y-6">
                        {/* Balance Card */}
                        <div className="p-6 bg-slate-800/80 border border-slate-700 rounded-xl">
                            <div className="flex justify-between items-center mb-4">
                                <div className="text-sm font-semibold text-slate-400">Your Credit Pool</div>
                                <div className="text-xs text-slate-500 font-mono">1 Cr = ₹10</div>
                            </div>
                            <div className="text-3xl font-extrabold text-primary mb-2">{balance.toLocaleString()} Credits</div>
                            <p className="text-xs text-slate-400">Available balance for clinical research sandbox runtimes.</p>
                        </div>

                        {/* Allocation Details */}
                        <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-lg space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Current Balance</span>
                                <span className="text-slate-300 font-mono">{balance.toLocaleString()} Cr</span>
                            </div>
                            <div className="flex justify-between text-sm text-red-400 font-semibold">
                                <span>Required Allocation</span>
                                <span className="font-mono">-{total.toLocaleString()} Cr</span>
                            </div>
                            <div className="border-t border-slate-800 pt-3 flex justify-between text-sm font-bold">
                                <span className="text-slate-400">Remaining Balance</span>
                                <span className={`${isSufficient ? 'text-green-400' : 'text-red-500'} font-mono`}>
                                    {(balance - total).toLocaleString()} Cr
                                </span>
                            </div>
                        </div>

                        {!isSufficient && (
                            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
                                <AlertTriangle className="text-red-400 mt-0.5 shrink-0" size={18} />
                                <div className="text-xs text-red-200">
                                    <strong className="block mb-1">Insufficient Credits</strong>
                                    You need {(total - balance).toLocaleString()} more credits to launch this sandbox. Click below to top up your account.
                                </div>
                            </div>
                        )}

                        {isSufficient ? (
                            <button 
                                onClick={handleDebitAndDeploy} 
                                disabled={submitting}
                                className="w-full btn btn-primary flex justify-center items-center gap-2 py-4 shadow-[0_4px_20px_rgba(168,85,247,0.2)] disabled:opacity-50 font-bold"
                            >
                                {submitting ? (
                                    <>
                                        <Activity className="animate-spin" size={16} /> Deploying Isolated Sandbox...
                                    </>
                                ) : (
                                    <>
                                        <Lock size={16} /> Deduct {total.toLocaleString()} Cr & Launch Sandbox
                                    </>
                                )}
                            </button>
                        ) : (
                            <button 
                                onClick={() => {
                                    alert("Top-up request sent! In development mode, we added 5,000 Credits to your pool.");
                                    const newBal = balance + 5000;
                                    setBalance(newBal);
                                    localStorage.setItem('auratral_credits_balance', String(newBal));
                                    window.dispatchEvent(new Event('auratral_credits_updated'));
                                }}
                                className="w-full btn btn-outline border-purple-500/50 hover:bg-purple-500/10 text-purple-400 py-4 font-bold flex justify-center items-center gap-2"
                            >
                                Buy Credit Package (+5,000 Credits / ₹50,000)
                            </button>
                        )}

                        <p className="text-[10px] text-center text-slate-500">Security audited by Auratral Compliance & Privacy Committee</p>
                    </div>
                </div>

                <div className="glass-panel p-8 h-fit border border-slate-700/40">
                    <h3 className="font-bold text-primary mb-4 border-b border-glass-border pb-2">Workspace Invoice</h3>
                    <div className="space-y-4 text-sm mb-4">
                        <div className="flex justify-between">
                            <span className="text-slate-400">Sandbox Environment</span>
                            <span className="text-primary font-medium">{envType.split(' ')[0]}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400">Hardware Profile</span>
                            <span className="text-primary font-medium">{instanceTier}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400">License Term</span>
                            <span className="text-purple-400 font-semibold">1-Year Term (Annual License)</span>
                        </div>
                        <div className="flex justify-between border-t border-glass-border pt-3">
                            <span className="text-slate-400">Annual Activation Fee</span>
                            <span className="text-primary font-medium">{basePrice.toLocaleString()} Credits</span>
                        </div>
                        {addons > 0 && (
                            <div className="flex justify-between">
                                <span className="text-slate-400">Sandbox Upgrades</span>
                                <span className="text-primary font-medium">{addons.toLocaleString()} Credits</span>
                            </div>
                        )}
                    </div>

                    <div className="border-t border-glass-border pt-4 flex justify-between items-center">
                        <span className="font-bold text-slate-300">Total Credits</span>
                        <span className="text-2xl font-bold text-purple-400">{total.toLocaleString()} Cr</span>
                    </div>
                </div>

            </div>
        </div>
    );
};
