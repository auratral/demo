import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const FAQS = [
    {
        category: 'About Auratral',
        items: [
            {
                q: 'What is Auratral?',
                a: 'Auratral is a secure, B2B Compute-to-Data clinical hosting platform. Researchers spin up isolated sandbox runtimes with built-in code editors to train models and execute clinical simulations directly next to de-identified healthcare data, maintaining strict privacy compliance.',
            },
            {
                q: 'Who are the datasets meant for?',
                a: 'Auratral serves AI researchers, clinical data scientists, and healthcare developers across academic institutions, universities, and enterprise research divisions (like pharmaceutical or health-tech labs) who need secure access to run model training and statistical analysis without navigating lengthy, high-risk data-sharing agreements.',
            },
            {
                q: 'Are all datasets real patient data?',
                a: 'Yes. All datasets are sourced from real-world clinical environments and rigorously de-identified following HIPAA Safe Harbor and GDPR Article 9 standards. You interact with and analyze these de-identified datasets within a secure sandbox environment.',
            },
        ],
    },
    {
        category: 'Data & Access',
        items: [
            {
                q: 'How do I access a dataset after purchase?',
                a: 'Once you allocate compute credits and sign the isolated execution agreement, your workspace is provisioned instantly. You can launch your sandboxed IDE from your dashboard immediately to start writing scripts, training models, and executing queries.',
            },
            {
                q: 'Can I preview a dataset before buying?',
                a: 'Yes. Every dataset page displays a 5-row de-identified preview showing schema structure, data types, and full column-level statistics. You can inspect these fields and preview columns before allocating credits to start a full runtime sandbox.',
            },
            {
                q: 'What formats are the datasets available in?',
                a: 'Datasets are pre-mounted inside your sandboxed workspace container, typically as high-performance Parquet or CSV files. You can load them directly inside your workspace scripts using standard Python (Pandas/Polars) or R data-frame utilities.',
            },
            {
                q: 'Can I request a custom dataset that isn\'t listed?',
                a: 'Yes. Visit the Custom Request page to describe your clinical cohort criteria. Our data operations team will check feasibility with provider partners, package the cohort under a de-identified policy, and notify you when the custom workspace is ready to be loaded.',
            },
        ],
    },
    {
        category: 'Compliance & Legal',
        items: [
            {
                q: 'Is the data HIPAA and GDPR compliant?',
                a: 'Yes. Our platform operates on a zero-export philosophy where you only download training weights, metrics, and logs. This enforces complete compliance with HIPAA Safe Harbor, GDPR Article 9, and India\'s DPDP Act.',
            },
            {
                q: 'What is a Data Use Agreement (DUA)?',
                a: 'On Auratral, the DUA is a Compute Isolation NDA. It is a legally binding contract signed digitally before launching a sandbox. It governs permitted research intents, prohibits attempts at patient re-identification, and enforces zero-export rules, ensuring that only aggregated statistical reports and model checkpoints are extracted.',
            },
            {
                q: 'Can I use a purchased dataset to train an AI model?',
                a: 'Yes. Training AI/ML models is the primary use case. You can execute training loops using frameworks like PyTorch or TensorFlow directly inside our high-performance GPU/CPU clusters. Once training is complete, you can download your final model weights (e.g., `.pkl`, `.onnx` files) and validation metrics.',
            },
        ],
    },
    {
        category: 'Pricing & Billing',
        items: [
            {
                q: 'How is pricing structured?',
                a: 'Pricing is based on Compute Credits, where 1 Credit = ₹10. You allocate credits to purchase annual workspace licenses (e.g., 1,237 Cr/year) and cover runtime compute usage (e.g., 2 Cr/minute for CPU runtimes, higher for GPU runtimes).',
            },
            {
                q: 'Is there a discount for .edu email addresses?',
                a: 'Yes. Verified academic researchers signing up with a .edu email address receive complimentary starter credits to set up their first sandboxed environment and run exploratory data scripts.',
            },
            {
                q: 'What payment methods are supported?',
                a: 'We accept all major credit/debit cards, UPI, and net banking for credit top-ups. For larger research labs and enterprise accounts, we support invoicing, purchase-order workflows, and corporate credit line setups.',
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
