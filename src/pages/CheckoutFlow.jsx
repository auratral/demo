import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, UploadCloud, Users, CreditCard, AlertTriangle, Info } from 'lucide-react';

export const Customize = () => {
    const navigate = useNavigate();

    // State for all form selections
    const [format, setFormat] = useState('');
    const [records, setRecords] = useState(10000);
    const [districts, setDistricts] = useState('5 Districts');
    const [region, setRegion] = useState('All Regions');
    const [ageMin, setAgeMin] = useState(18);
    const [ageMax, setAgeMax] = useState(85);
    const [gender, setGender] = useState('Balanced (50-50)');
    const [valReport, setValReport] = useState(false);
    const [anonCert, setAnonCert] = useState(false);
    const [apiAccess, setApiAccess] = useState(false);
    const [dataUpdates, setDataUpdates] = useState(false);

    // Pricing calculation
    const basePrice = 1999;
    const additionalServicesPrice = (apiAccess ? 499 : 0) + (dataUpdates ? 999 : 0);
    const total = basePrice + additionalServicesPrice;

    return (
        <div className="pt-32 pb-16 min-h-screen">
            <div className="container mx-auto px-8 max-w-6xl">

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Left Column: Configuration */}
                    <div className="lg:col-span-2 space-y-10">
                        <div>
                            <h1 className="text-3xl font-bold text-primary mb-2">Dataset Configuration</h1>
                            <p className="text-secondary pb-6 border-b border-glass-border">Customize your Cardiovascular Health cohort parameters</p>
                        </div>

                        {/* Format */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-primary">Select Format</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {[
                                    { id: 'CSV', desc: 'Comma-separated values' },
                                    { id: 'JSON', desc: 'JavaScript Object Notation' },
                                    { id: 'Excel', desc: 'Microsoft Excel format' }
                                ].map(fmt => (
                                    <div
                                        key={fmt.id}
                                        onClick={() => setFormat(fmt.id)}
                                        className={`p-4 rounded-xl border cursor-pointer transition-all ${format === fmt.id ? 'bg-blue-500/20 border-blue-500' : 'bg-slate-800/50 border-slate-700 hover:border-slate-500'}`}
                                    >
                                        <div className={`font-bold ${format === fmt.id ? 'text-blue-400' : 'text-primary'}`}>{fmt.id}</div>
                                        <div className="text-xs text-slate-400 mt-1">{fmt.desc}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Number of Records */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <h3 className="text-xl font-bold text-primary">Number of Records</h3>
                                <div className="text-2xl font-bold text-blue-400">{records.toLocaleString()}</div>
                            </div>
                            <input
                                type="range"
                                min="1000"
                                max="125847"
                                value={records}
                                onChange={(e) => setRecords(Number(e.target.value))}
                                className="w-full accent-blue-500"
                            />
                            <div className="flex justify-between text-xs text-slate-500">
                                <span>Min: 1,000</span>
                                <span>Max: 125,847 records</span>
                            </div>
                            <div className="flex gap-3 pt-2">
                                {[10000, 25000, 50000, 125847].map(val => (
                                    <button
                                        key={val}
                                        onClick={() => setRecords(val)}
                                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all border ${records === val ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-300'}`}
                                    >
                                        {val === 125847 ? 'All' : `${val / 1000}K`}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Geographic Coverage */}
                        <div className="space-y-4 pt-4 border-t border-glass-border">
                            <h3 className="text-xl font-bold text-primary">Geographic Coverage</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Number of Districts</label>
                                    <select value={districts} onChange={(e) => setDistricts(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-primary outline-none focus:border-blue-500">
                                        <option>1 District</option>
                                        <option>5 Districts</option>
                                        <option>10 Districts</option>
                                        <option>All Districts</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Region Focus</label>
                                    <select value={region} onChange={(e) => setRegion(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-primary outline-none focus:border-blue-500">
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
                            <h3 className="text-xl font-bold text-primary">Demographic Filters</h3>
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

                        {/* Data Quality & Services */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-glass-border">
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold text-primary">Data Quality Options</h3>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input type="checkbox" checked={valReport} onChange={() => setValReport(!valReport)} className="w-5 h-5 rounded border-slate-600 bg-slate-800 accent-blue-500" />
                                    <span className="text-slate-300 group-hover:text-white transition-colors">Include data validation report</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input type="checkbox" checked={anonCert} onChange={() => setAnonCert(!anonCert)} className="w-5 h-5 rounded border-slate-600 bg-slate-800 accent-blue-500" />
                                    <span className="text-slate-300 group-hover:text-white transition-colors">Include anonymization certificate</span>
                                </label>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xl font-bold text-primary">Additional Services</h3>
                                <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg border border-slate-700 bg-slate-800/50 hover:border-blue-500/50 transition-colors">
                                    <input type="checkbox" checked={apiAccess} onChange={() => setApiAccess(!apiAccess)} className="w-5 h-5 mt-0.5 rounded border-slate-600 bg-slate-800 accent-blue-500 shrink-0" />
                                    <div>
                                        <div className="text-primary font-bold">API Access <span className="text-xs text-blue-400 ml-2">+$499</span></div>
                                        <div className="text-xs text-slate-400 mt-1">Real-time data access via REST API</div>
                                    </div>
                                </label>
                                <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg border border-slate-700 bg-slate-800/50 hover:border-blue-500/50 transition-colors">
                                    <input type="checkbox" checked={dataUpdates} onChange={() => setDataUpdates(!dataUpdates)} className="w-5 h-5 mt-0.5 rounded border-slate-600 bg-slate-800 accent-blue-500 shrink-0" />
                                    <div>
                                        <div className="text-primary font-bold">Data Updates <span className="text-xs text-blue-400 ml-2">+$999</span></div>
                                        <div className="text-xs text-slate-400 mt-1">Quarterly dataset updates for 1 year</div>
                                    </div>
                                </label>
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Order Summary (Sticky) */}
                    <div className="hidden lg:block relative">
                        <div className="sticky top-32 glass-panel p-6 shadow-2xl border-t-2 border-blue-500">
                            <h3 className="text-xl font-bold text-primary mb-6 flex items-center gap-2"><div className="w-2 h-6 bg-blue-500 rounded-sm"></div> Order Summary</h3>

                            <div className="space-y-4 text-sm mb-6 border-b border-glass-border pb-6">
                                <div className="flex justify-between items-start">
                                    <span className="text-slate-400">Dataset</span>
                                    <span className="text-primary font-semibold text-right max-w-[150px]">Cardiovascular Health</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400">Records</span>
                                    <span className="text-primary font-semibold">{records.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400">Format</span>
                                    <span className={`font-semibold ${format ? 'text-primary' : 'text-red-400'}`}>{format || 'Not selected'}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400">Districts</span>
                                    <span className="text-primary font-semibold">{districts.split(' ')[0]}</span>
                                </div>
                            </div>

                            <div className="space-y-3 mb-6 border-b border-glass-border pb-6 text-sm">
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400">Base Price</span>
                                    <span className="text-primary font-medium">${basePrice.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400">Additional Services</span>
                                    <span className="text-primary font-medium">${additionalServicesPrice.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-end mb-8">
                                <span className="text-lg font-bold text-slate-300">Total</span>
                                <span className="text-3xl font-bold text-blue-400">${total.toLocaleString()}</span>
                            </div>

                            <div className="space-y-3">
                                <button
                                    onClick={() => {
                                        if (!format) alert("Please select a format first.");
                                        else navigate('/agreement');
                                    }}
                                    className="w-full btn btn-primary py-3.5 justify-center shadow-lg shadow-blue-500/20 text-sm tracking-wide"
                                >
                                    Proceed to Documentation
                                </button>
                                <button className="w-full btn btn-outline py-3 justify-center text-sm">
                                    Save Configuration
                                </button>
                            </div>

                            <div className="mt-6 flex items-start gap-3 bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                                <ShieldCheck size={20} className="text-blue-500 shrink-0" />
                                <div className="text-[11px] text-slate-400 leading-tight">
                                    <strong className="text-slate-300 block mb-0.5">Secure Purchase</strong>
                                    Your data and payment information are protected with enterprise-grade security.
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
    const [agreements, setAgreements] = useState({
        privacy: false,
        nda: false,
        usage: false,
        security: false,
        liability: false,
        audit: false
    });

    const allAgreed = Object.values(agreements).every(Boolean);

    const toggleAgreement = (key) => {
        setAgreements(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="pt-32 pb-16 min-h-screen">
            <div className="container mx-auto px-8 max-w-4xl">
                <div className="flex items-center gap-3 mb-6 border-b border-glass-border pb-4">
                    <ShieldCheck size={32} className="text-blue-400" />
                    <h1 className="text-3xl font-bold text-primary">Legal Documentation & Compliance</h1>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-xl p-4 mb-8 flex items-start gap-4">
                    <AlertTriangle className="text-yellow-400 shrink-0 mt-0.5" size={24} />
                    <div>
                        <h4 className="font-bold text-yellow-400">Important Notice</h4>
                        <p className="text-sm text-yellow-200/80 mt-1">All terms and conditions must be accepted to proceed. These agreements are legally binding and will be enforced.</p>
                    </div>
                </div>

                <div className="space-y-4 mb-8">
                    {[
                        { id: 'privacy', title: 'Data Protection & Privacy Compliance', text: 'I acknowledge that this dataset contains sensitive health information and agree to comply with all applicable data protection regulations including GDPR, HIPAA, and local privacy laws. I will implement appropriate technical and organizational measures to protect the data from unauthorized access, disclosure, or misuse.' },
                        { id: 'nda', title: 'Non-Disclosure Agreement', text: 'I agree to maintain strict confidentiality regarding all data received and will not disclose, share, or distribute any portion of this dataset to third parties without prior written consent from Auratral. This obligation extends to all employees, contractors, and affiliates who may have access to the data.' },
                        { id: 'usage', title: 'Usage Restrictions & Compliance', text: 'I understand that this data is for legitimate research, analysis, or business purposes only. I will not use this data for any illegal activities, discrimination, harassment, or any purpose that could harm individuals or groups. I will not attempt to re-identify anonymized individuals.' },
                        { id: 'security', title: 'Data Security Requirements', text: 'I commit to implementing industry-standard security measures including encryption at rest and in transit, access controls, regular security audits, and secure data disposal procedures. I will immediately report any data breaches or security incidents to Auratral within 24 hours of discovery.' },
                        { id: 'liability', title: 'Liability & Indemnification', text: 'I accept full liability for any misuse of the data and agree to indemnify Auratral against any claims, damages, or legal actions arising from my use of the dataset. I understand that Auratral provides the data "as is" without warranties and shall not be liable for any indirect or consequential damages.' },
                        { id: 'audit', title: 'Audit Rights & Monitoring', text: 'I consent to periodic audits and monitoring of my data usage practices by Auratral or its authorized representatives. I will provide reasonable access to systems, documentation, and personnel as required for compliance verification and will maintain detailed logs of data access and usage.' }
                    ].map((item) => (
                        <div key={item.id} className="glass-panel p-5 border-l-4 border-l-transparent hover:border-l-blue-500 transition-all flex items-start gap-4 cursor-pointer" onClick={() => toggleAgreement(item.id)}>
                            <div className="mt-1 relative flex items-center justify-center shrink-0">
                                <input
                                    type="checkbox"
                                    checked={agreements[item.id]}
                                    readOnly
                                    className="peer w-5 h-5 rounded border-slate-600 bg-slate-800 appearance-none checked:bg-blue-500 checked:border-blue-500 transition-all cursor-pointer"
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

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-8 flex items-start gap-4">
                    <Info className="text-blue-400 shrink-0 mt-0.5" size={24} />
                    <div>
                        <h4 className="font-bold text-blue-400">Documentation Delivery</h4>
                        <p className="text-sm text-blue-200/70 mt-1 leading-relaxed">Upon completion of this agreement, a comprehensive legal documentation package including all signed terms, compliance guidelines, and usage instructions will be automatically sent to your registered email address. These documents will also be permanently available in your "My Documents" section within your account dashboard for future reference and compliance verification.</p>
                    </div>
                </div>

                <div className="flex justify-end gap-4 border-t border-glass-border pt-6">
                    <button onClick={() => navigate(-1)} className="btn btn-outline py-3 px-6">Go Back</button>
                    <button
                        onClick={() => navigate('/checkout')}
                        className={`btn py-3 px-8 transition-all ${allAgreed ? 'btn-primary bg-emerald-600 hover:bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'}`}
                        disabled={!allAgreed}
                    >
                        Sign & Proceed to Payment
                    </button>
                </div>
            </div>
        </div>
    );
};

export const Checkout = () => {
    const navigate = useNavigate();
    return (
        <div className="pt-32 pb-16 min-h-screen">
            <div className="container mx-auto px-8 max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-12">

                <div>
                    <h1 className="text-3xl font-bold text-primary mb-2">Secure Checkout</h1>
                    <p className="text-secondary mb-8">Payment processed via Stripe</p>

                    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Email for License Key</label>
                            <input type="email" className="w-full bg-slate-800 border border-slate-700 rounded p-3 text-primary outline-none" placeholder="team@company.com" />
                        </div>

                        <div className="p-4 bg-slate-800 border border-slate-700 rounded-lg">
                            <div className="flex items-center gap-2 mb-4 text-slate-300">
                                <CreditCard size={18} /> Card Details
                            </div>
                            <input type="text" className="w-full bg-black/20 border border-white/10 rounded p-3 text-primary outline-none mb-3" placeholder="Card Number" />
                            <div className="grid grid-cols-2 gap-3">
                                <input type="text" className="w-full bg-black/20 border border-white/10 rounded p-3 text-primary outline-none" placeholder="MM / YY" />
                                <input type="text" className="w-full bg-black/20 border border-white/10 rounded p-3 text-primary outline-none" placeholder="CVC" />
                            </div>
                        </div>

                        <button onClick={() => {
                            alert("Payment mocked successfully. Navigating home.");
                            navigate('/');
                        }} className="w-full btn btn-primary flex justify-center items-center gap-2 py-4 shadow-[0_4px_20px_rgba(45,212,191,0.2)]">
                            <Lock size={16} /> Pay $149.00
                        </button>
                        <p className="text-[10px] text-center text-slate-500">Secured by 256-bit SSL encryption</p>
                    </form>
                </div>

                <div className="glass-panel p-8 h-fit">
                    <h3 className="font-bold text-primary mb-4 border-b border-glass-border pb-2">Order Summary</h3>
                    <div className="flex justify-between items-start mb-4 text-sm">
                        <div>
                            <div className="text-slate-300 font-medium">Longitudinal ICU Encounters</div>
                            <div className="text-xs text-slate-500">AUR-EHR-00087 â€¢ API Delivery</div>
                            <div className="text-[10px] text-blue-400 mt-1">DUA Signed</div>
                        </div>
                        <div className="text-primary">$149.00</div>
                    </div>

                    <div className="border-t border-glass-border pt-4 flex justify-between items-center mt-8">
                        <span className="font-bold text-slate-300">Total</span>
                        <span className="text-2xl font-bold text-primary">$149.00</span>
                    </div>
                </div>

            </div>
        </div>
    );
};
