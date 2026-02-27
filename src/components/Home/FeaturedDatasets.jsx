import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, FileText, Database, ShieldCheck, Download, Code2, Box } from 'lucide-react';
import { motion } from 'framer-motion';
import './FeaturedDatasets.css';

const datasets = [
    {
        id: 'AUR-EHR-00087',
        name: 'Longitudinal ICU Encounters â€” Critical Care Dataset',
        category: 'EHR',
        subCategory: 'ICU & Critical Care',
        records: '186,000',
        formats: ['CSV', 'Parquet', 'FHIR'],
        compliance: ['HIPAA Safe Harbor', 'GDPR-Ready', 'DPDP-Ready'],
        rating: 4.9,
        reviews: 124,
        startingPrice: '12367',
        delivery: ['api', 'docker'],
    },
    {
        id: 'AUR-IMG-00143',
        name: 'High-Res Chest X-Ray Annotated Dataset with Clinical Notes',
        category: 'Imaging',
        subCategory: 'Radiology',
        records: '45,200',
        formats: ['DICOM', 'JSON'],
        compliance: ['HIPAA Safe Harbor', 'DPDP Compliant'],
        rating: 4.8,
        reviews: 89,
        startingPrice: '24817',
        delivery: ['download'],
    },
    {
        id: 'AUR-PVM-00021',
        name: 'FDA FAERS Curated Extract: Post-Market Surveillance',
        category: 'Pharmacovigilance',
        subCategory: 'Adverse Drug Reactions',
        records: '2.4M',
        formats: ['CSV', 'Parquet', 'SQL'],
        compliance: ['Aggregated', 'Open License'],
        rating: 4.7,
        reviews: 215,
        startingPrice: '49717',
        delivery: ['api', 'docker', 'download'],
    },
    {
        id: 'AUR-GEN-00092',
        name: 'Cancer Genome Atlas Subset: Oncology Biomarkers',
        category: 'Genomics',
        subCategory: 'Whole Genome Sequencing',
        records: '12,500',
        formats: ['VCF', 'CSV', 'JSON'],
        compliance: ['HIPAA Safe Harbor', 'DPDP Compliant', 'IRB DUA'],
        rating: 5.0,
        reviews: 42,
        startingPrice: 'Custom',
        delivery: ['docker'],
    }
];

const FeaturedDatasets = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 100, damping: 10 }
        }
    };
    const carouselRef = useRef();
    const [width, setWidth] = useState(0);

    useEffect(() => {
        if (carouselRef.current) {
            setWidth(carouselRef.current.scrollWidth - carouselRef.current.offsetWidth);
        }
    }, [carouselRef.current]);

    return (
        <section className="featured-section overflow-hidden">
            <div className="container mx-auto px-8 relative">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ type: "spring", stiffness: 100, damping: 10 }}
                    className="flex justify-between items-end mb-8"
                >
                    <div>
                        <h2 className="text-3xl font-bold mb-2 text-primary">Featured Datasets</h2>
                        <p className="text-secondary">Highly-rated datasets recently cleared by our clinical compliance team. <span className="text-purple-400 font-medium">Swipe to explore.</span></p>
                    </div>
                    <Link to="/gallery" className="btn btn-outline hidden md:inline-flex z-10">View All</Link>
                </motion.div>

                <motion.div
                    ref={carouselRef}
                    className="carousel-container cursor-grab active:cursor-grabbing"
                    whileTap={{ cursor: "grabbing" }}
                >
                    <motion.div
                        drag="x"
                        dragConstraints={{ right: 0, left: -width }}
                        className="flex gap-6 pb-8"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.1 }}
                    >
                        {datasets.map((dataset) => (
                            <motion.div
                                variants={itemVariants}
                                key={dataset.id}
                                className="dataset-card glass-panel group relative flex flex-col items-start overflow-hidden hover:-translate-y-1 transition-transform pointer-events-auto min-w-[320px] max-w-[350px] shrink-0"
                            >
                                <div className="mb-4">
                                    <div className="flex gap-2 mb-3 flex-wrap">
                                        <span className="text-xs font-semibold px-2 py-1 rounded bg-slate-800 text-blue-400 border border-slate-700">
                                            {dataset.category}
                                        </span>
                                        <span className="text-xs px-2 py-1 rounded bg-slate-800/50 text-slate-300 border border-slate-700/50">
                                            {dataset.subCategory}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-semibold text-primary mb-2 line-clamp-2 leading-tight group-hover:text-purple-400 transition-colors">
                                        {dataset.name}
                                    </h3>

                                    <div className="flex items-center gap-1 text-sm text-yellow-500 mb-4">
                                        <Star size={14} fill="currentColor" />
                                        <span className="font-medium text-slate-200">{dataset.rating}</span>
                                        <span className="text-slate-500 ml-1">({dataset.reviews} reviews)</span>
                                    </div>
                                </div>

                                <div className="dataset-meta mb-5 space-y-2 w-full">
                                    <div className="meta-row">
                                        <Database size={14} className="text-slate-400" />
                                        <span>{dataset.records} Patient Records</span>
                                    </div>
                                    <div className="meta-row">
                                        <FileText size={14} className="text-slate-400" />
                                        <div className="flex gap-1">
                                            {dataset.formats.map((fmt) => (
                                                <span key={fmt} className="format-tag">{fmt}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="meta-row mt-2 pt-2 border-t border-glass-border w-full">
                                        <ShieldCheck size={14} className="text-blue-400" />
                                        <div className="flex gap-1 flex-wrap">
                                            {dataset.compliance.map((comp) => (
                                                <span key={comp} className="text-xs text-blue-300">{comp}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="dataset-footer mt-auto pt-4 border-t border-glass-border flex items-center justify-between w-full relative z-20">
                                    <div>
                                        <div className="text-xs text-slate-400 mb-1">Starting from</div>
                                        <div className="font-bold text-lg text-primary">
                                            {dataset.startingPrice === 'Custom' ? 'Enterprise Quote' : `₹${Number(dataset.startingPrice).toLocaleString()}`}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        {dataset.delivery.includes('download') && <span title="Direct Download" className="delivery-icon"><Download size={16} /></span>}
                                        {dataset.delivery.includes('api') && <span title="API Access" className="delivery-icon"><Code2 size={16} /></span>}
                                        {dataset.delivery.includes('docker') && <span title="Docker Container" className="delivery-icon"><Box size={16} /></span>}
                                    </div>
                                </div>

                                {/* Fix drag vs click issue by ensuring link works properly */}
                                <Link to={`/dataset/${dataset.id}`} className="absolute inset-0 z-10 pointer-events-auto" draggable="false">
                                    <span className="sr-only">View Details</span>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
                <div className="mt-8 text-center md:hidden">
                    <Link to="/gallery" className="btn btn-outline w-full justify-center">View All Datasets</Link>
                </div>
            </div>
        </section>
    );
};

export default FeaturedDatasets;
