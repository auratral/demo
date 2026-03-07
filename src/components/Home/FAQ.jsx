import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const FAQS = [
    {
        category: 'About Auratral',
        items: [
            {
                q: 'What is Auratral?',
                a: 'Auratral is a B2B medical data marketplace that curates, de-identifies, and licenses premium healthcare datasets for AI research, clinical analysis, and enterprise use. Every dataset ships with a Data Use Agreement, compliance documentation, and Auratral\'s Quality Score guarantee.',
            },
            {
                q: 'Who are the datasets meant for?',
                a: 'Auratral serves three buyer types: Students & Research Scholars who need affordable single-dataset access for their work; Universities & Research Institutes requiring annual catalog subscriptions across departments; and Enterprise organisations such as health-tech firms, pharma companies, and AI labs that need bulk access, custom pipelines, and commercial licenses.',
            },
            {
                q: 'Are all datasets real patient data?',
                a: 'All datasets are sourced from real-world clinical environments and then rigorously de-identified following HIPAA Safe Harbor and GDPR Article 9 standards before being listed. What you purchase is a research-ready, anonymised extract — not raw patient records.',
            },
        ],
    },
    {
        category: 'Data & Access',
        items: [
            {
                q: 'How do I access a dataset after purchase?',
                a: 'After completing the checkout and signing the Data Use Agreement, your dataset is delivered to the secure download portal in your dashboard within 24 hours. You can also request API or Docker delivery as add-ons during configuration.',
            },
            {
                q: 'Can I preview a dataset before buying?',
                a: 'Yes. Every dataset page shows a free 5-row de-identified sample and full column statistics. For select datasets (EHR/ICU, Mental Health, Diabetes), verified registered users can request up to 10 records via a research intent form.',
            },
            {
                q: 'What formats are the datasets available in?',
                a: 'Datasets are available in CSV, JSON, Excel, FHIR R4, and Apache Parquet. The base purchase includes one format; additional formats can be added via the Format Conversion add-on (₹3,500 per format).',
            },
            {
                q: 'Can I request a custom dataset that isn\'t listed?',
                a: 'Yes — visit the Custom Request page to describe your cohort requirements. Our data team will review the feasibility, source the data, and provide a quote within 5 business days.',
            },
        ],
    },
    {
        category: 'Compliance & Legal',
        items: [
            {
                q: 'Is the data HIPAA and GDPR compliant?',
                a: 'Yes. Every dataset is processed under HIPAA Safe Harbor de-identification, GDPR Article 9 special-category data standards, and India\'s DPDP Act requirements. Compliance certificates are included with every purchase.',
            },
            {
                q: 'What is a Data Use Agreement (DUA)?',
                a: 'A DUA is a legally binding contract that specifies exactly how you may use the dataset — permitted research uses, commercial restrictions, publication rights, data retention limits, and breach reporting duties. It is signed digitally during the checkout process and stored permanently in your account.',
            },
            {
                q: 'Can I use a purchased dataset to train an AI model?',
                a: 'AI and ML training is a core supported use case on Auratral — it\'s the reason most buyers are here. All license types include the right to train models. Commercial deployment of trained models falls under the Commercial Analytics or OEM license and may have price multipliers.',
            },
        ],
    },
    {
        category: 'Pricing & Billing',
        items: [
            {
                q: 'How is pricing structured?',
                a: 'Pricing depends on your tier: Students / Researchers pay per dataset with no subscription; Universities pay an annual catalog fee based on institution size (₹3,60,000 – ₹13,50,000/yr); Enterprise contracts are bespoke. See the full breakdown on the Pricing page.',
            },
            {
                q: 'Is there a discount for .edu email addresses?',
                a: 'Independent researchers (not affiliated with a purchasing university) can get up to 10% off at checkout by verifying a .edu email address. This applies to the Academic Non-Commercial license.',
            },
            {
                q: 'What payment methods are supported?',
                a: 'Payments are processed via Stripe and support all major credit/debit cards, UPI, and net banking for INR transactions. Enterprise invoicing and purchase-order workflows are available on request.',
            },
        ],
    },
];

const FAQ = () => {
    const [open, setOpen] = useState(null);
    const toggle = (key) => setOpen(prev => prev === key ? null : key);

    return (
        <section className="py-24 px-8 relative overflow-hidden">
            {/* BG glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto max-w-4xl relative">
                {/* Heading */}
                <div className="text-center mb-14">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/50 text-xs font-semibold text-indigo-400 mb-4">
                        <HelpCircle size={13} /> Frequently Asked Questions
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-primary mb-3">
                        Got Questions? <span className="text-gradient">We've Got Answers.</span>
                    </h2>
                    <p className="text-slate-400 max-w-xl mx-auto">
                        Everything you need to know about Auratral's datasets, compliance, licensing, and access.
                    </p>
                </div>

                {/* FAQ groups */}
                <div className="space-y-10">
                    {FAQS.map((group) => (
                        <div key={group.category}>
                            <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-4 pl-1">
                                {group.category}
                            </h3>
                            <div className="space-y-2">
                                {group.items.map((item, idx) => {
                                    const key = `${group.category}-${idx}`;
                                    const isOpen = open === key;
                                    return (
                                        <div
                                            key={key}
                                            className={`glass-panel border transition-all duration-200 overflow-hidden ${isOpen ? 'border-indigo-500/30' : 'border-slate-700/40'
                                                }`}
                                        >
                                            <button
                                                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left cursor-pointer hover:bg-slate-800/30 transition-colors"
                                                onClick={() => toggle(key)}
                                            >
                                                <span className="font-semibold text-slate-200 text-sm">{item.q}</span>
                                                {isOpen
                                                    ? <ChevronUp size={16} className="text-indigo-400 shrink-0" />
                                                    : <ChevronDown size={16} className="text-slate-500 shrink-0" />
                                                }
                                            </button>
                                            {isOpen && (
                                                <div className="px-6 pb-5 text-sm text-slate-400 leading-relaxed border-t border-slate-800 pt-4">
                                                    {item.a}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer CTA */}
                <div className="mt-12 text-center">
                    <p className="text-slate-500 text-sm mb-4">Have a more specific question about pricing or licensing?</p>
                    <Link to="/pricing" className="btn btn-outline py-2.5 px-7 text-sm">
                        View Pricing & License Details →
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default FAQ;
