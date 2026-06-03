import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Database, Key, CreditCard, Activity, ArrowRight, Download, Settings, FileText, File, X, Plus, Check, AlertCircle, Eye, Sliders } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { DATASET_REGISTRY as fallbackRegistry } from '../data/datasetsRegistry';

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

const Dashboard = () => {
    const navigate = useNavigate();
    const { user: authUser } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');
    const [manageModalOpen, setManageModalOpen] = useState(false);
    const [managingDataset, setManagingDataset] = useState(null);
    const [addonState, setAddonState] = useState({});
    const [notifications, setNotifications] = useState([]);
    const [showAllDatasets, setShowAllDatasets] = useState(false);
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const [detailsDataset, setDetailsDataset] = useState(null);
    const [extensionMonths, setExtensionMonths] = useState(1);
    const [showCitation, setShowCitation] = useState(false);
    const [citationFormat, setCitationFormat] = useState('IEEE');
    const [viewerOpen, setViewerOpen] = useState(false);
    const [viewerRow, setViewerRow] = useState(null);

    const handleOpenViewer = (row) => {
        setViewerRow(row);
        setViewerOpen(true);
    };

    const generateCitation = (format, dataset) => {
        const year = new Date().getFullYear();
        switch(format) {
            case 'IEEE': return `Auratral Data Systems, "${dataset.name}," Auratral Research Repository, ${year}. [Online]. Available: https://doi.org/${dataset.doi}`;
            case 'APA': return `Auratral Data Systems. (${year}). ${dataset.name} [Data set]. Auratral Research Repository. https://doi.org/${dataset.doi}`;
            case 'MLA': return `Auratral Data Systems. "${dataset.name}." Auratral Research Repository, ${year}, https://doi.org/${dataset.doi}.`;
            case 'Harvard': return `Auratral Data Systems (${year}) '${dataset.name}', Auratral Research Repository. Available at: https://doi.org/${dataset.doi}.`;
            default: return '';
        }
    };

    const getAccessAction = (access) => {
        if (!access) return { label: 'Request Access', desc: 'access request' };
        if (access === 'API Streaming') return { label: 'Regenerate Keys', desc: 'API key regeneration' };
        if (access === 'Docker Env') return { label: 'Re-deliver Image', desc: 'Docker container re-delivery' };
        if (access === 'Download') return { label: 'Re-download Files', desc: 'secure file download' };
        if (access === 'API & Download') return { label: 'Re-download Files', desc: 'secure file download & API access' };
        return { label: 'Re-deliver Access', desc: 'data re-provisioning' };
    };

    // User data derived from AuthContext or fallback
    const user = {
        name: authUser?.name || 'Jane Doe',
        institution: authUser?.institution || 'Global Health Institute',
        plan: authUser?.role === 'provider' ? 'Data Provider' : 'Academic Research',
        credits: 12500
    };

    const [purchases, setPurchases] = useState([]);
    const [loadingPurchases, setLoadingPurchases] = useState(true);
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        const fetchPurchases = async () => {
            if (!authUser) return;
            try {
                const q = query(collection(db, 'purchases'), where('userId', '==', authUser.uid));
                const snapshot = await getDocs(q);
                const fetched = [];
                snapshot.forEach(docSnap => {
                    const data = docSnap.data();
                    fetched.push({
                        id: data.datasetId,
                        name: data.datasetName,
                        category: data.category,
                        access: `API & ${data.format} Download`,
                        status: data.status || 'Active',
                        expiry: new Date(new Date(data.purchaseDate).setFullYear(new Date(data.purchaseDate).getFullYear() + 1)).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                        license: data.license || 'Academic Research License',
                        doi: data.doi,
                        purchaseDate: data.purchaseDate,
                        selectedFormat: data.format,
                        recordsCount: data.recordsCount || 50
                    });
                });
                fetched.sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate));
                setPurchases(fetched);
            } catch (err) {
                console.error("Error fetching purchases: ", err);
            } finally {
                setLoadingPurchases(false);
            }
        };
        fetchPurchases();
    }, [authUser]);

    const handleDownload = async (datasetId, format, datasetName) => {
        setDownloading(true);
        try {
            const docRef = doc(db, 'datasets', datasetId);
            const docSnap = await getDoc(docRef);
            let records = [];
            let columns = [];
            
            if (docSnap.exists()) {
                const data = docSnap.data();
                records = data.recordsData || [];
                columns = data.columns || [];
            } else {
                const localData = fallbackRegistry[datasetId];
                if (localData) {
                    records = localData.recordsData || [];
                    columns = localData.columns || [];
                }
            }

            if (records.length === 0) {
                alert("Could not load data records for download.");
                return;
            }

            let fileContent = '';
            let mimeType = 'text/plain';
            let fileExtension = 'txt';

            const cleanVal = (v) => {
                if (v === null || v === undefined) return '';
                return String(v).replace(/"/g, '""');
            };

            const selectedFmt = format.toUpperCase();

            if (selectedFmt === 'CSV') {
                const headers = columns.map(c => c.name);
                const csvRows = [headers.join(',')];
                
                records.forEach(row => {
                    const values = headers.map(header => {
                        const val = row[header];
                        return `"${cleanVal(val)}"`;
                    });
                    csvRows.push(values.join(','));
                });
                
                fileContent = csvRows.join('\n');
                mimeType = 'text/csv;charset=utf-8;';
                fileExtension = 'csv';
            } 
            else if (selectedFmt === 'JSON') {
                fileContent = JSON.stringify(records, null, 2);
                mimeType = 'application/json;charset=utf-8;';
                fileExtension = 'json';
            } 
            else if (selectedFmt === 'SQL') {
                const tableName = datasetName.toLowerCase().replace(/[^a-z0-9]/g, '_');
                const headers = columns.map(c => c.name);
                const sqlStatements = [
                    `-- Auratral Dynamic SQL Export`,
                    `-- Dataset: ${datasetName}`,
                    `-- Generated on ${new Date().toISOString()}`,
                    `CREATE TABLE ${tableName} (`,
                    columns.map(c => `  ${c.name} ${c.dtype === 'Int32' ? 'INTEGER' : c.dtype === 'Float32' ? 'NUMERIC' : c.dtype === 'Boolean' ? 'BOOLEAN' : 'VARCHAR(255)'}`).join(',\n'),
                    `);\n`
                ];

                records.forEach(row => {
                    const values = headers.map(header => {
                        const val = row[header];
                        if (val === null || val === undefined) return 'NULL';
                        if (typeof val === 'boolean' || val === 'true' || val === 'false') return String(val).toLowerCase();
                        if (typeof val === 'number') return val;
                        return `'${cleanVal(val)}'`;
                    });
                    sqlStatements.push(`INSERT INTO ${tableName} (${headers.join(', ')}) VALUES (${values.join(', ')});`);
                });

                fileContent = sqlStatements.join('\n');
                mimeType = 'application/sql;charset=utf-8;';
                fileExtension = 'sql';
            } 
            else if (selectedFmt === 'FHIR R4') {
                const fhirBundle = {
                    resourceType: "Bundle",
                    type: "transaction",
                    entry: []
                };

                records.forEach((row, rIdx) => {
                    const pId = row.patient_id || row.subject_id || row.maternal_id || row.respondent_id || `patient-${rIdx}`;
                    const patientResource = {
                        resource: {
                            resourceType: "Patient",
                            id: pId,
                            gender: row.gender ? row.gender.toLowerCase() : "unknown",
                            birthDate: row.age ? new Date(new Date().getFullYear() - row.age, 0, 1).toISOString().split('T')[0] : undefined
                        },
                        request: {
                            method: "POST",
                            url: "Patient"
                        }
                    };
                    fhirBundle.entry.push(patientResource);

                    Object.keys(row).forEach(key => {
                        if (!['patient_id', 'subject_id', 'maternal_id', 'respondent_id', 'gender', 'age'].includes(key) && row[key] !== null) {
                            const observationResource = {
                                resource: {
                                    resourceType: "Observation",
                                    status: "final",
                                    code: {
                                        coding: [{
                                            system: "http://loinc.org",
                                            code: `aur-${key}`,
                                            display: key.replace(/_/g, ' ')
                                        }]
                                    },
                                    subject: {
                                        reference: `Patient/${pId}`
                                    },
                                    valueString: typeof row[key] === 'string' ? row[key] : undefined,
                                    valueQuantity: typeof row[key] === 'number' ? {
                                        value: row[key],
                                        unit: columns.find(c => c.name === key)?.units || ''
                                    } : undefined,
                                    valueBoolean: typeof row[key] === 'boolean' ? row[key] : undefined
                                },
                                request: {
                                    method: "POST",
                                    url: "Observation"
                                }
                            };
                            fhirBundle.entry.push(observationResource);
                        }
                    });
                });

                fileContent = JSON.stringify(fhirBundle, null, 2);
                mimeType = 'application/fhir+json;charset=utf-8;';
                fileExtension = 'fhir.json';
            } 
            else if (selectedFmt === 'VCF') {
                const vcfLines = [
                    '##fileformat=VCFv4.2',
                    `##fileDate=${new Date().toISOString().split('T')[0]}`,
                    '##source=AuratralGenomicsExporter',
                    '##reference=GRCh38',
                    '##INFO=<ID=AF,Number=A,Type=Float,Description="Allele Frequency">',
                    '##INFO=<ID=SIG,Number=1,Type=String,Description="Clinical Significance">',
                    '#CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO'
                ];

                records.forEach(row => {
                    const chrom = row.chromosome || '1';
                    const pos = row.position || '100000';
                    const variantId = row.variant_id || 'rs0000';
                    const ref = row.ref_allele || 'N';
                    const alt = row.alt_allele || 'N';
                    const af = row.allele_frequency !== undefined ? row.allele_frequency : '0.0';
                    const sig = row.clinical_significance || 'Unknown';
                    vcfLines.push(`${chrom}\t${pos}\t${variantId}\t${ref}\t${alt}\t100\tPASS\tAF=${af};SIG=${sig}`);
                });

                fileContent = vcfLines.join('\n');
                mimeType = 'text/vcard;charset=utf-8;';
                fileExtension = 'vcf';
            }
            else {
                const headers = Object.keys(records[0]);
                const csvRows = [headers.join(',')];
                records.forEach(row => {
                    csvRows.push(headers.map(h => `"${cleanVal(row[h])}"`).join(','));
                });
                fileContent = csvRows.join('\n');
                mimeType = 'text/csv;charset=utf-8;';
                fileExtension = 'csv';
            }

            const blob = new Blob([fileContent], { type: mimeType });
            const link = document.createElement("a");
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            const safeName = datasetName.toLowerCase().replace(/[^a-z0-9]/g, '_');
            link.setAttribute("download", `${safeName}_50_records.${fileExtension}`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            console.error("Error generating file download: ", err);
            alert("Failed to generate file download.");
        } finally {
            setDownloading(false);
        }
    };

    const activeDatasets = purchases;

    const recentActivity = [
        { action: 'API Key Generated', time: '2 hours ago', detail: 'Production Key - Read Only' },
        { action: 'Dataset Downloaded', time: 'Yesterday', detail: 'AUR-EHR-00087 Subset (JSON)' },
        { action: 'Subscription Renewed', time: 'Oct 1, 2026', detail: 'Academic Research Tier' }
    ];

    const ADDONS = [
        { id: 'format', name: 'Format Conversion', desc: 'Receive an additional file format beyond your base (e.g., FHIR R4 on top of CSV)', price: '+₹14,000/yr' },
        { id: 'longitudinal', name: 'Longitudinal Extension', desc: 'Extend the temporal coverage window of your dataset beyond the base period', price: '+₹9,999/dataset' },
        { id: 'api', name: 'API Access Pack', desc: 'Live REST endpoint + FHIR streaming to query data programmatically without downloading files', price: '+₹14,999 one-time' },
        { id: 'docker', name: 'Docker Bundle', desc: 'Dataset pre-loaded in a PostgreSQL DB + Jupyter notebook environment — zero setup required', price: '+₹18,000/refresh' },
        { id: 'priority', name: 'Priority Refresh', desc: 'Receive updated data ahead of the standard release cycle — critical for active pharmacovigilance', price: '+₹12,000 one-time' },
        { id: 'irb', name: 'IRB Pack', desc: 'Formally executed IRB-compatible Data Use Agreement, delivered within 5 business days', price: '+₹5,000 one-time' },
        { id: 'consult', name: 'Expert Consult', desc: '1-on-1 advisory hour with clinical data science experts to review your methodology', price: '+₹7,500/hr' },
    ];

    const handleRequestAddon = (addon) => {
        setAddonState(prev => ({ ...prev, [addon.id]: 'requested' }));
        setTimeout(() => {
            setAddonState(prev => ({ ...prev, [addon.id]: 'authorized' }));
            setNotifications(prev => [
                ...prev,
                { id: Date.now() + Math.random(), title: 'Request Authorized - Payment Pending', message: `Your request for ${addon.name} has been approved. Please complete payment to provision.`, addonId: addon.id, addon: addon }
            ]);
        }, 3000); // 3 seconds to simulate authorization
    };

    const handlePayAddon = (addon) => {
        setAddonState(prev => ({ ...prev, [addon.id]: 'paid' }));
        setNotifications(prev => prev.filter(n => n.addonId !== addon.id));
        alert(`Payment successful! ${addon.name} is now provisioning.`);
    };

    return (
        <div className="pt-32 pb-16 min-h-screen">
            <div className="container mx-auto px-8 max-w-7xl">

                {/* Notifications Panel */}
                {notifications.length > 0 && (
                    <div className="mb-8 space-y-3">
                        {notifications.map(notif => (
                            <div key={notif.id} className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="text-amber-500 mt-0.5 shrink-0" size={20} />
                                    <div>
                                        <h4 className="font-bold text-amber-500">{notif.title}</h4>
                                        <p className="text-sm text-amber-200 mt-1">{notif.message}</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => handlePayAddon(notif.addon)}
                                    className="btn bg-amber-500 hover:bg-amber-600 text-slate-900 border-none font-bold py-2 whitespace-nowrap shadow-lg shadow-amber-500/20 shrink-0"
                                >
                                    Pay {notif.addon.price.split(' ')[0].split('/')[0]}
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Dashboard Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                    <div>
                        <h1 className="text-3xl font-bold text-primary mb-2">Welcome back, {user.name}</h1>
                        <p className="text-secondary flex items-center gap-2">
                            <span>{user.institution}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                            <span className="text-blue-400">{user.plan}</span>
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <Link to="/gallery" className="btn btn-outline py-2.5 px-6 flex items-center gap-2">
                            Browse Datasets
                        </Link>
                        <Link to="/custom-request" className="btn btn-primary py-2.5 px-6 flex items-center gap-2">
                            New Request <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex gap-2 mb-8 border-b border-slate-800 pb-px">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`px-6 py-3 text-sm font-semibold transition-all flex items-center gap-2 ${activeTab === 'overview' ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-500/5' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                        <Activity size={16} /> Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('docs')}
                        className={`px-6 py-3 text-sm font-semibold transition-all flex items-center gap-2 ${activeTab === 'docs' ? 'text-orange-400 border-b-2 border-orange-400 bg-orange-500/5' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                        <FileText size={16} /> My Documents
                    </button>
                </div>

                {/* Main Content Area */}
                {activeTab === 'overview' ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <div className="glass-panel p-6 border-t-2 border-t-purple-500">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Active Cohorts</h3>
                                    <Database size={20} className="text-purple-400" />
                                </div>
                                <div className="text-3xl font-bold text-primary mb-1">{activeDatasets.length}</div>
                                <div className="text-xs text-blue-400 flex items-center gap-1">
                                    <Activity size={12} /> Syncing live updates
                                </div>
                            </div>

                            <div className="glass-panel p-6 border-t-2 border-t-blue-500">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">API Requests</h3>
                                    <Activity size={20} className="text-blue-400" />
                                </div>
                                <div className="text-3xl font-bold text-primary mb-1">{activeDatasets.length > 0 ? "12.4k" : "0"}</div>
                                <div className="text-xs text-slate-500">Last 30 days</div>
                            </div>

                            <div className="glass-panel p-6 border-t-2 border-t-indigo-500">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Storage Used</h3>
                                    <Download size={20} className="text-indigo-400" />
                                </div>
                                <div className="text-3xl font-bold text-primary mb-1">{activeDatasets.length > 0 ? `${(activeDatasets.length * 0.05).toFixed(2)} MB` : "0 KB"}</div>
                                <div className="text-xs text-slate-500">of 100 GB (Academic Plan)</div>
                            </div>

                            <div className="glass-panel p-6 border-t-2 border-t-pink-500">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Compute Credits</h3>
                                    <CreditCard size={20} className="text-pink-400" />
                                </div>
                                <div className="text-3xl font-bold text-primary mb-1">{user.credits.toLocaleString()}</div>
                                <div className="text-xs text-slate-500">Available for Cloud Docker env</div>
                            </div>
                        </div>

                        {/* Main Content Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                            {/* Left Column: Datasets & API */}
                            <div className="lg:col-span-2 space-y-8">

                                {/* Provisioned Datasets */}
                                <div className="glass-panel p-8">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                                            <Database size={20} className="text-purple-400" /> Provisioned Datasets
                                        </h2>
                                    </div>

                                    <div className="space-y-4">
                                        {loadingPurchases ? (
                                            <div className="text-center py-12">
                                                <div className="inline-flex w-10 h-10 rounded-full border-2 border-purple-500/30 border-t-purple-500 animate-spin mb-2"></div>
                                                <p className="text-slate-400 text-xs">Syncing purchases registry...</p>
                                            </div>
                                        ) : activeDatasets.length === 0 ? (
                                            <div className="text-center py-12 border border-dashed border-slate-700/50 rounded-xl">
                                                <Database className="mx-auto text-slate-600 mb-3" size={40} />
                                                <p className="text-slate-400 text-sm mb-4">No active cohorts purchased yet.</p>
                                                <Link to="/gallery" className="btn btn-primary text-xs py-2.5 px-4 inline-flex items-center gap-2">
                                                    Browse Gallery <ArrowRight size={14} />
                                                </Link>
                                            </div>
                                        ) : (
                                            activeDatasets.map((ds, idx) => (
                                                <div key={idx} className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-purple-500/50 transition-colors group">
                                                    <div className="cursor-pointer" onClick={() => { setDetailsDataset(ds); setDetailsModalOpen(true); }}>
                                                        <div className="text-xs font-mono text-slate-400 mb-1 group-hover:text-purple-400 transition-colors">{ds.id}</div>
                                                        <h3 className="font-bold text-primary hover:underline decoration-purple-500/50 underline-offset-4">{ds.name}</h3>
                                                        <div className="text-sm text-slate-400 mt-1">Access: {ds.access}</div>
                                                    </div>
                                                    <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4">
                                                        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${ds.status === 'Active' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'}`}>
                                                            {ds.status}
                                                        </span>
                                                        <button 
                                                            onClick={() => { setManagingDataset(ds); setManageModalOpen(true); }}
                                                            className="btn btn-outline py-1.5 px-4 text-xs"
                                                        >
                                                            Manage
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>

                                {/* API Keys */}
                                <div className="glass-panel p-8">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                                            <Key size={20} className="text-blue-400" /> API Keys
                                        </h2>
                                        <button className="btn btn-primary py-1.5 px-4 text-xs">Generate New Key</button>
                                    </div>

                                    <div className="bg-black/20 border border-white/10 rounded-lg overflow-hidden">
                                        <table className="w-full text-left text-sm">
                                            <thead className="bg-slate-800/80 border-b border-slate-700">
                                                <tr>
                                                    <th className="px-6 py-4 font-semibold text-slate-300">Name</th>
                                                    <th className="px-6 py-4 font-semibold text-slate-300">Created</th>
                                                    <th className="px-6 py-4 font-semibold text-slate-300">Last Used</th>
                                                    <th className="px-6 py-4 text-right"></th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-700/50 text-slate-300">
                                                <tr>
                                                    <td className="px-6 py-4 font-medium">Production Data Pipeline</td>
                                                    <td className="px-6 py-4 text-slate-400">Oct 12, 2026</td>
                                                    <td className="px-6 py-4 text-slate-400">2 mins ago</td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button className="text-slate-400 hover:text-white"><Settings size={16} /></button>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="px-6 py-4 font-medium">Jupyter Research Env</td>
                                                    <td className="px-6 py-4 text-slate-400">Nov 03, 2026</td>
                                                    <td className="px-6 py-4 text-slate-400">Yesterday</td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button className="text-slate-400 hover:text-white"><Settings size={16} /></button>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Activity & Billing */}
                            <div className="space-y-8">
                                {/* Activity Feed */}
                                <div className="glass-panel p-8">
                                    <h2 className="text-xl font-bold text-primary mb-6">Recent Activity</h2>
                                    <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-slate-700/50">
                                        {recentActivity.map((log, idx) => (
                                            <div key={idx} className="relative flex items-start pl-8 md:pl-0">
                                                {/* Timeline Dot */}
                                                <div className="absolute left-0 md:left-1/2 w-4 h-4 rounded-full bg-purple-500 border-2 border-primary -translate-x-1.5 md:-translate-x-2 mt-1 z-10 shadow-lg shadow-purple-500/50"></div>

                                                <div className="md:w-1/2 md:pr-8 md:text-right hidden md:block">
                                                    <div className="text-xs text-slate-500 font-semibold">{log.time}</div>
                                                </div>

                                                <div className="md:w-1/2 md:pl-8 w-full block">
                                                    <div className="text-xs text-slate-500 font-semibold block md:hidden mb-1">{log.time}</div>
                                                    <h4 className="font-bold text-sm text-primary">{log.action}</h4>
                                                    <p className="text-xs text-slate-400 mt-1">{log.detail}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Quick CTA */}
                                <div className="bg-gradient-to-br from-purple-900/40 to-slate-900 border border-purple-500/30 rounded-xl p-8 relative overflow-hidden">
                                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-500/20 blur-2xl rounded-full"></div>
                                    <h3 className="font-bold text-primary mb-2 relative z-10">Need a specialized cohort?</h3>
                                    <p className="text-sm text-slate-400 mb-6 relative z-10">Our Clinical Ops team can curate custom data tailored to your inclusion criteria.</p>
                                    <Link to="/custom-request" className="btn bg-white text-slate-900 hover:bg-slate-200 w-full py-2.5 text-sm relative z-10">
                                        Request Custom Data
                                    </Link>
                                </div>
                            </div>

                        </div>
                    </>
                ) : (
                    <DocumentsTab />
                )}
            </div>

            {/* Manage Dataset Modal */}
            {manageModalOpen && managingDataset && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
                        {/* Header */}
                        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-800/20">
                            <div>
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Settings className="text-purple-400" size={24} />
                                    Manage Dataset
                                </h2>
                                <p className="text-sm text-slate-400 mt-1">
                                    <span className="font-mono text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded">{managingDataset.id}</span>
                                    <span className="ml-2">{managingDataset.name}</span>
                                </p>
                            </div>
                            <button
                                onClick={() => { setManageModalOpen(false); setManagingDataset(null); }}
                                className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 overflow-y-auto custom-scrollbar">
                            <h3 className="text-lg font-semibold text-primary mb-4">Request Feature Add-ons</h3>
                            <p className="text-sm text-slate-400 mb-6">Enhance your dataset with additional formats, access methods, and expert support. Select the add-ons you need and our team will provision them.</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {ADDONS.map((addon) => (
                                    <div key={addon.id} className="bg-slate-800/40 border border-slate-700 rounded-xl p-4 flex flex-col">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-bold text-white leading-tight">{addon.name}</h4>
                                            <span className="text-xs font-semibold text-purple-400 bg-purple-400/10 px-2 py-1 rounded shrink-0">{addon.price}</span>
                                        </div>
                                        <p className="text-xs text-slate-400 mb-4 flex-grow">{addon.desc}</p>
                                        
                                        <div className="mt-auto pt-4">
                                            {addonState[addon.id] === 'paid' ? (
                                                <button disabled className="w-full py-2 rounded-lg text-sm font-semibold transition-colors flex justify-center items-center gap-2 bg-green-500/10 text-green-400 border border-green-500/30">
                                                    <Check size={16} /> Paid & Provisioning
                                                </button>
                                            ) : addonState[addon.id] === 'authorized' ? (
                                                <button 
                                                    onClick={() => handlePayAddon(addon)}
                                                    className="w-full py-2 rounded-lg text-sm font-semibold transition-colors flex justify-center items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-900 shadow-lg shadow-amber-500/20"
                                                >
                                                    <CreditCard size={16} /> Pay to Provision
                                                </button>
                                            ) : addonState[addon.id] === 'requested' ? (
                                                <button disabled className="w-full py-2 rounded-lg text-sm font-semibold transition-colors flex justify-center items-center gap-2 bg-slate-700/50 text-slate-400 border border-slate-600">
                                                    <Activity size={16} className="animate-spin-slow" /> Pending Auth...
                                                </button>
                                            ) : (
                                                <button 
                                                    onClick={() => handleRequestAddon(addon)}
                                                    className="w-full py-2 rounded-lg text-sm font-semibold transition-colors flex justify-center items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white"
                                                >
                                                    <Plus size={16} /> Request Add-on
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Dataset Details Modal */}
            {detailsModalOpen && detailsDataset && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
                        {/* Header */}
                        <div className="p-6 border-b border-slate-800 flex justify-between items-start bg-slate-800/20 shrink-0">
                            <div>
                                <span className="font-mono text-xs text-purple-400 bg-purple-400/10 px-2 py-0.5 rounded border border-purple-500/20">{detailsDataset.id}</span>
                                <h2 className="text-2xl font-bold text-white mt-3 mb-1">
                                    {detailsDataset.name}
                                </h2>
                                <p className="text-sm text-slate-400 flex flex-wrap items-center gap-4">
                                    <span className="flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${detailsDataset.status === 'Active' ? 'bg-blue-400' : 'bg-yellow-400'}`}></span>
                                        Status: <span className="font-semibold text-slate-300">{detailsDataset.status}</span>
                                    </span>
                                    {detailsDataset.doi && (
                                        <span className="flex items-center gap-1 font-mono text-xs bg-slate-800 border border-slate-700 px-2 py-0.5 rounded text-slate-300">
                                            DOI: {detailsDataset.doi}
                                        </span>
                                    )}
                                </p>
                            </div>
                            <button
                                onClick={() => { setDetailsModalOpen(false); setDetailsDataset(null); }}
                                className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 overflow-y-auto flex-1 relative">
                            
                            <div className="mb-6 flex justify-end">
                                <button
                                    onClick={() => setShowCitation(!showCitation)}
                                    className="btn btn-outline py-1.5 px-4 text-xs flex items-center gap-2"
                                >
                                    <FileText size={14} /> {showCitation ? 'Hide Citation' : 'Generate Citation'}
                                </button>
                            </div>

                            {showCitation && (
                                <div className="mb-6 bg-slate-800/50 border border-slate-700/80 rounded-xl p-4 animate-in fade-in slide-in-from-top-2">
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {['IEEE', 'APA', 'MLA', 'Harvard'].map(fmt => (
                                            <button 
                                                key={fmt} 
                                                onClick={() => setCitationFormat(fmt)}
                                                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${citationFormat === fmt ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40' : 'bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700'}`}
                                            >
                                                {fmt}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="relative group">
                                        <div className="p-3 bg-black/40 border border-slate-800 rounded font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto whitespace-pre-wrap">
                                            {generateCitation(citationFormat, detailsDataset)}
                                        </div>
                                        <button 
                                            onClick={() => {
                                                navigator.clipboard.writeText(generateCitation(citationFormat, detailsDataset));
                                                alert("Citation copied to clipboard!");
                                            }}
                                            className="absolute top-2 right-2 p-1.5 bg-slate-700 hover:bg-slate-600 rounded text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity border border-slate-600"
                                            title="Copy to clipboard"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-4 flex flex-col justify-between">
                                    <div>
                                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Access Paradigm</p>
                                        <p className="font-semibold text-white">{detailsDataset.access}</p>
                                    </div>
                                    <button 
                                        className="mt-4 w-full btn btn-outline py-2 px-3 text-xs flex justify-center items-center gap-2 border-slate-600 hover:border-blue-400 hover:text-blue-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        onClick={() => handleDownload(detailsDataset.id, detailsDataset.selectedFormat, detailsDataset.name)}
                                        disabled={downloading}
                                    >
                                        <Download size={14} className={downloading ? "animate-bounce" : ""} /> {downloading ? 'Downloading...' : getAccessAction(detailsDataset.access).label}
                                    </button>
                                </div>
                                <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-4 flex flex-col justify-between">
                                    <div>
                                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">License Type</p>
                                        <p className="font-semibold text-white">{detailsDataset.license}</p>
                                    </div>
                                    <button 
                                        className="mt-4 w-full btn btn-outline py-2 px-3 text-xs flex justify-center items-center gap-2 border-slate-600 hover:border-purple-400 hover:text-purple-400 transition-colors"
                                        onClick={() => alert(`Retrieving formal licensing PDF for ${detailsDataset.name}...`)}
                                    >
                                        <FileText size={14} /> View Document
                                    </button>
                                </div>
                            </div>

                            <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-5 flex items-start gap-4">
                                <Activity className="text-indigo-400 shrink-0 mt-0.5" size={20} />
                                <div>
                                    <h4 className="font-bold text-indigo-400 mb-1">Dataset License Expiry</h4>
                                    <p className="text-sm text-indigo-200/80 mb-2">Extended Dataset period expiry, based on the license brought.</p>
                                    <p className="font-mono text-lg font-bold text-white tracking-wide">{detailsDataset.expiry}</p>
                                </div>
                            </div>

                            {/* License Extension Selection */}
                            <div className="mt-6 border-t border-slate-700/50 pt-6">
                                <h4 className="text-sm font-bold text-slate-300 mb-4">Extend Dataset Access</h4>
                                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                                    {[1, 2, 3, 4, 5, 6].map(m => (
                                        <button 
                                            key={m}
                                            onClick={() => setExtensionMonths(m)}
                                            className={`py-2 flex flex-col items-center justify-center rounded-lg text-sm font-semibold transition-all ${extensionMonths === m ? 'bg-purple-500/20 border border-purple-500/50 text-purple-400' : 'bg-slate-800/40 border border-slate-700 text-slate-400 hover:text-slate-300 hover:border-slate-600'}`}
                                        >
                                            <span className="text-lg leading-none mb-1">{m}</span> 
                                            <span className="text-[10px] uppercase tracking-wider">{m === 1 ? 'Mo' : 'Mos'}</span>
                                        </button>
                                    ))}
                                </div>
                                <div className="flex justify-between items-end mt-4 px-1">
                                    <div className="text-sm text-slate-400">Rate: ₹2,500 / month</div>
                                    <div className="text-2xl font-bold text-white">Total: <span className="text-purple-400">₹{(extensionMonths * 2500).toLocaleString()}</span></div>
                                </div>
                            </div>

                            {detailsDataset.category === 'Imaging' && (
                                <div className="mt-6 border-t border-slate-700/50 pt-6">
                                    <h4 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2">
                                        <Database size={16} className="text-indigo-400" /> Patient Image Scan Preview
                                    </h4>
                                    <p className="text-xs text-slate-400 mb-4">Click on any image ID below to launch the interactive PACS / DICOM viewer for that patient's scan.</p>
                                    
                                    <div className="grid grid-cols-2 gap-2">
                                        {(() => {
                                            const localData = fallbackRegistry[detailsDataset.id];
                                            const sampleRows = localData ? localData.rows.slice(0, 4) : [];
                                            return sampleRows.map((row, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => handleOpenViewer(row)}
                                                    className="flex items-center justify-between p-3 bg-slate-800/40 hover:bg-indigo-500/10 border border-slate-700/50 hover:border-indigo-500/30 rounded-xl transition-all text-left text-xs text-slate-300 group"
                                                >
                                                    <div>
                                                        <div className="font-mono font-bold text-primary group-hover:text-indigo-400 transition-colors flex items-center gap-1.5">
                                                            <Eye size={12} /> {row.image_id}
                                                        </div>
                                                        <div className="text-[10px] text-slate-500 mt-0.5">{row.scan_modality || 'Scan'} • {row.finding_label || 'Normal'}</div>
                                                    </div>
                                                    <span className="text-[10px] font-mono bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded text-slate-400">
                                                        {row.gender}, {row.patient_age}y
                                                    </span>
                                                </button>
                                            ));
                                        })()}
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        {/* Footer */}
                        <div className="p-4 border-t border-slate-800 bg-slate-800/30 flex justify-between items-center px-6 shrink-0">
                            <button 
                                onClick={() => { 
                                    setDetailsModalOpen(false); 
                                    navigate('/checkout', { 
                                        state: { 
                                            total: extensionMonths * 2500, 
                                            basePrice: extensionMonths * 2500, 
                                            additionalServicesPrice: 0, 
                                            records: detailsDataset?.id || 'Dataset Extension', 
                                            format: 'Licensing Update', 
                                            districts: `${extensionMonths} Month(s)` 
                                        } 
                                    }); 
                                }}
                                className="btn btn-primary py-2.5 px-6 shadow-lg shadow-purple-500/20 flex gap-2 items-center"
                            >
                                Pay & Extend Data Access <ArrowRight size={16} />
                            </button>
                            <button 
                                onClick={() => { setDetailsModalOpen(false); setDetailsDataset(null); setShowCitation(false); setExtensionMonths(1); }}
                                className="btn btn-outline py-2.5 px-6"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <DicomViewerModal 
                isOpen={viewerOpen} 
                onClose={() => { setViewerOpen(false); setViewerRow(null); }} 
                row={viewerRow} 
                category={detailsDataset?.category} 
            />
        </div>
    );
};

const DocumentsTab = () => (
    <div className="glass-panel p-8">
        <h2 className="text-2xl font-bold text-primary mb-2 flex items-center gap-3">
            <FileText className="text-orange-400" /> Consumer Documents
        </h2>
        <p className="text-slate-400 mb-8 border-b border-slate-800 pb-6">Access your executed Data Use Agreements (DUAs), invoices, and API access credentials here.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5 flex justify-between items-center hover:border-orange-500/30 transition-colors">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-400/10 rounded-lg text-blue-400"><File size={24} /></div>
                    <div>
                        <h4 className="font-bold text-primary">Signed DUA - AUR-EHR-00087.pdf</h4>
                        <div className="text-xs text-slate-400">Added Oct 12, 2026 â€¢ 1.2 MB</div>
                    </div>
                </div>
                <button className="text-slate-400 hover:text-white"><Download size={20} /></button>
            </div>

            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5 flex justify-between items-center hover:border-orange-500/30 transition-colors">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-red-400/10 rounded-lg text-red-400"><File size={24} /></div>
                    <div>
                        <h4 className="font-bold text-primary">Invoice #INV-2026-089.pdf</h4>
                        <div className="text-xs text-slate-400">Added Oct 12, 2026 â€¢ 245 KB</div>
                    </div>
                </div>
                <button className="text-slate-400 hover:text-white"><Download size={20} /></button>
            </div>

            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5 flex justify-between items-center hover:border-orange-500/30 transition-colors">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-red-400/10 rounded-lg text-red-400"><File size={24} /></div>
                    <div>
                        <h4 className="font-bold text-primary">Enterprise API Architecture Docs.pdf</h4>
                        <div className="text-xs text-slate-400">Added Sep 01, 2026 â€¢ 8.4 MB</div>
                    </div>
                </div>
                <button className="text-slate-400 hover:text-white"><Download size={20} /></button>
            </div>

            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5 flex justify-between items-center hover:border-orange-500/30 transition-colors">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-400/10 rounded-lg text-blue-400"><File size={24} /></div>
                    <div>
                        <h4 className="font-bold text-primary">Docker Quickstart Guide.pdf</h4>
                        <div className="text-xs text-slate-400">Added Nov 02, 2026 â€¢ 3.1 MB</div>
                    </div>
                </div>
                <button className="text-slate-400 hover:text-white"><Download size={20} /></button>
            </div>
        </div>
    </div>
);

export default Dashboard;
