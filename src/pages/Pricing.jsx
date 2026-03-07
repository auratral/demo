import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    GraduationCap, Building2, Building, CheckCircle2, X, ChevronDown,
    ChevronUp, Star, ShieldCheck, Zap, ArrowRight, Lock, Unlock,
    FileText, RefreshCw, Send, AlertTriangle, Users, Database, MessageSquare
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════════════ */

const TIERS = [
    {
        icon: GraduationCap,
        name: 'Students / Research Scholars',
        emoji: '🎓',
        target: 'MSc/PhD students & independent researchers',
        commitment: 'Pay per dataset — no subscription',
        platformFee: '₹0',
        color: 'blue',
        highlight: false,
        features: [
            { text: 'Single subset purchase', ok: true },
            { text: 'Academic Non-Commercial license', ok: true },
            { text: 'Up to 10% off with .edu email', ok: true },
            { text: 'Community forum support', ok: true },
            { text: 'Compliance docs included', ok: true },
            { text: 'API access', ok: false },
            { text: 'Docker delivery', ok: false },
            { text: 'Custom cohort builder', ok: false },
        ],
        cta: 'Browse Datasets',
        ctaLink: '/gallery',
        ctaVariant: 'outline',
    },
    {
        icon: Building2,
        name: 'Universities',
        emoji: '🏫',
        target: 'Universities, research institutes & colleges',
        commitment: 'Annual subscription — full catalog access',
        platformFee: '₹0',
        color: 'purple',
        highlight: true,
        badge: 'Most Popular',
        features: [
            { text: 'Multi-dataset catalog access (yearly)', ok: true },
            { text: 'Academic Non-Commercial + Research & Publication licenses', ok: true },
            { text: 'IRB-compatible DUA included', ok: true },
            { text: 'REST API + FHIR R4 access', ok: true },
            { text: 'Docker delivery', ok: true },
            { text: 'Custom cohort builder (paid add-on)', ok: true },
            { text: 'Email support (48h SLA)', ok: true },
            { text: 'Dedicated CSM', ok: false },
        ],
        cta: 'Contact Us',
        ctaLink: '#enterprise-form',
        ctaVariant: 'primary',
    },
    {
        icon: Building,
        name: 'Enterprise',
        emoji: '🏢',
        target: 'Health-tech firms, pharma, AI companies & insurers',
        commitment: 'Annual contract — bespoke pricing',
        platformFee: 'Custom',
        color: 'indigo',
        highlight: false,
        features: [
            { text: 'Unlimited catalog access', ok: true },
            { text: 'All license types including AI Training & OEM', ok: true },
            { text: 'Full DUA + BAA + MSA', ok: true },
            { text: 'Priority API SLA (99.5% uptime)', ok: true },
            { text: 'Docker + custom ingestion pipeline', ok: true },
            { text: 'Custom cohort builder included', ok: true },
            { text: 'Dedicated Data Success Manager', ok: true },
            { text: 'Exclusive license option available', ok: true },
        ],
        cta: 'Contact Enterprise',
        ctaLink: '#enterprise-form',
        ctaVariant: 'outline',
    },
];

const DATASET_PRICES = [
    { category: 'EHR / ICU', icon: '🏥', price: '₹12,367', includes: 'De-identified cohort, 1 format, 1-yr license', exclusive: '₹45,00,000' },
    { category: 'Imaging', icon: '🔬', price: '₹24,817', includes: 'DICOM + JSON, bounding boxes, radiologist labels', exclusive: '₹60,00,000' },
    { category: 'Pharma / FAERS', icon: '💊', price: '₹49,717', includes: 'Full curated extract, quarterly refresh', exclusive: '₹72,00,000' },
    { category: 'Genomics', icon: '🧬', price: 'Custom Quote', includes: 'VCF + clinical linkage, enterprise DUA required', exclusive: '₹90,00,000' },
    { category: 'Mental Health', icon: '🧠', price: '₹16,517', includes: 'Survey corpus, item-level data', exclusive: '₹37,50,000' },
    { category: 'Real-World / Trials', icon: '📊', price: '₹33,117', includes: 'Longitudinal cohort, semi-annual refresh', exclusive: '₹52,50,000' },
];

const UNIVERSITY_BANDS = [
    { band: 'Small', size: '< 5,000 students', price: '₹3,60,000', datasets: 'Up to 3 datasets' },
    { band: 'Medium', size: '5,000 – 20,000 students', price: '₹7,50,000', datasets: 'Up to 8 datasets' },
    { band: 'Large', size: '> 20,000 students', price: '₹13,50,000', datasets: 'Full catalog access' },
];

const ADDONS = [
    { icon: Users, name: 'Custom Cohort Builder', desc: 'Filter by demographics, diagnosis, date range — receive only the exact slice you need', price: '₹8,000 – ₹25,000', note: 'Based on complexity' },
    { icon: FileText, name: 'Format Conversion', desc: 'Receive an additional file format beyond your base (e.g., FHIR R4 on top of CSV)', price: '+₹3,500', note: 'Per format' },
    { icon: RefreshCw, name: 'Longitudinal Extension', desc: 'Extend the temporal coverage window of your dataset beyond the base period', price: '+₹14,000', note: 'Per year added' },
    { icon: Zap, name: 'API Access Pack', desc: 'Live REST endpoint + FHIR streaming to query data programmatically without downloading files', price: '+₹9,999', note: 'Per dataset' },
    { icon: Database, name: 'Docker Bundle', desc: 'Dataset pre-loaded in a PostgreSQL DB + Jupyter notebook environment — zero setup required', price: '+₹14,999', note: 'One-time' },
    { icon: Star, name: 'Priority Refresh', desc: 'Receive updated data ahead of the standard release cycle — critical for active pharmacovigilance', price: '+₹18,000', note: 'Per refresh cycle' },
    { icon: ShieldCheck, name: 'IRB Pack', desc: 'Formally executed IRB-compatible Data Use Agreement, delivered within 5 business days', price: '+₹12,000', note: 'One-time' },
];

const NON_EXCLUSIVE_LICENSES = [
    { emoji: '🎓', name: 'Academic Non-Commercial', who: 'Students, PhD scholars', commercial: false, publish: 'With citation', trainAI: true, redistribute: false, multiplier: '1× base price', tiers: ['Students', 'Universities'] },
    { emoji: '📖', name: 'Research & Publication', who: 'Independent researchers, think tanks', commercial: false, publish: 'With attribution', trainAI: true, redistribute: false, multiplier: '1.3× base', tiers: ['Students', 'Universities'] },
    { emoji: '🏢', name: 'Commercial Analytics', who: 'Enterprises — internal BI / reporting', commercial: 'Internal only', publish: false, trainAI: true, redistribute: false, multiplier: '2× base', tiers: ['Enterprise'] },
    { emoji: '🔁', name: 'OEM / Redistribution', who: 'Companies embedding data in their product', commercial: true, publish: true, trainAI: true, redistribute: 'Via product', multiplier: 'Custom / negotiated', tiers: ['Enterprise'] },
];


const EXCLUSIVE_PRICES = [
    { dataset: 'EHR / ICU', icon: '🏥', estAnnual: '₹6,00,000', period: '5 yrs', exclusivePrice: '₹45,00,000' },
    { dataset: 'Imaging', icon: '🔬', estAnnual: '₹8,00,000', period: '5 yrs', exclusivePrice: '₹60,00,000' },
    { dataset: 'Pharma / FAERS', icon: '💊', estAnnual: '₹12,00,000', period: '4 yrs', exclusivePrice: '₹72,00,000' },
    { dataset: 'Genomics', icon: '🧬', estAnnual: '₹10,00,000', period: '6 yrs', exclusivePrice: '₹90,00,000' },
    { dataset: 'Mental Health', icon: '🧠', estAnnual: '₹5,00,000', period: '5 yrs', exclusivePrice: '₹37,50,000' },
    { dataset: 'Real-World / Trials', icon: '📊', estAnnual: '₹7,00,000', period: '5 yrs', exclusivePrice: '₹52,50,000' },
];

const FAQS = [
    { q: 'Are these prices for commercial use?', a: 'No. The base prices shown are for the Academic Non-Commercial license. Commercial licenses (AI Training, Analytics, OEM) apply a price multiplier of 2× to 2.5× on top of the base price. This is selected at checkout.' },
    { q: 'What is a Data Use Agreement (DUA)?', a: 'A DUA is a legal contract that defines exactly how you may use the dataset — permitted uses, restrictions, publication rights, and liability. Every purchase includes a DUA. Enterprise buyers also get a BAA (Business Associate Agreement) and MSA.' },
    { q: 'Can I try a dataset before buying?', a: 'Yes. Every dataset page shows a 5-row de-identified sample and full column statistics for free. For select datasets (EHR/ICU, Mental Health, Diabetes), registered users can request up to 10 records via a research intent form.' },
    { q: 'How does the .edu academic discount work?', a: 'Independent researchers (not affiliated with a purchasing university) can get up to 10% off at checkout by verifying a .edu email address. This discount applies only to the Academic Non-Commercial license.' },
    { q: 'What happens after I buy an Exclusive License?', a: 'The dataset is permanently removed from the Auratral gallery within 48 hours of payment completion. A formal Exclusive Data Transfer Agreement is signed. Auratral retains the right to keep only anonymised aggregate statistics (no raw data).' },
    { q: 'Can a university student use the AI/Model Training license?', a: 'Not under the University subscription. AI/Model Training is an Enterprise-only license because it enables commercial downstream value from trained models. Universities are licensed for Academic Non-Commercial and Research & Publication only.' },
];

/* ═══════════════════════════════════════════════════════════════
   CONTACT MODAL
═══════════════════════════════════════════════════════════════ */

const ContactModal = ({ open, onClose, title, subtitle }) => {
    const [form, setForm] = useState({ name: '', institution: '', email: '', message: '' });
    const [done, setDone] = useState(false);

    if (!open) return null;

    const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    const handleSubmit = e => { e.preventDefault(); setDone(true); };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={onClose}>
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <div
                className="relative z-10 glass-panel border border-purple-500/30 shadow-2xl shadow-purple-500/10 w-full max-w-lg p-8"
                onClick={e => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-slate-200 transition-colors" aria-label="Close">
                    <X size={20} />
                </button>

                {done ? (
                    <div className="text-center py-6">
                        <CheckCircle2 size={48} className="text-green-400 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-primary mb-2">Message Sent!</h3>
                        <p className="text-slate-400 text-sm">Our team will get back to you within 2 business days.</p>
                        <button onClick={onClose} className="mt-6 btn btn-outline py-2 px-6">Close</button>
                    </div>
                ) : (
                    <>
                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-primary mb-1">{title}</h3>
                            <p className="text-sm text-slate-400">{subtitle}</p>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Full Name *</label>
                                    <input required name="name" value={form.name} onChange={handleChange}
                                        placeholder="Dr. Priya Nair"
                                        className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-primary placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-colors" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Institution *</label>
                                    <input required name="institution" value={form.institution} onChange={handleChange}
                                        placeholder="IIT Bombay / Pharma Corp"
                                        className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-primary placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-colors" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1.5">Contact Email *</label>
                                <input required type="email" name="email" value={form.email} onChange={handleChange}
                                    placeholder="you@institution.edu"
                                    className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-primary placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-colors" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1.5">Brief Message</label>
                                <textarea name="message" value={form.message} onChange={handleChange} rows={3}
                                    placeholder="Tell us about your use case, institution size, or datasets of interest…"
                                    className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-primary placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-colors resize-none" />
                            </div>
                            <button type="submit" className="w-full btn btn-primary py-3 justify-center">
                                <Send size={15} /> Send Message
                            </button>
                            <p className="text-[11px] text-slate-600 text-center">We'll respond within 2 business days. No spam, ever.</p>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

/* ═══════════════════════════════════════════════════════════════
   SUB-COMPONENTS
═══════════════════════════════════════════════════════════════ */

const ColorMap = {
    blue: { border: 'border-blue-500/30', badge: 'bg-blue-500/10 text-blue-400', glow: 'shadow-blue-500/10', check: 'text-blue-400' },
    purple: { border: 'border-purple-500/50', badge: 'bg-purple-500/10 text-purple-400', glow: 'shadow-purple-500/20', check: 'text-purple-400' },
    indigo: { border: 'border-indigo-500/30', badge: 'bg-indigo-500/10 text-indigo-400', glow: 'shadow-indigo-500/10', check: 'text-indigo-400' },
};


const Check = ({ ok, color }) => ok
    ? <CheckCircle2 size={15} className={`shrink-0 mt-0.5 ${color}`} />
    : <X size={15} className="shrink-0 mt-0.5 text-slate-700" />;

const BoolBadge = ({ val }) => {
    if (val === false) return <span className="text-slate-600 text-xs">—</span>;
    if (val === true) return <span className="text-green-400 text-xs font-semibold">✅ Yes</span>;
    return <span className="text-xs text-emerald-400">{val}</span>;
};

const SectionHeading = ({ tag, title, sub }) => (
    <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/50 text-xs font-semibold text-indigo-400 mb-4">{tag}</div>
        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-3">{title}</h2>
        {sub && <p className="text-slate-400 max-w-2xl mx-auto">{sub}</p>}
    </div>
);

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════ */
const Pricing = () => {
    const [openFaq, setOpenFaq] = useState(null);
    const [form, setForm] = useState({ name: '', institution: '', email: '', useCase: '', dataset: '', volume: '' });
    const [submitted, setSubmitted] = useState(false);
    // Modal state: 'university' | 'enterprise' | 'general' | null
    const [modal, setModal] = useState(null);

    const handleFormChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    const handleFormSubmit = (e) => { e.preventDefault(); setSubmitted(true); };

    const MODALS = {
        university: { title: 'University Subscription Enquiry', subtitle: 'Tell us about your institution and we\'ll tailor a subscription band for you.' },
        enterprise: { title: 'Enterprise Pricing Enquiry', subtitle: 'Share your requirements and our team will follow up with a bespoke quote.' },
        general: { title: 'Not Sure Which Tier Fits?', subtitle: 'Describe your research and we\'ll recommend the right tier, license, and datasets.' },
    };

    return (
        <div className="pt-32 pb-24 min-h-screen font-sans relative overflow-hidden">
            {/* Contact Modals */}
            {modal && (
                <ContactModal
                    open={!!modal}
                    onClose={() => setModal(null)}
                    title={MODALS[modal].title}
                    subtitle={MODALS[modal].subtitle}
                />
            )}
            {/* BG glows */}
            <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-purple-500/8 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute top-60 left-0 w-[500px] h-[500px] bg-blue-500/8 rounded-full blur-[150px] pointer-events-none" />

            {/* ── HERO ── */}
            <div className="container mx-auto px-8 text-center max-w-4xl mb-24">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/50 text-xs font-semibold text-indigo-400 mb-6">
                    <ShieldCheck size={13} /> All prices in INR · Compliance docs included
                </div>
                <h1 className="text-5xl md:text-6xl font-extrabold text-primary mb-6 leading-tight tracking-tight">
                    Transparent Pricing.<br />
                    <span className="text-gradient">No Surprises.</span>
                </h1>
                <p className="text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto mb-8">
                    Pay only for what your research needs. Every purchase includes a Data Use Agreement, compliance documentation, and Auratral's Quality Score guarantee.
                </p>
                <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-400">
                    {['HIPAA Safe Harbor', 'GDPR Article 9', 'DPDP Compliant', 'IRB-Compatible DUAs'].map(t => (
                        <span key={t} className="flex items-center gap-1.5 bg-slate-800/60 border border-slate-700 px-3 py-1.5 rounded-full">
                            <CheckCircle2 size={13} className="text-green-400" /> {t}
                        </span>
                    ))}
                </div>
            </div>

            {/* ── SECTION 1: TIERS ── */}
            <div className="container mx-auto px-8 mb-28">
                <SectionHeading tag="🎯 Buyer Tiers" title="Choose Your Access Level" sub="No platform fee for students or universities. Enterprise pricing is bespoke — contact us for a quote." />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {TIERS.map(tier => {
                        const c = ColorMap[tier.color];
                        return (
                            <div key={tier.name} className={`relative glass-panel p-8 flex flex-col border ${c.border} ${tier.highlight ? `shadow-2xl ${c.glow}` : ''} transition-all duration-300 hover:scale-[1.01]`}>
                                {tier.badge && (
                                    <div className={`absolute -top-3 left-1/2 -translate-x-1/2 text-[11px] font-bold px-4 py-1 rounded-full border ${c.badge} ${c.border}`}>{tier.badge}</div>
                                )}
                                <div className="mb-6">
                                    <div className="text-3xl mb-3">{tier.emoji}</div>
                                    <h3 className="text-xl font-bold text-primary mb-1">{tier.name}</h3>
                                    <p className="text-xs text-slate-400 mb-4">{tier.target}</p>
                                    <div className={`text-xs font-semibold px-2 py-1 rounded-md w-fit ${c.badge}`}>{tier.commitment}</div>
                                </div>

                                <div className="mb-6 pb-6 border-b border-glass-border">
                                    <div className="text-xs text-slate-500 mb-1">Platform Fee</div>
                                    <div className="text-2xl font-bold text-primary">{tier.platformFee}</div>
                                </div>

                                <ul className="space-y-3 mb-8 flex-grow">
                                    {tier.features.map(f => (
                                        <li key={f.text} className={`flex items-start gap-2.5 text-sm ${f.ok ? 'text-slate-300' : 'text-slate-600'}`}>
                                            <Check ok={f.ok} color={c.check} />
                                            {f.text}
                                        </li>
                                    ))}
                                </ul>

                                {tier.ctaVariant === 'primary'
                                    ? <button onClick={() => setModal('university')} className="btn btn-primary py-3 justify-center text-center w-full">{tier.cta} <ArrowRight size={14} /></button>
                                    : tier.cta === 'Contact Enterprise'
                                        ? <button onClick={() => setModal('enterprise')} className="btn btn-outline py-3 justify-center text-center w-full">{tier.cta}</button>
                                        : <Link to={tier.ctaLink} className="btn btn-outline py-3 justify-center text-center block">{tier.cta}</Link>
                                }
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ── SECTION 2: PER-DATASET PRICING ── */}
            <div className="container mx-auto px-8 mb-28">
                <SectionHeading tag="💰 Base Prices" title="Per-Dataset Pricing" sub="Base prices are for the Academic Non-Commercial license. License multipliers apply at checkout for commercial use." />
                <div className="max-w-5xl mx-auto">
                    <div className="glass-panel overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-800/60 border-b border-glass-border">
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-300">Category</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-300">What's included</th>
                                    <th className="text-right px-6 py-4 text-sm font-semibold text-slate-300">Base Price</th>
                                    <th className="text-right px-6 py-4 text-sm font-semibold text-gradient">Exclusive Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {DATASET_PRICES.map((d, i) => (
                                    <tr key={d.category} className={`border-b border-slate-800 hover:bg-slate-800/30 transition-colors ${i % 2 === 0 ? '' : 'bg-slate-900/20'}`}>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <span className="text-2xl">{d.icon}</span>
                                                <span className="font-semibold text-primary">{d.category}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-sm text-slate-400 max-w-xs">{d.includes}</td>
                                        <td className="px-6 py-5 text-right">
                                            <span className="text-lg font-bold text-primary">{d.price}</span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <span className="text-sm font-bold text-gradient">{d.exclusive}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="px-6 py-4 bg-slate-900/40 text-xs text-slate-500 border-t border-slate-800">
                            * Commercial use multiplies base price by 1.3× to 2.5× depending on license type selected at checkout.
                            Exclusive prices reflect full dataset withdrawal from catalog. Genomics base price is custom-quoted.
                        </div>
                    </div>
                </div>
            </div>

            {/* ── SECTION 3: UNIVERSITY BANDS ── */}
            <div className="container mx-auto px-8 mb-28">
                <SectionHeading tag="🏫 University Subscriptions" title="Annual Access for Institutions" sub="One annual fee gives your whole institution — faculty and students — access to a defined set of datasets. No per-dataset purchases needed." />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
                    {UNIVERSITY_BANDS.map((b, i) => (
                        <div key={b.band} className={`glass-panel p-8 text-center border ${i === 1 ? 'border-purple-500/40 shadow-xl shadow-purple-500/10' : 'border-slate-700/40'}`}>
                            <div className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-2">{b.band}</div>
                            <div className="text-xs text-slate-500 mb-4">{b.size}</div>
                            <div className="text-3xl font-extrabold text-primary mb-1">{b.price}</div>
                            <div className="text-xs text-slate-500 mb-6">per year</div>
                            <div className="text-sm text-indigo-400 font-medium">{b.datasets}</div>
                        </div>
                    ))}
                </div>
                <p className="text-center text-sm text-slate-500">All university subscriptions include API access, Docker delivery, and IRB-compatible DUA. <a href="#enterprise-form" className="text-indigo-400 hover:underline">Contact us</a> to negotiate your exact band.</p>
            </div>

            {/* ── SECTION 4: ADD-ONS ── */}
            <div className="container mx-auto px-8 mb-28">
                <SectionHeading tag="🔧 Add-Ons" title="Expand Your Dataset" sub="Bolt on exactly what your project needs. Add-ons are available to all tiers on top of your base purchase." />
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 max-w-6xl mx-auto">
                    {ADDONS.map(a => (
                        <div key={a.name} className="glass-panel p-6 flex flex-col gap-3 hover:border-indigo-500/30 border border-slate-700/40 transition-all duration-200">
                            <div className="flex items-start justify-between gap-3">
                                <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                                    <a.icon size={18} className="text-indigo-400" />
                                </div>
                                <div className="text-right">
                                    <div className="text-base font-bold text-primary">{a.price}</div>
                                    <div className="text-[10px] text-slate-500">{a.note}</div>
                                </div>
                            </div>
                            <div>
                                <div className="font-semibold text-sm text-slate-200 mb-1">{a.name}</div>
                                <p className="text-xs text-slate-400 leading-relaxed">{a.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── SECTION 5: NON-EXCLUSIVE LICENSES ── */}
            <div className="container mx-auto px-8 mb-16">
                <SectionHeading
                    tag="📄 Non-Exclusive Licenses"
                    title="Choose How You Use the Data"
                    sub="License type is selected at checkout. Each purchase is tied to one license type. Auratral continues selling the same dataset to other buyers."
                />
                <div className="max-w-6xl mx-auto glass-panel overflow-x-auto">
                    <table className="w-full min-w-[700px]">
                        <thead>
                            <tr className="bg-slate-800/60 border-b border-glass-border">
                                <th className="text-left px-5 py-4 text-sm font-semibold text-slate-300">License</th>
                                <th className="text-left px-5 py-4 text-sm font-semibold text-slate-300">Best for</th>
                                <th className="text-center px-4 py-4 text-sm font-semibold text-slate-300">Commercial?</th>
                                <th className="text-center px-4 py-4 text-sm font-semibold text-slate-300">Publish?</th>
                                <th className="text-center px-4 py-4 text-sm font-semibold text-slate-300">Train AI?</th>
                                <th className="text-center px-4 py-4 text-sm font-semibold text-slate-300">Redistribute?</th>
                                <th className="text-right px-5 py-4 text-sm font-semibold text-indigo-400">Multiplier</th>
                            </tr>
                        </thead>
                        <tbody>
                            {NON_EXCLUSIVE_LICENSES.map((l, i) => (
                                <tr key={l.name} className={`border-b border-slate-800 hover:bg-slate-800/30 transition-colors ${i % 2 === 0 ? '' : 'bg-slate-900/20'}`}>
                                    <td className="px-5 py-4">
                                        <div className="font-semibold text-sm text-primary">{l.emoji} {l.name}</div>
                                        <div className="flex gap-1 mt-1 flex-wrap">
                                            {l.tiers.map(t => (
                                                <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400">{t}</span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 text-xs text-slate-400">{l.who}</td>
                                    <td className="px-4 py-4 text-center"><BoolBadge val={l.commercial} /></td>
                                    <td className="px-4 py-4 text-center"><BoolBadge val={l.publish} /></td>
                                    <td className="px-4 py-4 text-center"><BoolBadge val={l.trainAI} /></td>
                                    <td className="px-4 py-4 text-center"><BoolBadge val={l.redistribute} /></td>
                                    <td className="px-5 py-4 text-right">
                                        <span className="text-sm font-bold text-indigo-400">{l.multiplier}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <p className="text-center text-xs text-slate-500 mt-4">
                    🎓 Independent researchers with verified <code className="text-indigo-400">.edu</code> email get up to <strong className="text-slate-300">10% off</strong> on the Academic Non-Commercial license at checkout.
                </p>
            </div>

            {/* ── SECTION 6: EXCLUSIVE LICENSE ── */}
            <div className="container mx-auto px-8 mb-28">
                <div className="max-w-6xl mx-auto">
                    {/* Header card */}
                    <div className="glass-panel p-8 mb-6 border border-purple-500/20 bg-purple-500/5 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent pointer-events-none" />
                        <div className="relative flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center shrink-0">
                                    <Lock size={24} className="text-gradient" style={{ background: 'linear-gradient(135deg,#c084fc,#60a5fa,#f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h2 className="text-2xl font-bold text-primary">Exclusive License</h2>
                                        <span className="text-[10px] bg-purple-500/20 border border-purple-500/30 text-gradient px-2 py-0.5 rounded-full font-bold uppercase tracking-widest"
                                            style={{ background: 'linear-gradient(135deg,#c084fc,#60a5fa,#f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                                            All Tiers
                                        </span>
                                    </div>
                                    <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
                                        Gain <strong className="text-slate-200">sole rights</strong> to a dataset. Auratral permanently removes it from the gallery — no other buyer can ever purchase it. All 5 non-exclusive rights are bundled. A formal <strong className="text-slate-200">Exclusive Data Transfer Agreement</strong> is signed.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="relative grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-purple-500/20">
                            {[
                                { icon: Unlock, label: 'All usage rights bundled', sub: 'Publish, train, commercial, embed' },
                                { icon: Lock, label: 'Removed from gallery', sub: 'Within 48h of payment' },
                                { icon: FileText, label: 'Exclusive DTA signed', sub: 'Formal legal agreement' },
                                { icon: AlertTriangle, label: '50% deposit required', sub: 'Remainder within 30 days' },
                            ].map(({ icon: Icon, label, sub }) => (
                                <div key={label} className="flex items-start gap-3">
                                    <Icon size={16} className="text-purple-400 shrink-0 mt-0.5" />
                                    <div>
                                        <div className="text-sm font-semibold text-slate-200">{label}</div>
                                        <div className="text-xs text-slate-500">{sub}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Exclusive price table */}
                    <div className="glass-panel overflow-hidden border border-slate-700/40">
                        <div className="bg-slate-800/60 px-6 py-4 border-b border-glass-border">
                            <h3 className="font-bold text-slate-200">Exclusive License Pricing by Dataset</h3>
                            <p className="text-xs text-slate-500 mt-1">Formula: (Est. annual revenue × relevance period) × 1.5 exclusivity premium</p>
                        </div>
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-800 text-xs text-slate-500 uppercase tracking-wider">
                                    <th className="text-left px-6 py-3">Dataset</th>
                                    <th className="text-right px-6 py-3">Est. Annual Revenue</th>
                                    <th className="text-right px-6 py-3">Relevance Period</th>
                                    <th className="text-right px-6 py-3 text-gradient"
                                        style={{ background: 'linear-gradient(135deg,#c084fc,#60a5fa,#f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', backgroundSize: '200% auto', animation: 'textShine 5s linear infinite' }}>
                                        Exclusive Price
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {EXCLUSIVE_PRICES.map((e, i) => (
                                    <tr key={e.dataset} className={`border-b border-slate-800 hover:bg-slate-800/30 transition-colors ${i % 2 === 0 ? '' : 'bg-slate-900/20'}`}>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <span className="text-xl">{e.icon}</span>
                                                <span className="font-semibold text-primary">{e.dataset}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm text-slate-400">{e.estAnnual}/yr</td>
                                        <td className="px-6 py-4 text-right text-sm text-slate-400">{e.period}</td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="text-xl font-extrabold text-gradient">{e.exclusivePrice}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="px-6 py-4 bg-slate-900/40 text-xs text-slate-500 border-t border-slate-800">
                            Exclusive licensing enquiries must go through the Enterprise contact form below. Final price is subject to negotiation and a formal legal process.
                        </div>
                    </div>
                </div>
            </div>

            {/* ── SECTION 7: ENTERPRISE FORM ── */}
            <div id="enterprise-form" className="container mx-auto px-8 mb-28">
                <SectionHeading tag="🏢 Enterprise & Universities" title="Get a Custom Quote" sub="Fill in the form and our team will follow up within 2 business days. No pricing is shown — all enterprise and university deals are bespoke." />
                <div className="max-w-2xl mx-auto">
                    {submitted ? (
                        <div className="glass-panel p-12 text-center border border-green-500/20">
                            <CheckCircle2 size={48} className="text-green-400 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-primary mb-2">Enquiry Received!</h3>
                            <p className="text-slate-400">Our team will reach out within 2 business days to discuss your requirements and pricing.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleFormSubmit} className="glass-panel p-8 space-y-5 border border-slate-700/40">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Full Name *</label>
                                    <input required name="name" value={form.name} onChange={handleFormChange}
                                        className="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-4 py-3 text-sm text-primary placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                                        placeholder="Dr. Arjun Sharma" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Institution / Company *</label>
                                    <input required name="institution" value={form.institution} onChange={handleFormChange}
                                        className="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-4 py-3 text-sm text-primary placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                                        placeholder="AIIMS Delhi / MedTech Pvt Ltd" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Email Address *</label>
                                <input required type="email" name="email" value={form.email} onChange={handleFormChange}
                                    className="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-4 py-3 text-sm text-primary placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                                    placeholder="arjun@institution.ac.in" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Dataset(s) of Interest *</label>
                                <select required name="dataset" value={form.dataset} onChange={handleFormChange}
                                    className="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-4 py-3 text-sm text-primary focus:outline-none focus:border-indigo-500 transition-colors">
                                    <option value="">Select a dataset category…</option>
                                    {DATASET_PRICES.map(d => <option key={d.category} value={d.category}>{d.icon} {d.category}</option>)}
                                    <option value="Multiple">Multiple datasets</option>
                                    <option value="Full Catalog">Full catalog access</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Intended Use Case *</label>
                                <textarea required name="useCase" value={form.useCase} onChange={handleFormChange} rows={3}
                                    className="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-4 py-3 text-sm text-primary placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                                    placeholder="e.g. Training a sepsis prediction model for internal clinical deployment at our hospital network…" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Expected Volume / Scale</label>
                                <input name="volume" value={form.volume} onChange={handleFormChange}
                                    className="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-4 py-3 text-sm text-primary placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                                    placeholder="e.g. 50,000 records, 3 datasets, annual refresh" />
                            </div>
                            <button type="submit" className="w-full btn btn-primary py-3.5 justify-center text-base">
                                <Send size={16} /> Submit Enquiry
                            </button>
                            <p className="text-xs text-slate-500 text-center">By submitting you agree to Auratral's Privacy Policy. We will never share your information.</p>
                        </form>
                    )}
                </div>
            </div>

            {/* ── SECTION 8: FAQ ── */}
            <div className="container mx-auto px-8 mb-16">
                <SectionHeading tag="❓ FAQ" title="Frequently Asked Questions" />
                <div className="max-w-3xl mx-auto space-y-3">
                    {FAQS.map((item, i) => (
                        <div key={i} className="glass-panel border border-slate-700/40 overflow-hidden transition-all duration-200">
                            <button
                                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left cursor-pointer hover:bg-slate-800/30 transition-colors"
                                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                            >
                                <span className="font-semibold text-slate-200 text-sm">{item.q}</span>
                                {openFaq === i ? <ChevronUp size={16} className="text-indigo-400 shrink-0" /> : <ChevronDown size={16} className="text-slate-500 shrink-0" />}
                            </button>
                            {openFaq === i && (
                                <div className="px-6 pb-5 text-sm text-slate-400 leading-relaxed border-t border-slate-800 pt-4">
                                    {item.a}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* ── FOOTER CTA ── */}
            <div className="container mx-auto px-8">
                <div className="max-w-3xl mx-auto glass-panel p-10 text-center border border-indigo-500/20 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-indigo-500/5 pointer-events-none" />
                    <div className="relative">
                        <h3 className="text-2xl font-bold text-primary mb-3">Not sure which tier fits?</h3>
                        <p className="text-slate-400 mb-6 text-sm">Talk to our team — we'll help you find the right dataset, license, and access model for your research.</p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <button onClick={() => setModal('general')} className="btn btn-primary py-3 px-8">Contact Our Team</button>
                            <Link to="/gallery" className="btn btn-outline py-3 px-8">Browse Datasets</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Pricing;
