import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    Star, ShieldCheck, Download, Code2, Box, ArrowLeft, CheckCircle2,
    Table, BarChart2, Info, Eye, Database, Users, X, Sliders
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Activity } from 'lucide-react';
import { DATASET_REGISTRY as FULL_REGISTRY } from '../utils/computeHelpers';


/* ═══════════════════════════════════════════════════════════════
   DATASET REGISTRY — loaded from the full 60-dataset local file
   (no Firestore round-trip needed for detail pages)
═══════════════════════════════════════════════════════════════ */
const FALLBACK_ID = Object.keys(FULL_REGISTRY)[0];




/* mini SVG histogram */
const MiniHistogram = ({ values, color = '#6366f1' }) => {
    if (!values || values.length === 0) return null;
    const max = Math.max(...values);
    const w = 180, h = 48, gap = 2;
    const barW = (w - gap * (values.length - 1)) / values.length;
    return (
        <svg width={w} height={h} className="mt-2">
            {values.map((v, i) => {
                const barH = max > 0 ? (v / max) * (h - 4) : 0;
                return <rect key={i} x={i * (barW + gap)} y={h - barH} width={barW} height={barH} rx={2} fill={color} opacity={0.75} />;
            })}
        </svg>
    );
};

const SimulatedMedicalScan = ({ imageId, category, findingLabel, filterStyle = {} }) => {
    const idStr = String(imageId).toLowerCase();
    
    // Dermatology (Dermatoscopic mole)
    if (category === 'Imaging' && idStr.includes('img-208')) {
        const isMelanoma = String(findingLabel).toLowerCase().includes('melanoma') || String(findingLabel).toLowerCase().includes('carcinoma');
        return (
            <svg width="100%" height="100%" viewBox="0 0 200 200" className="bg-[#f0c3a2] rounded-lg" style={filterStyle}>
                <circle cx="40" cy="50" r="1.5" fill="#e0b090" opacity="0.6" />
                <circle cx="150" cy="120" r="2" fill="#e0b090" opacity="0.6" />
                <circle cx="80" cy="160" r="1" fill="#e0b090" opacity="0.6" />
                <path d="M 20 40 Q 60 70 80 60" stroke="#5a4230" strokeWidth="0.8" fill="none" opacity="0.4" />
                <path d="M 120 150 Q 150 170 170 140" stroke="#5a4230" strokeWidth="0.8" fill="none" opacity="0.4" />
                {isMelanoma ? (
                    <path 
                        d="M 80 80 C 60 90, 70 130, 95 125 C 120 120, 130 95, 110 75 C 95 60, 90 70, 80 80 Z" 
                        fill="url(#melanomaGrad)" 
                        stroke="#271c15" 
                        strokeWidth="1.5" 
                    />
                ) : (
                    <circle cx="100" cy="100" r="25" fill="url(#nevusGrad)" stroke="#4e3524" strokeWidth="0.8" />
                )}
                <defs>
                    <radialGradient id="melanomaGrad" cx="45%" cy="45%" r="55%">
                        <stop offset="0%" stopColor="#1c110b" />
                        <stop offset="40%" stopColor="#432818" />
                        <stop offset="75%" stopColor="#7f4f24" />
                        <stop offset="100%" stopColor="#b07d62" stopOpacity="0.4" />
                    </radialGradient>
                    <radialGradient id="nevusGrad" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#4a301a" />
                        <stop offset="85%" stopColor="#6f4e37" />
                        <stop offset="100%" stopColor="#9a7b56" stopOpacity="0.3" />
                    </radialGradient>
                </defs>
            </svg>
        );
    }

    // Ophthalmology (Retinal Fundus scan)
    if (category === 'Imaging' && idStr.includes('img-207')) {
        const hasDR = !String(findingLabel).toLowerCase().includes('normal');
        return (
            <svg width="100%" height="100%" viewBox="0 0 200 200" className="bg-[#120502] rounded-lg" style={filterStyle}>
                <circle cx="100" cy="100" r="90" fill="#e65c00" opacity="0.85" stroke="#cc3300" strokeWidth="2" />
                <circle cx="60" cy="100" r="16" fill="#ffe066" filter="blur(1px)" />
                <path d="M 60 100 Q 80 70 120 60 T 170 50" stroke="#990000" strokeWidth="2" fill="none" opacity="0.8" />
                <path d="M 60 100 Q 90 120 130 130 T 180 150" stroke="#990000" strokeWidth="2.5" fill="none" opacity="0.8" />
                <path d="M 60 100 Q 50 60 30 40 T 10 20" stroke="#990000" strokeWidth="1.5" fill="none" opacity="0.8" />
                <path d="M 60 100 Q 40 130 20 150" stroke="#990000" strokeWidth="1.8" fill="none" opacity="0.8" />
                <path d="M 100 65 Q 110 50 130 45" stroke="#990000" strokeWidth="0.8" fill="none" opacity="0.7" />
                <path d="M 110 125 Q 125 110 150 115" stroke="#990000" strokeWidth="0.8" fill="none" opacity="0.7" />
                {hasDR && (
                    <>
                        <circle cx="120" cy="85" r="2" fill="#ff0000" />
                        <circle cx="140" cy="105" r="1.5" fill="#ff0000" />
                        <circle cx="95" cy="120" r="2.5" fill="#ff0000" />
                        <circle cx="135" cy="75" r="3" fill="#ffffcc" opacity="0.9" filter="blur(0.5px)" />
                        <path d="M 145 90 Q 150 92 148 95 Z" fill="#ffffcc" opacity="0.9" filter="blur(0.5px)" />
                        <circle cx="115" cy="140" r="4" fill="#ffffcc" opacity="0.8" filter="blur(0.5px)" />
                        <path d="M 105 100 Q 108 97 112 102 Z" fill="#b30000" opacity="0.9" />
                        <path d="M 125 125 Q 128 132 122 130 Z" fill="#b30000" opacity="0.9" />
                    </>
                )}
            </svg>
        );
    }

    // Neuro-oncology / Pelvic MRI
    if (category === 'Imaging' && (idStr.includes('img-202') || idStr.includes('img-2010'))) {
        const isNormal = String(findingLabel).toLowerCase().includes('normal');
        return (
            <svg width="100%" height="100%" viewBox="0 0 200 200" className="bg-[#050508] rounded-lg" style={filterStyle}>
                <path d="M 100 25 C 50 25, 40 60, 40 100 C 40 140, 55 170, 100 170 C 145 170, 160 140, 160 100 C 160 60, 150 25, 100 25 Z" fill="#151520" stroke="#555" strokeWidth="2" />
                <path d="M 100 35 C 65 35, 50 65, 50 100 C 50 135, 65 160, 100 160 C 135 160, 150 135, 150 100 C 150 65, 135 35, 100 35 Z" fill="#252535" opacity="0.8" />
                <path d="M 85 90 C 85 70, 95 65, 95 80 C 95 95, 85 105, 85 90 Z" fill="#0c0c12" stroke="#444" strokeWidth="0.5" />
                <path d="M 115 90 C 115 70, 105 65, 105 80 C 105 95, 115 105, 115 90 Z" fill="#0c0c12" stroke="#444" strokeWidth="0.5" />
                <path d="M 70 140 Q 100 125 130 140 Q 100 165 70 140 Z" fill="#1c1c28" opacity="0.9" stroke="#3c3c4c" strokeWidth="0.5" />
                <line x1="100" y1="35" x2="100" y2="135" stroke="#333" strokeWidth="1" strokeDasharray="2,2" />
                {!isNormal && (
                    <circle cx="130" cy="90" r="16" fill="url(#mriLesion)" filter="blur(1.5px)" className="animate-pulse" />
                )}
                <defs>
                    <radialGradient id="mriLesion" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#ffffff" />
                        <stop offset="35%" stopColor="#e0e0ff" stopOpacity="0.9" />
                        <stop offset="70%" stopColor="#a0a0ff" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="#5050ff" stopOpacity="0" />
                    </radialGradient>
                </defs>
            </svg>
        );
    }

    // Cardiac Ultrasound / Thyroid Ultrasound
    if (category === 'Imaging' && (idStr.includes('img-204') || idStr.includes('img-209'))) {
        const hasLesion = !String(findingLabel).toLowerCase().includes('normal');
        return (
            <svg width="100%" height="100%" viewBox="0 0 200 200" className="bg-[#020205] rounded-lg" style={filterStyle}>
                <path d="M 100 20 L 30 170 A 90 90 0 0 0 170 170 Z" fill="#05101a" stroke="#1c2f42" strokeWidth="1" />
                <path d="M 100 20 L 50 170" stroke="#0e2338" strokeWidth="0.5" opacity="0.4" />
                <path d="M 100 20 L 75 170" stroke="#0e2338" strokeWidth="0.5" opacity="0.4" />
                <path d="M 100 20 L 125 170" stroke="#0e2338" strokeWidth="0.5" opacity="0.4" />
                <path d="M 100 20 L 150 170" stroke="#0e2338" strokeWidth="0.5" opacity="0.4" />
                <path d="M 75 90 Q 100 70 125 90 T 100 150 Z" fill="none" stroke="#2a4d6c" strokeWidth="2.5" opacity="0.75" />
                <path d="M 85 100 Q 100 85 115 100" stroke="#2a4d6c" strokeWidth="1.5" fill="none" opacity="0.6" />
                <line x1="100" y1="80" x2="100" y2="150" stroke="#2a4d6c" strokeWidth="1.5" opacity="0.6" />
                {hasLesion && (
                    <path d="M 100 95 Q 110 110 95 130" stroke="url(#flowJet)" strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.8" filter="blur(1px)" />
                )}
                <defs>
                    <linearGradient id="flowJet" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ff3300" />
                        <stop offset="50%" stopColor="#ffcc00" />
                        <stop offset="100%" stopColor="#3399ff" />
                    </linearGradient>
                </defs>
            </svg>
        );
    }

    // Chest X-Ray / Mammography / Musculoskeletal Joint X-Ray / Abdominal CT Scan
    const isNormal = String(findingLabel).toLowerCase().includes('normal');
    return (
        <svg width="100%" height="100%" viewBox="0 0 200 200" className="bg-[#050505] rounded-lg" style={filterStyle}>
            <line x1="100" y1="20" x2="100" y2="180" stroke="#444" strokeWidth="6" opacity="0.8" />
            <path d="M 90 20 L 110 20 M 88 50 L 112 50 M 85 80 L 115 80 M 82 110 L 118 110 M 85 140 L 115 140 M 88 170 L 112 170" stroke="#3a3a3a" strokeWidth="3" opacity="0.8" />
            <path d="M 100 40 Q 50 30 40 60" fill="none" stroke="#555" strokeWidth="4" opacity="0.8" />
            <path d="M 100 40 Q 150 30 160 60" fill="none" stroke="#555" strokeWidth="4" opacity="0.8" />
            <path d="M 100 65 Q 40 50 30 90" fill="none" stroke="#555" strokeWidth="4.5" opacity="0.8" />
            <path d="M 100 65 Q 160 50 170 90" fill="none" stroke="#555" strokeWidth="4.5" opacity="0.8" />
            <path d="M 100 90 Q 35 75 25 120" fill="none" stroke="#555" strokeWidth="5" opacity="0.7" />
            <path d="M 100 90 Q 165 75 175 120" fill="none" stroke="#555" strokeWidth="5" opacity="0.7" />
            <path d="M 100 115 Q 35 100 25 150" fill="none" stroke="#555" strokeWidth="5" opacity="0.6" />
            <path d="M 100 115 Q 165 100 175 150" fill="none" stroke="#555" strokeWidth="5" opacity="0.6" />
            <path d="M 100 25 Q 70 20 45 28" fill="none" stroke="#666" strokeWidth="4" opacity="0.8" />
            <path d="M 100 25 Q 130 20 155 28" fill="none" stroke="#666" strokeWidth="4" opacity="0.8" />
            <path d="M 90 35 C 65 30 50 55 45 110 C 45 140 70 145 90 140 Z" fill="#121212" opacity="0.7" stroke="#222" strokeWidth="1" />
            <path d="M 110 35 C 135 30 150 55 155 110 C 155 140 130 145 110 140 Z" fill="#121212" opacity="0.7" stroke="#222" strokeWidth="1" />
            <path d="M 95 85 C 80 90 85 125 115 130 C 115 110 110 90 95 85 Z" fill="#1a1a1a" opacity="0.95" stroke="#2d2d2d" strokeWidth="1.5" />
            {!isNormal && (
                <circle cx="65" cy="75" r="14" fill="url(#xrayLesion)" filter="blur(1px)" className="animate-pulse" />
            )}
            <defs>
                <radialGradient id="xrayLesion" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="40%" stopColor="#e5e5e5" stopOpacity="0.8" />
                    <stop offset="80%" stopColor="#cccccc" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#aaaaaa" stopOpacity="0" />
                </radialGradient>
            </defs>
        </svg>
    );
};

const DicomViewerModal = ({ isOpen, onClose, row, category }) => {
    const [contrast, setContrast] = useState(100);
    const [brightness, setBrightness] = useState(100);
    const [invert, setInvert] = useState(false);
    const [showAnnotations, setShowAnnotations] = useState(true);

    if (!isOpen || !row) return null;

    const finding = row.finding_label || row.finding || row.diagnosis || 'Normal';
    const imageId = row.image_id || 'IMG-001';

    const filterStyle = {
        filter: `brightness(${brightness}%) contrast(${contrast}%) ${invert ? 'invert(1)' : ''}`,
        transition: 'filter 0.15s ease'
    };

    return (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="flex-1 bg-black p-6 flex flex-col items-center justify-center border-r border-slate-900 relative min-h-[300px] md:min-h-[500px]">
                    <div className="absolute top-4 left-4 text-xs font-mono text-slate-500 flex flex-col gap-1 z-10">
                        <div>ID: {imageId}</div>
                        <div>MOD: {row.scan_modality || 'DICOM'}</div>
                        <div>SIZE: 512 x 512 px</div>
                    </div>
                    
                    <div className="w-full max-w-[360px] aspect-square relative flex items-center justify-center border border-slate-900 bg-slate-950/40 rounded-xl overflow-hidden shadow-inner">
                        <SimulatedMedicalScan 
                            imageId={imageId} 
                            category={category} 
                            findingLabel={finding} 
                            filterStyle={filterStyle} 
                        />
                        
                        {showAnnotations && !String(finding).toLowerCase().includes('normal') && (
                            <div className="absolute w-[25%] h-[25%] border-2 border-dashed border-red-500 rounded-lg animate-pulse" style={{ top: '35%', left: '28%' }}>
                                <span className="absolute -top-5 left-0 text-[10px] font-bold text-red-500 uppercase tracking-widest bg-black/80 px-1.5 py-0.5 rounded border border-red-500/30">
                                    {finding}
                                </span>
                            </div>
                        )}
                    </div>
                    
                    <div className="absolute bottom-4 left-4 text-[10px] font-mono text-slate-600 z-10">
                        AURATRAL CLINICAL SCAN SIMULATOR v1.0 • WATERMARKED
                    </div>
                </div>

                <div className="w-full md:w-[320px] bg-slate-900 p-6 flex flex-col justify-between shrink-0">
                    <div>
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <span className="text-[10px] uppercase font-bold tracking-wider text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">PACS Viewer</span>
                                <h3 className="text-lg font-bold text-white mt-2">DICOM Visualizer</h3>
                            </div>
                            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-full transition-all">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="space-y-4 mb-8">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-800 pb-2">DICOM Header Tags</h4>
                            <div className="grid grid-cols-2 gap-y-2.5 gap-x-2 text-xs">
                                <span className="text-slate-500">Patient Age:</span>
                                <span className="text-slate-200 font-semibold font-mono">{row.patient_age || row.age || 'N/A'} yrs</span>
                                
                                <span className="text-slate-500">Patient Gender:</span>
                                <span className="text-slate-200 font-semibold font-mono">{row.gender || 'N/A'}</span>
                                
                                <span className="text-slate-500">Clinical Finding:</span>
                                <span className="text-indigo-400 font-bold">{finding}</span>

                                {row.lesion_diameter_mm !== undefined && (
                                    <>
                                        <span className="text-slate-500">Diameter:</span>
                                        <span className="text-slate-200 font-mono">{row.lesion_diameter_mm} mm</span>
                                    </>
                                )}

                                {row.confidence_score !== undefined && (
                                    <>
                                        <span className="text-slate-500">Confidence:</span>
                                        <span className="text-slate-200 font-mono">{(row.confidence_score * 100).toFixed(0)}%</span>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-800 pb-2 flex items-center gap-1.5">
                                <Sliders size={13} className="text-indigo-400" /> Controls
                            </h4>
                            
                            <div className="space-y-3">
                                <div>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-slate-400">Contrast</span>
                                        <span className="text-slate-500 font-mono">{contrast}%</span>
                                    </div>
                                    <input 
                                        type="range" min="50" max="150" value={contrast} 
                                        onChange={e => setContrast(Number(e.target.value))}
                                        className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" 
                                    />
                                </div>

                                <div>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-slate-400">Brightness</span>
                                        <span className="text-slate-500 font-mono">{brightness}%</span>
                                    </div>
                                    <input 
                                        type="range" min="50" max="150" value={brightness} 
                                        onChange={e => setBrightness(Number(e.target.value))}
                                        className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" 
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 pt-2 text-xs">
                                <label className="flex items-center gap-2 text-slate-300 cursor-pointer select-none">
                                    <input 
                                        type="checkbox" checked={invert} 
                                        onChange={e => setInvert(e.target.checked)}
                                        className="rounded border-slate-700 bg-slate-800 text-indigo-500 focus:ring-indigo-500" 
                                    />
                                    Invert Colors
                                </label>
                                
                                <label className="flex items-center gap-2 text-slate-300 cursor-pointer select-none">
                                    <input 
                                        type="checkbox" checked={showAnnotations} 
                                        onChange={e => setShowAnnotations(e.target.checked)}
                                        className="rounded border-slate-700 bg-slate-800 text-indigo-500 focus:ring-indigo-500" 
                                    />
                                    Overlay Annotations
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-800 mt-6 flex flex-col gap-2">
                        <button 
                            onClick={() => {
                                const blob = new Blob(["Simulated DICOM image data headers"], { type: "application/dicom" });
                                const link = document.createElement("a");
                                link.href = URL.createObjectURL(blob);
                                link.download = `${imageId}_dicom.dcm`;
                                link.click();
                            }}
                            className="w-full btn btn-primary text-xs py-2"
                        >
                            Download Raw DICOM file (.dcm)
                        </button>
                        <button 
                            onClick={() => {
                                const svgElement = document.querySelector('.bg-black svg');
                                if (svgElement) {
                                    const svgString = new XMLSerializer().serializeToString(svgElement);
                                    const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
                                    const link = document.createElement("a");
                                    link.href = URL.createObjectURL(svgBlob);
                                    link.download = `${imageId}_preview.svg`;
                                    link.click();
                                }
                            }}
                            className="w-full btn btn-outline text-xs py-2"
                        >
                            Download JPEG Preview (.svg)
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const CellValue = ({ val, colName, row, category, handleOpenViewer }) => {
    if (val === null || val === undefined) return <span className="text-slate-600 italic text-xs">null</span>;
    if (val === 'true') return <span className="text-green-400 font-semibold text-xs">true</span>;
    if (val === 'false') return <span className="text-slate-400 text-xs">false</span>;
    
    if (colName === 'image_id' && category === 'Imaging') {
        return (
            <button 
                onClick={() => handleOpenViewer(row)}
                className="flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 font-mono text-xs font-semibold bg-indigo-500/10 hover:bg-indigo-500/20 px-2.5 py-1 rounded transition-all border border-indigo-500/20 active:scale-95 shrink-0"
            >
                <Eye size={12} /> {String(val)}
            </button>
        );
    }
    
    return <span className="text-slate-200 text-xs font-mono">{String(val)}</span>;
};

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════ */
const DatasetDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [viewerOpen, setViewerOpen] = useState(false);
    const [viewerRow, setViewerRow] = useState(null);

    const handleOpenViewer = (row) => {
        setViewerRow(row);
        setViewerOpen(true);
    };

    // Instant local lookup — no Firestore round-trip, no loading spinner
    const datasetData = FULL_REGISTRY[id]
        || Object.values(FULL_REGISTRY).find(d => d.id?.toLowerCase() === id?.toLowerCase())
        || FULL_REGISTRY[FALLBACK_ID];

    const handleProtectedAction = (e, path) => {
        e.preventDefault();
        if (!user) navigate('/login');
        else if (path) navigate(path, { state: { datasetId: datasetData?.id } });
        else alert('This action requires a simulated backend response.');
    };




    if (!datasetData) {
        return (
            <div className="pt-32 pb-24 min-h-screen flex items-center justify-center font-sans">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-400 mb-4">Dataset Not Found</h2>
                    <Link to="/gallery" className="btn btn-outline">Return to Gallery</Link>
                </div>
            </div>
        );
    }

    // Map database flat schema to details fields expected by the render code
    const cols = datasetData.columns || [];
    const dataset = datasetData.meta ? datasetData.meta : {
        name: datasetData.name || 'Untitled Dataset',
        source: datasetData.source || 'Multi-site Clinical Study Network',
        category: datasetData.category || 'EHR',
        subCategory: datasetData.subCategory || 'Clinical',
        rating: datasetData.rating || 4.8,
        reviews: datasetData.reviews || 12,
        records: datasetData.records || '50',
        variables: cols.length,
        formats: datasetData.formats || ['CSV'],
        compliance: datasetData.compliance || ['De-identified'],
        updateFrequency: datasetData.updateFrequency || 'Quarterly Refreshed',
        price: datasetData.price || 15000,
        doi: datasetData.doi || '',
        temporalCoverage: datasetData.temporalCoverage || '2020 – 2025',
        completenessScore: datasetData.completenessScore || 98.5,
        qualityScore: datasetData.qualityScore || 92,
        description: datasetData.description || ''
    };

    const defaultCohort = datasetData.defaultCohort ? datasetData.defaultCohort : {
        records: dataset.records,
        gender: 'Balanced — 50% Male / 50% Female',
        ageRange: '18 – 85 years',
        region: 'Pan-India Cohort',
        timePeriod: dataset.temporalCoverage,
        conditions: `All ${dataset.subCategory || 'relevant'} patient admission types`,
        exclusions: 'PII, incomplete records',
        format: dataset.formats && dataset.formats.length > 0 ? dataset.formats[0] : 'CSV'
    };

    const MOCK_COLUMNS = cols;
    const SAMPLE_ROWS = datasetData.rows || datasetData.recordsData || [];

    const [activeTab, setActiveTab] = useState('overview');

    const tabs = [
        { id: 'overview', label: 'Overview', icon: Info },
        { id: 'cohort', label: 'Default Cohort', icon: Users },
        { id: 'sample', label: 'Data Sample', icon: Eye },
        { id: 'columns', label: 'Column Details', icon: Table },
        { id: 'delivery', label: 'Workspace Specs', icon: Box },
    ];

    const totalNulls = MOCK_COLUMNS.reduce((s, c) => s + (c.nulls || 0), 0);
    const histColors = { Float32: '#6366f1', Int32: '#8b5cf6', DateTime: '#06b6d4', Boolean: '#10b981', String: '#f59e0b' };

    return (
        <div className="pt-32 pb-16 min-h-screen">

            {/* ── Header ── */}
            <div className="bg-slate-800/50 border-b border-glass-border pt-6 pb-12 mb-8">
                <div className="container mx-auto px-8">
                    <Link to="/gallery" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-blue-400 mb-6 transition-colors">
                        <ArrowLeft size={16} /> Back to Gallery
                    </Link>

                    <div className="flex flex-col lg:flex-row gap-8 justify-between items-start">
                        <div className="max-w-3xl">
                            <div className="flex gap-2 mb-4">
                                <span className="text-xs font-semibold px-2 py-1 rounded bg-slate-800 text-blue-400 border border-slate-700">{dataset.category}</span>
                                <span className="text-xs px-2 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">{dataset.subCategory}</span>
                                <span className="text-xs px-2 py-1 rounded bg-slate-900 text-slate-500 border border-slate-700 font-mono">{id}</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4 leading-tight">{dataset.name}</h1>
                            <div className="flex items-center gap-4 text-sm text-slate-300 mb-6">
                                <div className="flex items-center gap-1 text-yellow-500">
                                    <Star size={16} fill="currentColor" />
                                    <span className="font-bold text-primary">{dataset.rating}</span>
                                    <span className="text-slate-500">({dataset.reviews} verified reviews)</span>
                                </div>
                                <div className="w-1 h-1 rounded-full bg-slate-600" />
                                <div className="flex items-center gap-2 text-slate-400">
                                    <ShieldCheck size={16} className="text-blue-500" /> Auratral Compliance Verified
                                </div>
                            </div>
                            <p className="text-secondary leading-relaxed whitespace-pre-line">{dataset.description}</p>
                        </div>

                        {/* Pricing panel */}
                        <div className="glass-panel p-6 w-full lg:w-80 shrink-0 lg:-mt-4 lg:sticky lg:top-32 border-purple-500/20 font-sans">
                            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">Annual Workspace License</div>
                            <div className="flex items-baseline gap-2 mb-1">
                                <span className="text-3xl font-bold text-primary">
                                    {typeof dataset.price === 'number' ? `${dataset.price.toLocaleString()} Credits` : dataset.price}
                                </span>
                                {typeof dataset.price === 'number' && <span className="text-slate-500 text-sm">/ year</span>}
                            </div>
                            {defaultCohort && (
                                <p className="text-xs text-slate-500 mb-4">Workspace slice: {defaultCohort.records} records · {datasetData.computeCreditRate} credits/min runtime</p>
                            )}
                            <button onClick={(e) => handleProtectedAction(e, '/customize')} className="w-full btn btn-primary py-3 justify-center mb-3 cursor-pointer text-center block font-semibold">
                                Configure & Launch IDE
                            </button>
                            <button onClick={(e) => handleProtectedAction(e, null)} className="w-full btn btn-outline py-2 text-sm justify-center mb-6 cursor-pointer text-center block">
                                Request Trial Sandbox
                            </button>
                            <div className="space-y-3 pt-4 border-t border-glass-border text-sm text-slate-300">
                                <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-blue-400" /> {dataset.records} Patient Records</div>
                                <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-purple-400" /> {datasetData.computeCreditRate} Credits / min runtime</div>
                                <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-indigo-400" /> Preloaded: {dataset.formats.join(', ')}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Tab bar ── */}
            <div className="container mx-auto px-8 mb-8">
                <div className="flex gap-1 overflow-x-auto border-b border-slate-800 pb-0">
                    {tabs.map(({ id: tid, label, icon: Icon }) => (
                        <button key={tid} onClick={() => setActiveTab(tid)}
                            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === tid ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}>
                            <Icon size={15} />{label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Tab panels ── */}
            <div className="container mx-auto px-8">

                {/* OVERVIEW */}
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 glass-panel p-8">
                            <h2 className="text-2xl font-bold text-primary mb-6 border-b border-glass-border pb-4">Dataset Metadata</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                                {[
                                    ['Data Source', dataset.source],
                                    ['Temporal Coverage', dataset.temporalCoverage],
                                    ['Update Frequency', dataset.updateFrequency],
                                    ['De-identification', dataset.compliance[0]],
                                    ['Variables', `${dataset.variables} columns`],
                                    ['DOI', dataset.doi],
                                    ['Auratral Quality Score', `${dataset.qualityScore} / 100`],
                                ].map(([label, val]) => (
                                    <div key={label}>
                                        <div className="text-xs text-slate-500 mb-1">{label}</div>
                                        <div className={`text-sm font-medium ${label === 'Auratral Quality Score' ? 'text-blue-400 text-lg font-bold' : label === 'DOI' ? 'text-indigo-400 font-mono text-xs hover:underline cursor-pointer' : 'text-primary'}`}>{val}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="glass-panel p-8">
                            <h2 className="text-xl font-bold text-primary mb-6 border-b border-glass-border pb-4">Data Quality</h2>
                            <div className="mb-6">
                                <div className="flex justify-between text-xs text-slate-400 mb-2"><span>Completeness</span><span className="text-green-400 font-semibold">{dataset.completenessScore}%</span></div>
                                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-indigo-500 to-green-400 rounded-full" style={{ width: `${dataset.completenessScore}%` }} />
                                </div>
                            </div>
                            <ul className="space-y-3 text-sm text-slate-300">
                                {['Duplicate detection', 'Date & temporal validation', 'Value range checks', 'Outlier flagging', 'Cross-site harmonisation'].map(item => (
                                    <li key={item} className="flex items-start gap-2"><CheckCircle2 size={15} className="text-green-400 shrink-0 mt-0.5" />{item}</li>
                                ))}
                            </ul>
                            <div className="mt-6 pt-4 border-t border-glass-border">
                                <div className="text-xs text-slate-500 mb-1">Total null values (all columns)</div>
                                <div className="text-lg font-bold text-primary font-mono">{totalNulls.toLocaleString()}</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* DEFAULT COHORT */}
                {activeTab === 'cohort' && defaultCohort && (
                    <div className="space-y-6">
                        <div className="glass-panel p-6 border-l-4 border-l-indigo-500 flex flex-col md:flex-row md:items-center gap-4 justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-primary mb-1">Default Cohort</h2>
                                <p className="text-sm text-slate-400">This is exactly what you get at the base price — all demographic parameters pre-set to maximise representativeness. No customisation required.</p>
                            </div>
                            {typeof dataset.price === 'number' && (
                                <div className="shrink-0 flex items-center gap-3 bg-indigo-500/10 border border-indigo-500/30 rounded-xl px-4 py-3">
                                    <span className="text-2xl">✅</span>
                                    <div>
                                        <div className="text-xs text-slate-400">Included in base price</div>
                                        <div className="font-bold text-indigo-400">₹{dataset.price.toLocaleString()}</div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="glass-panel p-8">
                            <h3 className="text-lg font-bold text-primary mb-6 border-b border-glass-border pb-3">Cohort Parameters</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {[
                                    { label: 'Total Records', value: defaultCohort.records, icon: '📦' },
                                    { label: 'Gender Distribution', value: defaultCohort.gender, icon: '⚖️' },
                                    { label: 'Age Range', value: defaultCohort.ageRange, icon: '🎂' },
                                    { label: 'Geographic Scope', value: defaultCohort.region, icon: '🗺️' },
                                    { label: 'Temporal Coverage', value: defaultCohort.timePeriod, icon: '📅' },
                                    { label: 'Conditions / Scope', value: defaultCohort.conditions, icon: '🔬' },
                                    { label: 'Exclusion Criteria', value: defaultCohort.exclusions, icon: '🚫' },
                                    { label: 'Default Format', value: defaultCohort.format, icon: '📄' },
                                ].map(({ label, value, icon }) => (
                                    <div key={label} className="flex items-start gap-4 p-4 bg-slate-800/40 rounded-xl border border-slate-700/40 hover:border-indigo-500/30 transition-colors">
                                        <span className="text-2xl shrink-0">{icon}</span>
                                        <div>
                                            <div className="text-xs text-slate-500 mb-1 font-medium uppercase tracking-wide">{label}</div>
                                            <div className="text-sm text-slate-200 font-medium">{value}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="glass-panel p-6 bg-gradient-to-r from-violet-900/20 to-indigo-900/20 border border-indigo-500/20">
                            <div className="flex flex-col md:flex-row items-start md:items-center gap-5 justify-between">
                                <div>
                                    <h3 className="font-bold text-primary mb-1">Need a custom cohort?</h3>
                                    <p className="text-sm text-slate-400">Filter by age band, diagnosis codes, specific gender, districts, or date range. Available as a paid add-on at checkout.</p>
                                </div>
                                <div className="flex gap-3 shrink-0">
                                    <Link to="/custom-request" className="btn btn-outline text-sm py-2 px-5">Custom Request</Link>
                                    <button onClick={(e) => handleProtectedAction(e, '/customize')} className="btn btn-primary text-sm py-2 px-5">Configure Cohort</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* DATA SAMPLE */}
                {activeTab === 'sample' && (
                    <div className="glass-panel p-8">
                        {/* Compute to Data sandbox preview banner */}
                        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-6 flex items-start gap-4">
                            <Info className="text-amber-500 shrink-0 mt-0.5" size={20} />
                            <div>
                                <h4 className="font-bold text-amber-400 text-sm">Sandbox Configuration Sample</h4>
                                <p className="text-xs text-amber-200/80 mt-1">This table shows a 5-row dummy/synthesized sample to help you inspect variables and configure your script syntax. The actual patient database is hosted inside isolated compute nodes and is never exposed or downloadable.</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between mb-6 border-b border-glass-border pb-4">
                            <div>
                                <h2 className="text-2xl font-bold text-primary">Data Sample</h2>
                                <p className="text-sm text-slate-400 mt-1">Showing 5 of {dataset.records} de-identified records · {MOCK_COLUMNS.length} columns</p>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-800/60 border border-slate-700 px-3 py-2 rounded-lg">
                                <Database size={13} className="text-indigo-400" /> All PII removed per {dataset.compliance[0]}
                            </div>
                        </div>
                        <div className="overflow-x-auto rounded-xl border border-slate-700/60">
                            <table className="w-full text-sm min-w-max">
                                <thead>
                                    <tr className="bg-slate-800/80 border-b border-slate-700">
                                        {MOCK_COLUMNS.map(col => (
                                            <th key={col.name} className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide whitespace-nowrap">
                                                <div>{col.name}</div>
                                                <div className="font-normal normal-case text-slate-600 text-[10px]">{col.dtype}</div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {SAMPLE_ROWS.map((row, ri) => (
                                        <tr key={ri} className={`border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors ${ri % 2 === 0 ? '' : 'bg-slate-900/20'}`}>
                                            {MOCK_COLUMNS.map(col => (
                                                <td key={col.name} className="px-4 py-3 whitespace-nowrap">
                                                    <CellValue val={row[col.name]} colName={col.name} row={row} category={dataset.category} handleOpenViewer={handleOpenViewer} />
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* COLUMN DETAILS */}
                {activeTab === 'columns' && (
                    <div className="glass-panel p-8">
                        <h2 className="text-2xl font-bold text-primary mb-6 border-b border-glass-border pb-4">Column Details <span className="text-base font-normal text-slate-400 ml-2">{MOCK_COLUMNS.length} columns</span></h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {MOCK_COLUMNS.map(col => {
                                const barColor = histColors[col.dtype] || '#6366f1';
                                return (
                                    <div key={col.name} className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-5 space-y-3 hover:border-slate-600 transition-colors">
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <span className="font-mono font-bold text-primary">{col.name}</span>
                                                <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-slate-700 text-slate-400">{col.dtype}</span>
                                            </div>
                                            {col.nulls > 0
                                                ? <span className="text-[10px] bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 px-2 py-1 rounded-lg whitespace-nowrap">{col.nulls.toLocaleString()} nulls</span>
                                                : <span className="text-[10px] bg-green-500/10 border border-green-500/30 text-green-400 px-2 py-1 rounded-lg whitespace-nowrap">No nulls</span>
                                            }
                                        </div>
                                        <p className="text-xs text-slate-400 leading-relaxed">{col.description}</p>
                                        <div className="grid grid-cols-2 gap-2 text-[11px]">
                                            {col.units !== '—' && (
                                                <div className="bg-slate-800/60 rounded-lg px-3 py-2">
                                                    <div className="text-slate-500 mb-0.5">Units</div>
                                                    <div className="text-slate-200 font-medium">{col.units}</div>
                                                </div>
                                            )}
                                            <div className="bg-slate-800/60 rounded-lg px-3 py-2">
                                                <div className="text-slate-500 mb-0.5">Example</div>
                                                <div className="text-slate-200 font-mono truncate">{col.example}</div>
                                            </div>
                                        </div>
                                        {col.histogram && (
                                            <div>
                                                <div className="text-[10px] text-slate-500 mb-1 flex items-center gap-1"><BarChart2 size={11} /> Distribution</div>
                                                <MiniHistogram values={col.histogram} color={barColor} />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* DELIVERY */}
                {activeTab === 'delivery' && (
                    <div className="glass-panel p-8 font-sans">
                        <h2 className="text-2xl font-bold text-primary mb-6 border-b border-glass-border pb-4">Workspace Environment Specifications</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl flex flex-col items-center text-center hover:border-purple-500/50 transition-colors">
                                <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center text-slate-300 mb-4 border border-slate-700 shadow-lg"><Code2 size={24} className="text-purple-400" /></div>
                                <h3 className="font-bold text-primary mb-2">Pre-installed Runtimes</h3>
                                <p className="text-xs text-slate-400 mb-4">Pre-configured Python 3.10 and R kernels with standard clinical analysis packages.</p>
                                <div className="flex flex-wrap justify-center gap-1 mt-auto">
                                    {['Pandas', 'NumPy', 'Scikit-Learn', 'PyDICOM', 'BioPython', 'SciPy'].map(f => (
                                        <span key={f} className="text-[10px] bg-slate-800 border border-slate-600 px-1.5 py-0.5 rounded text-slate-300">{f}</span>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl flex flex-col items-center text-center hover:border-purple-500/50 transition-colors">
                                <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center text-slate-300 mb-4 border border-slate-700 shadow-lg"><Box size={24} className="text-blue-400" /></div>
                                <h3 className="font-bold text-primary mb-2">Isolated Sandbox Node</h3>
                                <p className="text-xs text-slate-400 mb-4">Docker-based isolated container with dedicated virtual CPUs and secure RAM allocations.</p>
                                <div className="flex flex-wrap justify-center gap-1 mt-auto">
                                    <span className="text-[10px] bg-slate-800 border border-blue-500/30 px-1.5 py-0.5 rounded text-blue-400 font-semibold">4 vCPUs</span>
                                    <span className="text-[10px] bg-slate-800 border border-blue-500/30 px-1.5 py-0.5 rounded text-blue-400 font-semibold">16 GB RAM</span>
                                    <span className="text-[10px] bg-slate-800 border border-blue-500/30 px-1.5 py-0.5 rounded text-blue-400 font-semibold">10GB SSD</span>
                                </div>
                            </div>
                            <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl flex flex-col items-center text-center hover:border-purple-500/50 transition-colors">
                                <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center text-slate-300 mb-4 border border-slate-700 shadow-lg"><Activity size={24} className="text-pink-400" /></div>
                                <h3 className="font-bold text-primary mb-2">High-Performance Clusters</h3>
                                <p className="text-xs text-slate-400">GPU-accelerated runtimes for deep learning (Imaging) or TPU clusters for genomics pipelines.</p>
                                <div className="mt-auto pt-4 text-[10px] font-bold text-purple-400 uppercase tracking-widest">Enterprise Tier</div>
                            </div>
                        </div>
                    </div>
                )}

                <DicomViewerModal 
                    isOpen={viewerOpen} 
                    onClose={() => { setViewerOpen(false); setViewerRow(null); }} 
                    row={viewerRow} 
                    category={dataset.category} 
                />
            </div>
        </div>
    );
};

export default DatasetDetail;
