import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Database, Key, CreditCard, Activity, ArrowRight, Download, Settings, FileText, File, X, Plus, Check, AlertCircle, Eye, Sliders, Play, Code, Terminal, FileCode, RotateCcw, Cpu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { DATASET_REGISTRY as fallbackRegistry } from '../utils/computeHelpers';
import Editor from '@monaco-editor/react';

/* ═══════════════════════════════════════════════════════════════
   SIMULATED CLINICAL DATA PREVIEWS
   ═══════════════════════════════════════════════════════════════ */
const GET_SAMPLE_DATA = (category) => {
    const cat = String(category).toUpperCase();
    if (cat.includes('MENTAL')) {
        return [
            { id: 1, age: 24, gender: 'Female', score_gad7: 14, score_phq9: 18, severity: 'Severe' },
            { id: 2, age: 31, gender: 'Male', score_gad7: 6, score_phq9: 8, severity: 'Mild' },
            { id: 3, age: 45, gender: 'Female', score_gad7: 12, score_phq9: 11, severity: 'Moderate' },
            { id: 4, age: 19, gender: 'Non-binary', score_gad7: 18, score_phq9: 22, severity: 'Severe' },
            { id: 5, age: 52, gender: 'Male', score_gad7: 4, score_phq9: 3, severity: 'Minimal' }
        ];
    }
    if (cat.includes('IMAGING')) {
        return [
            { id: 1, image_id: 'IMG-201', scan_modality: 'DICOM', patient_age: 62, gender: 'Male', finding_label: 'Pulmonary Nodule' },
            { id: 2, image_id: 'IMG-202', scan_modality: 'DICOM', patient_age: 45, gender: 'Female', finding_label: 'Normal' },
            { id: 3, image_id: 'IMG-203', scan_modality: 'DICOM', patient_age: 71, gender: 'Male', finding_label: 'Pneumothorax' },
            { id: 4, image_id: 'IMG-204', scan_modality: 'DICOM', patient_age: 38, gender: 'Female', finding_label: 'Cardiomegaly' },
            { id: 5, image_id: 'IMG-205', scan_modality: 'DICOM', patient_age: 50, gender: 'Male', finding_label: 'Normal' }
        ];
    }
    // EHR / ICU / CLINICAL DEFAULT
    return [
        { id: 1, patient_id: 'PT-901', age: 67, gender: 'Male', heart_rate: 104, oxygen_sat: 91, outcome: 1 },
        { id: 2, patient_id: 'PT-902', age: 43, gender: 'Female', heart_rate: 82, oxygen_sat: 98, outcome: 0 },
        { id: 3, patient_id: 'PT-903', age: 59, gender: 'Female', heart_rate: 115, oxygen_sat: 88, outcome: 1 },
        { id: 4, patient_id: 'PT-904', age: 74, gender: 'Male', heart_rate: 90, oxygen_sat: 94, outcome: 0 },
        { id: 5, patient_id: 'PT-905', age: 29, gender: 'Female', heart_rate: 76, oxygen_sat: 99, outcome: 0 }
    ];
};

const SimulatedMedicalScan = ({ imageId, category, findingLabel, filterStyle = {} }) => {
    const idStr = String(imageId).toLowerCase();
    
    if (category === 'Imaging') {
        // Dermatology
        if (idStr.includes('img-208') || idStr.includes('img-205')) {
            return (
                <svg width="100%" height="100%" viewBox="0 0 200 200" className="bg-[#f0c3a2] rounded-lg" style={filterStyle}>
                    <circle cx="40" cy="50" r="1.5" fill="#e0b090" opacity="0.6" />
                    <circle cx="150" cy="120" r="2" fill="#e0b090" opacity="0.6" />
                    <circle cx="80" cy="160" r="1" fill="#e0b090" opacity="0.6" />
                    <path d="M 20 40 Q 60 70 80 60" stroke="#5a4230" strokeWidth="0.8" fill="none" opacity="0.4" />
                    <circle cx="100" cy="100" r="25" fill="url(#nevusGrad)" stroke="#4e3524" strokeWidth="0.8" />
                    <defs>
                        <radialGradient id="nevusGrad" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#4a301a" />
                            <stop offset="85%" stopColor="#6f4e37" />
                            <stop offset="100%" stopColor="#9a7b56" stopOpacity="0.3" />
                        </radialGradient>
                    </defs>
                </svg>
            );
        }

        // Retinal Fundus scan
        if (idStr.includes('img-207') || idStr.includes('img-203')) {
            return (
                <svg width="100%" height="100%" viewBox="0 0 200 200" className="bg-[#120502] rounded-lg" style={filterStyle}>
                    <circle cx="100" cy="100" r="90" fill="#e65c00" opacity="0.85" stroke="#cc3300" strokeWidth="2" />
                    <circle cx="60" cy="100" r="16" fill="#ffe066" filter="blur(1px)" />
                    <path d="M 60 100 Q 80 70 120 60 T 170 50" stroke="#990000" strokeWidth="2" fill="none" opacity="0.8" />
                    <path d="M 60 100 Q 90 120 130 130 T 180 150" stroke="#990000" strokeWidth="2.5" fill="none" opacity="0.8" />
                    <path d="M 60 100 Q 50 60 30 40 T 10 20" stroke="#990000" strokeWidth="1.5" fill="none" opacity="0.8" />
                </svg>
            );
        }
    }

    // Default Chest X-Ray
    return (
        <svg width="100%" height="100%" viewBox="0 0 200 200" className="bg-[#050505] rounded-lg" style={filterStyle}>
            <line x1="100" y1="20" x2="100" y2="180" stroke="#444" strokeWidth="6" opacity="0.8" />
            <path d="M 90 20 L 110 20 M 88 50 L 112 50 M 85 80 L 115 80" stroke="#3a3a3a" strokeWidth="3" opacity="0.8" />
            <path d="M 90 35 C 65 30 50 55 45 110 C 45 140 70 145 90 140 Z" fill="#121212" opacity="0.7" stroke="#222" strokeWidth="1" />
            <path d="M 110 35 C 135 30 150 55 155 110 C 155 140 130 145 110 140 Z" fill="#121212" opacity="0.7" stroke="#222" strokeWidth="1" />
        </svg>
    );
};

const DicomViewerModal = ({ isOpen, onClose, row, category }) => {
    const [contrast, setContrast] = useState(100);
    const [brightness, setBrightness] = useState(100);
    const [invert, setInvert] = useState(false);

    if (!isOpen || !row) return null;

    const finding = row.finding_label || 'Normal';
    const imageId = row.image_id || 'IMG-201';

    const filterStyle = {
        filter: `brightness(${brightness}%) contrast(${contrast}%) ${invert ? 'invert(1)' : ''}`,
        transition: 'filter 0.15s ease'
    };

    return (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden shadow-2xl">
                <div className="flex-1 bg-black p-6 flex flex-col items-center justify-center border-r border-slate-900 relative min-h-[350px]">
                    <div className="absolute top-4 left-4 text-xs font-mono text-slate-500">
                        <div>ID: {imageId}</div>
                        <div>MOD: DICOM</div>
                        <div>SIZE: 512 x 512 px</div>
                    </div>
                    
                    <div className="w-full max-w-[320px] aspect-square relative flex items-center justify-center border border-slate-900 bg-slate-950/40 rounded-xl overflow-hidden shadow-inner">
                        <SimulatedMedicalScan 
                            imageId={imageId} 
                            category={category} 
                            findingLabel={finding} 
                            filterStyle={filterStyle} 
                        />
                    </div>
                </div>

                <div className="w-full md:w-[320px] bg-slate-900 p-6 flex flex-col justify-between shrink-0">
                    <div>
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <span className="text-[10px] uppercase font-bold tracking-wider text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">PACS Viewer</span>
                                <h3 className="text-lg font-bold text-white mt-2 font-sans">DICOM Samples</h3>
                            </div>
                            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-full transition-all">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="space-y-4 mb-6">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-800 pb-2">DICOM Header</h4>
                            <div className="grid grid-cols-2 gap-y-2 text-xs font-sans">
                                <span className="text-slate-500">Patient Age:</span>
                                <span className="text-slate-200 font-mono">{row.patient_age || 45} yrs</span>
                                
                                <span className="text-slate-500">Patient Gender:</span>
                                <span className="text-slate-200 font-mono">{row.gender || 'Female'}</span>
                                
                                <span className="text-slate-500">Scan Label:</span>
                                <span className="text-indigo-400 font-bold">{finding}</span>
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

                            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none pt-2">
                                <input 
                                    type="checkbox" checked={invert} 
                                    onChange={e => setInvert(e.target.checked)}
                                    className="rounded border-slate-700 bg-slate-800 text-indigo-500 focus:ring-indigo-500" 
                                />
                                Invert Colors
                            </label>
                        </div>
                    </div>

                    <button 
                        onClick={() => alert("Raw DICOM downloads are blocked by provider security policies. Prevents reconstructive patient privacy leaks.")}
                        className="w-full btn btn-outline text-xs py-2 mt-6 cursor-not-allowed opacity-50"
                        disabled
                    >
                        Raw DICOM Download Disabled
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ═══════════════════════════════════════════════════════════════
   ONLINE IDE SANDBOX SIMULATOR
   ═══════════════════════════════════════════════════════════════ */
const IDESandbox = ({ workspace, onClose, onDeductCredits }) => {
    const [selectedScript, setSelectedScript] = useState('explore_data.py');
    const [code, setCode] = useState('');
    const [running, setRunning] = useState(false);
    const [runProgress, setRunProgress] = useState(0);
    const [terminalLogs, setTerminalLogs] = useState([]);
    const [generatedOutputs, setGeneratedOutputs] = useState([]);
    const [showSampleTab, setShowSampleTab] = useState(true);
    const [sessionBurned, setSessionBurned] = useState(0);

    const scripts = {
        'explore_data.py': `# Explore dataset variables and properties\nimport pandas as pd\n\n# Load clinical cohort records\ndf = pd.read_parquet('/data/sensitive_records.parquet')\n\nprint("Dataset Shape:", df.shape)\nprint("\\nClinical Features Profile:")\nprint(df.columns.tolist())\nprint(df.describe())`,
        
        'train_model.py': `# Train predictive classification model\nimport pandas as pd\nimport pickle\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.ensemble import RandomForestClassifier\n\ndf = pd.read_parquet('/data/sensitive_records.parquet')\n# Patient de-identification\nX = df.drop(columns=[col for col in ['patient_id', 'id', 'outcome', 'severity'] if col in df.columns])\ny = df['outcome'] if 'outcome' in df.columns else (df['score_phq9'] > 10).astype(int)\n\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)\nmodel = RandomForestClassifier(n_estimators=100, random_state=42)\nmodel.fit(X_train, y_train)\n\n# Export trained weights binary\nwith open('/workspace/outputs/trained_model.pkl', 'wb') as f:\n    pickle.dump(model, f)\n\nprint("Weights generated. Saved trained_model.pkl binary.")`,
        
        'evaluate_model.py': `# Compile model report metrics\nimport pandas as pd\nimport pickle\nfrom sklearn.metrics import classification_report\n\ndf = pd.read_parquet('/data/sensitive_records.parquet')\nwith open('/workspace/outputs/trained_model.pkl', 'rb') as f:\n    model = pickle.load(f)\n\nX = df.drop(columns=[col for col in ['patient_id', 'id', 'outcome', 'severity'] if col in df.columns])\ny = df['outcome'] if 'outcome' in df.columns else (df['score_phq9'] > 10).astype(int)\n\npreds = model.predict(X)\nrep = classification_report(y, preds, output_dict=True)\n\npd.DataFrame(rep).transpose().to_csv('/workspace/outputs/classification_report.csv')\nprint("Metrics generated. Saved classification_report.csv.")`
    };

    // Load initial code
    useEffect(() => {
        setCode(scripts[selectedScript]);
    }, [selectedScript]);

    const runScript = () => {
        if (running) return;
        setRunning(true);
        setRunProgress(0);
        setTerminalLogs([]);
        setGeneratedOutputs([]);

        const logs = [
            `[Auratral Container Boot] Deploying isolated sandbox (Image: ${workspace.envType.includes('PyTorch') ? 'clinical-torch-cuda:latest' : 'clinical-py310-scipy:latest'})...`,
            `[Auratral Container Boot] Allocating cluster resources: ${workspace.instanceTier}...`,
            `[Auratral Sandbox] Mounting sandboxed clinical dataset: ${workspace.name}...`,
            `[Auratral Sandbox] Read-only directory '/data/' created. Data cohort slice compiled and mounted.`,
            `[Auratral Sandbox] Running script ${selectedScript} inside container...`,
        ];

        let lineIdx = 0;
        const interval = setInterval(() => {
            if (lineIdx < logs.length) {
                setTerminalLogs(prev => [...prev, logs[lineIdx]]);
                lineIdx++;
            } else {
                setRunProgress(p => {
                    if (p < 100) {
                        return p + 25;
                    } else {
                        clearInterval(interval);
                        // Training epochs simulation
                        setTimeout(() => {
                            if (selectedScript === 'explore_data.py') {
                                setTerminalLogs(prev => [
                                    ...prev,
                                    `Dataset Shape: (2450, ${workspace.category === 'Mental Health' ? '6' : '7'})`,
                                    `\nClinical Features Profile:`,
                                    workspace.category === 'Mental Health' 
                                        ? `['id', 'age', 'gender', 'score_gad7', 'score_phq9', 'severity']`
                                        : `['patient_id', 'age', 'gender', 'heart_rate', 'oxygen_sat', 'outcome']`,
                                    `Summary stats: Mean patient age = 52.4 years. Normal range validation: OK.`,
                                    `[Auratral Sandbox] Script execution completed successfully.`,
                                    `[Auratral Billing] Session consumed 2 Compute Credits (1 minute standard CPU run).`
                                ]);
                                onDeductCredits(2);
                                setSessionBurned(prev => prev + 2);
                            } else if (selectedScript === 'train_model.py') {
                                setTerminalLogs(prev => [
                                    ...prev,
                                    `Initiating model training loop...`,
                                    `Epoch 1/5: loss = 0.654, accuracy = 0.724`,
                                    `Epoch 2/5: loss = 0.512, accuracy = 0.791`,
                                    `Epoch 3/5: loss = 0.428, accuracy = 0.853`,
                                    `Epoch 4/5: loss = 0.356, accuracy = 0.892`,
                                    `Epoch 5/5: loss = 0.281, validation_accuracy = 0.915`,
                                    `RandomForestClassifier fitting completed. Saving output binaries.`,
                                    `Weights generated. Saved trained_model.pkl binary.`,
                                    `[Auratral Sandbox] Script execution completed successfully.`,
                                    `[Auratral Billing] Session consumed 6 Compute Credits (3 minutes GPU accelerated run).`
                                ]);
                                setGeneratedOutputs(prev => [
                                    ...prev,
                                    { name: 'trained_model.pkl', type: 'binary', content: 'Trained model weights dictionary - pickle serialized.' }
                                ]);
                                onDeductCredits(6);
                                setSessionBurned(prev => prev + 6);
                            } else {
                                setTerminalLogs(prev => [
                                    ...prev,
                                    `Loading model weights binary: /workspace/outputs/trained_model.pkl...`,
                                    `Running inference on validations subset...`,
                                    `Generating confusion matrix...`,
                                    `Metrics generated. Saved classification_report.csv.`,
                                    `Saved ROC Curve plot as auc_roc_curve.png.`,
                                    `[Auratral Sandbox] Script execution completed successfully.`,
                                    `[Auratral Billing] Session consumed 4 Compute Credits (2 minutes runtime).`
                                ]);
                                setGeneratedOutputs(prev => [
                                    ...prev,
                                    { name: 'classification_report.csv', type: 'csv', content: 'feature,precision,recall,f1-score\n0,0.92,0.91,0.91\n1,0.89,0.92,0.90' },
                                    { name: 'auc_roc_curve.png', type: 'image', content: 'ROC Curve visual output' }
                                ]);
                                onDeductCredits(4);
                                setSessionBurned(prev => prev + 4);
                            }
                            setRunning(false);
                        }, 500);
                        return 100;
                    }
                });
            }
        }, 300);
    };

    const downloadFile = (file) => {
        let blob;
        if (file.type === 'csv') {
            blob = new Blob([file.content], { type: 'text/csv' });
        } else if (file.type === 'binary') {
            blob = new Blob([file.content], { type: 'application/octet-stream' });
        } else {
            // SVG image placeholder
            const svgData = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%" class="bg-slate-950 p-6 rounded-lg"><path d="M50 250 L150 120 L250 180 L350 50" fill="none" stroke="#a855f7" stroke-width="4"/><line x1="50" y1="50" x2="50" y2="250" stroke="#475569" stroke-width="2"/><line x1="50" y1="250" x2="350" y2="250" stroke="#475569" stroke-width="2"/><text x="180" y="290" fill="#94a3b8" font-size="12">False Positive Rate</text><text x="10" y="150" fill="#94a3b8" font-size="12" transform="rotate(-90 10 150)">True Positive Rate</text><text x="150" y="30" fill="#f8fafc" font-size="14" font-weight="bold">AUC-ROC Curve (AUC = 0.915)</text></svg>`;
            blob = new Blob([svgData], { type: 'image/svg+xml' });
        }
        
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = file.name;
        link.click();
    };

    const sampleData = GET_SAMPLE_DATA(workspace.category);

    return (
        <div className="glass-panel p-6 border border-purple-500/30 min-h-[80vh] flex flex-col font-sans">
            {/* Header */}
            <div className="flex justify-between items-center pb-4 border-b border-glass-border mb-6">
                <div>
                    <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                        <Cpu className="text-purple-400" size={20} /> Sandboxed Compute IDE Workspace
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">Active Workspace ID: <span className="font-mono text-slate-300">{workspace.id}</span> • Machine: <span className="text-purple-400 font-semibold">{workspace.instanceTier}</span> • <span className="text-pink-400 font-bold">Session Burned: {sessionBurned} Cr</span></p>
                </div>
                <button onClick={onClose} className="btn btn-outline py-1.5 px-4 text-xs">
                    Exit Sandbox
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1">
                {/* Left Panel: Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                            <FileCode size={13} className="text-purple-400" /> Scripts Explorer
                        </h4>
                        <div className="space-y-1">
                            {Object.keys(scripts).map(name => (
                                <button
                                    key={name}
                                    onClick={() => setSelectedScript(name)}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${selectedScript === name ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
                                >
                                    <FileCode size={12} /> {name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
                        <div className="flex justify-between items-center mb-3">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                <Database size={13} className="text-purple-400" /> Read-Only Data Preview
                            </h4>
                        </div>
                        <div className="space-y-2">
                            <div className="text-[10px] text-slate-400 font-mono bg-slate-900 p-2 rounded leading-tight">
                                path: /data/sensitive_records.parquet
                            </div>
                            <div className="text-[10px] text-slate-500 leading-normal">
                                Sandbox loads the complete patient record slice at runtime. Free syntax-check preview shows 5 dummy rows.
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-4">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                            <Activity size={13} className="text-pink-400 animate-pulse" /> Compute Session Billing
                        </h4>
                        <div className="space-y-3 font-sans text-xs">
                            <div className="flex justify-between items-center">
                                <span className="text-slate-500">Session Burned:</span>
                                <span className="text-pink-400 font-bold font-mono text-sm">{sessionBurned} Cr</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-500">Instance Rate:</span>
                                <span className="text-slate-300 font-semibold">{workspace.computeCreditRate || 2} Cr/min</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-500">Execution Status:</span>
                                <span className={`flex items-center gap-1 font-semibold ${running ? 'text-amber-400' : 'text-green-400'}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${running ? 'bg-amber-400 animate-ping' : 'bg-green-400 animate-pulse'}`}></span>
                                    {running ? 'Computing...' : 'Idle (Active)'}
                                </span>
                            </div>
                            <div className="border-t border-slate-800/80 pt-2 flex justify-between items-center text-[10px]">
                                <span className="text-slate-500">Current Balance:</span>
                                <span className="text-slate-300 font-mono font-semibold">{(localStorage.getItem('auratral_credits_balance') || 12500)} Cr</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Center Panel: Code & Data Preview tabs */}
                <div className="lg:col-span-3 flex flex-col gap-6">
                    {/* Code Editor */}
                    <div className="bg-slate-950/80 border border-slate-800 rounded-xl overflow-hidden flex flex-col flex-1 shadow-inner relative">
                        <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                <span className="text-xs font-mono text-slate-400 ml-2">{selectedScript}</span>
                            </div>
                            <button
                                onClick={runScript}
                                disabled={running}
                                className="btn btn-primary py-1 px-4 text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50"
                            >
                                <Play size={12} /> {running ? 'Running Container...' : 'Execute Script'}
                            </button>
                        </div>
                        
                        <Editor
                            height="280px"
                            defaultLanguage="python"
                            theme="auratral-dark"
                            value={code}
                            onChange={(val) => setCode(val || '')}
                            beforeMount={(monaco) => {
                                monaco.editor.defineTheme('auratral-dark', {
                                    base: 'vs-dark',
                                    inherit: true,
                                    rules: [
                                        { token: 'comment', foreground: '6a737d', fontStyle: 'italic' },
                                        { token: 'keyword', foreground: 'c792ea' },
                                        { token: 'string', foreground: 'c3e88d' },
                                        { token: 'number', foreground: 'f78c6c' },
                                    ],
                                    colors: {
                                        'editor.background': '#030712',
                                        'editor.lineHighlightBackground': '#111827',
                                        'editorLineNumber.foreground': '#4b5563',
                                        'editorLineNumber.activeForeground': '#a855f7',
                                    }
                                });
                            }}
                            options={{
                                minimap: { enabled: false },
                                fontSize: 12,
                                lineNumbers: 'on',
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                                fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                                padding: { top: 12, bottom: 12 },
                                renderLineHighlight: 'all',
                            }}
                        />
                    </div>

                    {/* Output Tabs (Sample Data vs execution log vs downloads) */}
                    <div className="bg-slate-950/60 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
                        <div className="bg-slate-900/80 px-4 border-b border-slate-800 flex gap-2">
                            <button
                                onClick={() => setShowSampleTab(true)}
                                className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 ${showSampleTab ? 'text-purple-400 border-purple-500' : 'text-slate-400 border-transparent hover:text-slate-200'}`}
                            >
                                Dummy Data preview (5 rows)
                            </button>
                            <button
                                onClick={() => setShowSampleTab(false)}
                                className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 ${!showSampleTab ? 'text-purple-400 border-purple-500' : 'text-slate-400 border-transparent hover:text-slate-200'}`}
                            >
                                Execution Output & Logs
                            </button>
                        </div>

                        <div className="p-4 min-h-[160px]">
                            {showSampleTab ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-[11px] font-mono text-slate-300">
                                        <thead>
                                            <tr className="border-b border-slate-800 text-slate-500">
                                                {sampleData.length > 0 && Object.keys(sampleData[0]).map(key => (
                                                    <th key={key} className="py-2 px-3">{key}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {sampleData.map((row, idx) => (
                                                <tr key={idx} className="border-b border-slate-900/50 hover:bg-slate-900/30">
                                                    {Object.values(row).map((val, valIdx) => (
                                                        <td key={valIdx} className="py-2 px-3">{String(val)}</td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="flex flex-col md:flex-row gap-6">
                                    {/* Terminal Console */}
                                    <div className="flex-1 bg-black/60 border border-slate-900 p-3 rounded-lg font-mono text-[10px] text-slate-300 h-44 overflow-y-auto space-y-1">
                                        {terminalLogs.length === 0 ? (
                                            <div className="text-slate-500 italic">Click "Execute Script" to spin up sandbox container...</div>
                                        ) : (
                                            terminalLogs.map((log, idx) => (
                                                <div key={idx} className={log.includes('Billing') ? 'text-pink-400 font-bold' : log.includes('error') ? 'text-red-400' : 'text-slate-300'}>{log}</div>
                                            ))
                                        )}
                                    </div>

                                    {/* Generated Artifacts Downloads */}
                                    <div className="w-full md:w-[240px] border border-slate-800 bg-slate-900/20 p-3 rounded-lg flex flex-col justify-between shrink-0">
                                        <div>
                                            <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Exportable Artifacts</h5>
                                            {generatedOutputs.length === 0 ? (
                                                <div className="text-xs text-slate-600 italic">No output artifacts generated yet. Run scripts to compile model outputs.</div>
                                            ) : (
                                                <div className="space-y-2">
                                                    {generatedOutputs.map((file, idx) => (
                                                        <div key={idx} className="flex justify-between items-center p-2 bg-slate-800/40 border border-slate-700/50 rounded-lg text-xs">
                                                            <div className="flex items-center gap-2">
                                                                <FileText size={14} className="text-purple-400" />
                                                                <span className="font-mono text-slate-200">{file.name}</span>
                                                            </div>
                                                            <button
                                                                onClick={() => downloadFile(file)}
                                                                className="text-purple-400 hover:text-purple-300 transition-colors p-1"
                                                                title="Download file"
                                                            >
                                                                <Download size={14} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        
                                        {generatedOutputs.some(f => f.name === 'auc_roc_curve.png') && (
                                            <div className="mt-4 pt-3 border-t border-slate-800 flex flex-col items-center">
                                                <div className="text-[9px] text-slate-500 uppercase tracking-wider mb-2">ROC Validation Chart Preview</div>
                                                <svg viewBox="0 0 200 150" className="w-32 h-24 bg-slate-950 p-2 rounded border border-slate-800">
                                                    <path d="M20 130 L60 80 L120 100 L180 30" fill="none" stroke="#a855f7" strokeWidth="2"/>
                                                    <line x1="20" y1="20" x2="20" y2="130" stroke="#475569" strokeWidth="1"/>
                                                    <line x1="20" y1="130" x2="180" y2="130" stroke="#475569" strokeWidth="1"/>
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */
const Dashboard = () => {
    const navigate = useNavigate();
    const { user: authUser } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');
    const [manageModalOpen, setManageModalOpen] = useState(false);
    const [managingDataset, setManagingDataset] = useState(null);
    const [addonState, setAddonState] = useState({});
    const [notifications, setNotifications] = useState([]);
    
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const [detailsDataset, setDetailsDataset] = useState(null);
    const [extensionYears, setExtensionYears] = useState(1);
    const [showCitation, setShowCitation] = useState(false);
    const [citationFormat, setCitationFormat] = useState('IEEE');
    const [viewerOpen, setViewerOpen] = useState(false);
    const [viewerRow, setViewerRow] = useState(null);

    // Active compute workspace IDE session state
    const [selectedWorkspace, setSelectedWorkspace] = useState(null);

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

    // Credit Balance synced with localStorage
    const [credits, setCredits] = useState(() => {
        const localBal = localStorage.getItem('auratral_credits_balance');
        return localBal ? Number(localBal) : 12500;
    });

    const deductCredits = (amt) => {
        setCredits(prev => {
            const next = Math.max(0, prev - amt);
            localStorage.setItem('auratral_credits_balance', String(next));
            window.dispatchEvent(new Event('auratral_credits_updated'));
            return next;
        });
    };

    useEffect(() => {
        const handleCreditsUpdate = () => {
            const localBal = localStorage.getItem('auratral_credits_balance');
            setCredits(localBal ? Number(localBal) : 12500);
        };
        window.addEventListener('auratral_credits_updated', handleCreditsUpdate);
        return () => window.removeEventListener('auratral_credits_updated', handleCreditsUpdate);
    }, []);

    // User details
    const user = {
        name: authUser?.name || 'Jane Doe',
        institution: authUser?.institution || 'Global Health Institute',
        plan: authUser?.role === 'provider' ? 'Data Provider' : 'Academic Research',
        credits: credits
    };

    const [purchases, setPurchases] = useState([]);
    const [loadingPurchases, setLoadingPurchases] = useState(true);

    useEffect(() => {
        const fetchPurchases = async () => {
            if (!authUser) return;

            // Load local purchases from localStorage immediately
            const localPurchases = JSON.parse(localStorage.getItem('auratral_local_purchases') || '[]');
            const localMapped = localPurchases.map(data => ({
                id: data.datasetId,
                name: data.datasetName,
                category: data.category,
                access: '1-Year Sandboxed Compute License',
                price: data.price || 1237,
                envType: data.envType || 'Python 3.10 (SciPy/Pandas)',
                instanceTier: data.instanceTier || 'Standard CPU',
                cohortFilters: data.cohortFilters || { districts: 'All Districts', region: 'All Regions', ageRange: '18 - 85', gender: 'Balanced (50-50)' },
                status: data.status || 'Active',
                expiry: new Date(new Date(data.purchaseDate).setFullYear(new Date(data.purchaseDate).getFullYear() + 1)).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                license: data.license || '1-Year Sandboxed Compute License',
                doi: data.doi,
                purchaseDate: data.purchaseDate
            }));

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
                        access: '1-Year Sandboxed Compute License',
                        price: data.price || 1237,
                        envType: data.envType || 'Python 3.10 (SciPy/Pandas)',
                        instanceTier: data.instanceTier || 'Standard CPU',
                        cohortFilters: data.cohortFilters || { districts: 'All Districts', region: 'All Regions', ageRange: '18 - 85', gender: 'Balanced (50-50)' },
                        status: data.status || 'Active',
                        expiry: new Date(new Date(data.purchaseDate).setFullYear(new Date(data.purchaseDate).getFullYear() + 1)).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                        license: data.license || '1-Year Sandboxed Compute License',
                        doi: data.doi,
                        purchaseDate: data.purchaseDate
                    });
                });

                // Merge database and localStorage purchases, deduplicating by ID and purchaseDate
                const merged = [...fetched];
                localMapped.forEach(lp => {
                    if (!merged.some(m => m.id === lp.id && m.purchaseDate === lp.purchaseDate)) {
                        merged.push(lp);
                    }
                });

                merged.sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate));
                setPurchases(merged);
            } catch (err) {
                console.error("Error fetching purchases, using local storage fallback: ", err);
                setPurchases(localMapped.sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate)));
            } finally {
                setLoadingPurchases(false);
            }
        };
        fetchPurchases();
    }, [authUser]);

    // Auto-launch the sandbox immediately after purchase
    useEffect(() => {
        const justDeployedId = localStorage.getItem('auratral_just_deployed');
        if (justDeployedId && purchases.length > 0) {
            const match = purchases.find(p => p.id === justDeployedId);
            if (match) {
                setSelectedWorkspace(match);
                localStorage.removeItem('auratral_just_deployed');
            }
        }
    }, [purchases]);

    const activeDatasets = purchases;

    const recentActivity = [
        { action: 'Compute Sandbox Allocated', time: '2 hours ago', detail: 'Workspace AUR-EHR-101 (Standard CPU)' },
        { action: 'Model Weights Exported', time: 'Yesterday', detail: 'trained_model.pkl (RandomForest weights)' },
        { action: 'Ethics Agreement Approved', time: 'Oct 1, 2026', detail: 'IRB protocols verified' }
    ];

    const ADDONS = [
        { id: 'longitudinal', name: 'Longitudinal Extension', desc: 'Extend temporal scope window of your workspace mounted cohort', price: '+500 Credits/yr' },
        { id: 'gpu', name: 'Dedicated GPU Instance Node', desc: 'Equip your sandbox runtime container with dedicated CUDA hardware', price: '+1,500 Credits/yr' },
        { id: 'storage', name: 'Persistent Sandbox Storage', desc: 'Save your python scripts, weights and environments between runs', price: '+500 Credits/yr' },
        { id: 'support', name: '24/7 Technical Sandbox support', desc: 'Direct priority SLA assistance for container boot or setup errors', price: '+300 Credits/yr' }
    ];

    const handleRequestAddon = (addon) => {
        setAddonState(prev => ({ ...prev, [addon.id]: 'requested' }));
        setTimeout(() => {
            setAddonState(prev => ({ ...prev, [addon.id]: 'authorized' }));
            setNotifications(prev => [
                ...prev,
                { id: Date.now() + Math.random(), title: 'Request Authorized - Allocation Pending', message: `Your request for ${addon.name} has been approved. Please allocate credits to provision.`, addonId: addon.id, addon: addon }
            ]);
        }, 2000);
    };

    const handlePayAddon = (addon) => {
        const costStr = addon.price.replace(/[^0-9]/g, '');
        const cost = costStr ? Number(costStr) : 500;
        if (credits < cost) {
            alert("Insufficient credit balance. Top up first!");
            return;
        }
        deductCredits(cost);
        setAddonState(prev => ({ ...prev, [addon.id]: 'paid' }));
        setNotifications(prev => prev.filter(n => n.addonId !== addon.id));
        alert(`Credits successfully allocated! ${addon.name} is now provisioned inside your workspace.`);
    };

    if (selectedWorkspace) {
        return (
            <div className="pt-32 pb-16 min-h-screen">
                <div className="container mx-auto px-8 max-w-7xl">
                    <IDESandbox 
                        workspace={selectedWorkspace} 
                        onClose={() => setSelectedWorkspace(null)} 
                        onDeductCredits={deductCredits}
                    />
                </div>
            </div>
        );
    }

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
                                    Allocate {notif.addon.price.split(' ')[0]} Cr
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Dashboard Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                    <div>
                        <h1 className="text-3xl font-bold text-primary mb-2 font-sans">Welcome back, {user.name}</h1>
                        <p className="text-secondary flex items-center gap-2 font-sans">
                            <span>{user.institution}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                            <span className="text-purple-400 font-semibold">{user.plan}</span>
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <Link to="/gallery" className="btn btn-outline py-2.5 px-6 flex items-center gap-2">
                            Explore Catalog
                        </Link>
                        <Link to="/custom-request" className="btn btn-primary py-2.5 px-6 flex items-center gap-2">
                            Request Custom Cohort <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex gap-2 mb-8 border-b border-slate-800 pb-px">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`px-6 py-3 text-sm font-semibold transition-all flex items-center gap-2 ${activeTab === 'overview' ? 'text-purple-400 border-b-2 border-purple-400 bg-purple-500/5' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                        <Activity size={16} /> Runtimes Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('docs')}
                        className={`px-6 py-3 text-sm font-semibold transition-all flex items-center gap-2 ${activeTab === 'docs' ? 'text-orange-400 border-b-2 border-orange-400 bg-orange-500/5' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                        <FileText size={16} /> My Compliance Docs
                    </button>
                </div>

                {/* Main Content Area */}
                {activeTab === 'overview' ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <div className="glass-panel p-6 border-t-2 border-t-purple-500">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Active Sandboxes</h3>
                                    <Database size={20} className="text-purple-400" />
                                </div>
                                <div className="text-3xl font-bold text-primary mb-1">{activeDatasets.length}</div>
                                <div className="text-xs text-purple-400 flex items-center gap-1 font-sans">
                                    <Activity size={12} /> Containers initialized
                                </div>
                            </div>

                            <div className="glass-panel p-6 border-t-2 border-t-blue-500">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Simulated Runs</h3>
                                    <Activity size={20} className="text-blue-400" />
                                </div>
                                <div className="text-3xl font-bold text-primary mb-1">{activeDatasets.length > 0 ? "8" : "0"}</div>
                                <div className="text-xs text-slate-500">Last 30 days</div>
                            </div>

                            <div className="glass-panel p-6 border-t-2 border-t-indigo-500">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Sandbox Storage</h3>
                                    <Download size={20} className="text-indigo-400" />
                                </div>
                                <div className="text-3xl font-bold text-primary mb-1">{activeDatasets.length > 0 ? "412 MB" : "0 KB"}</div>
                                <div className="text-xs text-slate-500">of 100 GB persistent storage</div>
                            </div>

                            <div className="glass-panel p-6 border-t-2 border-t-pink-500">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Compute Credits</h3>
                                    <CreditCard size={20} className="text-pink-400" />
                                </div>
                                <div className="text-3xl font-bold text-primary mb-1">{credits.toLocaleString()}</div>
                                <div className="text-xs text-slate-500 flex justify-between items-center">
                                    <span>Available balance</span>
                                    <button 
                                        onClick={() => {
                                            const newBal = credits + 2000;
                                            setCredits(newBal);
                                            localStorage.setItem('auratral_credits_balance', String(newBal));
                                            window.dispatchEvent(new Event('auratral_credits_updated'));
                                            alert("Added 2,000 Credits to your mock sandbox pool!");
                                        }}
                                        className="text-pink-400 hover:underline hover:text-pink-300 font-bold ml-1.5"
                                    >
                                        + Top Up
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Main Content Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                            {/* Left Column: Datasets & API */}
                            <div className="lg:col-span-2 space-y-8">

                                {/* Provisioned Runtimes */}
                                <div className="glass-panel p-8">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                                            <Database size={20} className="text-purple-400" /> Active Compute Workspaces
                                        </h2>
                                    </div>

                                    <div className="space-y-4">
                                        {loadingPurchases ? (
                                            <div className="text-center py-12">
                                                <div className="inline-flex w-10 h-10 rounded-full border-2 border-purple-500/30 border-t-purple-500 animate-spin mb-2"></div>
                                                <p className="text-slate-400 text-xs">Syncing runtimes registry...</p>
                                            </div>
                                        ) : activeDatasets.length === 0 ? (
                                            <div className="text-center py-12 border border-dashed border-slate-700/50 rounded-xl">
                                                <Database className="mx-auto text-slate-600 mb-3" size={40} />
                                                <p className="text-slate-400 text-sm mb-4">No active compute workspaces launched yet.</p>
                                                <Link to="/gallery" className="btn btn-primary text-xs py-2.5 px-4 inline-flex items-center gap-2">
                                                    Browse Gallery <ArrowRight size={14} />
                                                </Link>
                                            </div>
                                        ) : (
                                            activeDatasets.map((ds, idx) => (
                                                <div key={idx} className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-purple-500/50 transition-colors group">
                                                    <div className="cursor-pointer flex-grow" onClick={() => { setDetailsDataset(ds); setDetailsModalOpen(true); }}>
                                                        <div className="text-xs font-mono text-slate-400 mb-1 group-hover:text-purple-400 transition-colors">{ds.id}</div>
                                                        <h3 className="font-bold text-primary hover:underline decoration-purple-500/50 underline-offset-4 font-sans">{ds.name}</h3>
                                                        <div className="text-xs text-slate-400 mt-1.5 flex flex-wrap gap-x-4 gap-y-1">
                                                            <span>Specs: <strong className="text-slate-300">{ds.instanceTier}</strong></span>
                                                            <span>Environment: <strong className="text-slate-300">{ds.envType.split(' ')[0]}</strong></span>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 shrink-0">
                                                        <button 
                                                            onClick={() => setSelectedWorkspace(ds)}
                                                            className="btn btn-primary py-1.5 px-4 text-xs font-semibold flex items-center gap-1"
                                                        >
                                                            <Code size={13} /> Launch IDE
                                                        </button>
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

                                {/* Simulated API Endpoints */}
                                <div className="glass-panel p-8">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                                            <Key size={20} className="text-blue-400" /> Sandboxed API Keys
                                        </h2>
                                        <button className="btn btn-primary py-1.5 px-4 text-xs">Generate Sandbox Key</button>
                                    </div>

                                    <div className="bg-black/20 border border-white/10 rounded-lg overflow-hidden">
                                        <table className="w-full text-left text-sm font-sans">
                                            <thead className="bg-slate-800/80 border-b border-slate-700">
                                                <tr>
                                                    <th className="px-6 py-4 font-semibold text-slate-300">Name</th>
                                                    <th className="px-6 py-4 font-semibold text-slate-300">Created</th>
                                                    <th className="px-6 py-4 font-semibold text-slate-300">Last Used</th>
                                                    <th className="px-6 py-4 text-right"></th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-700/50 text-slate-300 font-mono text-xs">
                                                <tr>
                                                    <td className="px-6 py-4 font-medium font-sans">ICU Sandbox Key</td>
                                                    <td className="px-6 py-4 text-slate-400">Oct 12, 2026</td>
                                                    <td className="px-6 py-4 text-slate-400">2 mins ago</td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button className="text-slate-400 hover:text-white"><Settings size={16} /></button>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Activity Feed */}
                            <div className="space-y-8">
                                <div className="glass-panel p-8">
                                    <h2 className="text-xl font-bold text-primary mb-6">Workspace Activity</h2>
                                    <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-slate-700/50">
                                        {recentActivity.map((log, idx) => (
                                            <div key={idx} className="relative flex items-start pl-8 md:pl-0">
                                                <div className="absolute left-0 md:left-1/2 w-4 h-4 rounded-full bg-purple-500 border-2 border-primary -translate-x-1.5 md:-translate-x-2 mt-1 z-10 shadow-lg shadow-purple-500/50"></div>
                                                <div className="md:w-1/2 md:pr-8 md:text-right hidden md:block">
                                                    <div className="text-xs text-slate-500 font-semibold">{log.time}</div>
                                                </div>
                                                <div className="md:w-1/2 md:pl-8 w-full block">
                                                    <div className="text-xs text-slate-500 font-semibold block md:hidden mb-1">{log.time}</div>
                                                    <h4 className="font-bold text-sm text-primary font-sans">{log.action}</h4>
                                                    <p className="text-xs text-slate-400 mt-1">{log.detail}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-purple-900/40 to-slate-900 border border-purple-500/30 rounded-xl p-8 relative overflow-hidden">
                                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-500/20 blur-2xl rounded-full"></div>
                                    <h3 className="font-bold text-primary mb-2 relative z-10 font-sans">Need a customized container?</h3>
                                    <p className="text-sm text-slate-400 mb-6 relative z-10 font-sans">Our DevOps engineers can pre-install specialized bioinformatics or neurology Python/R pipelines for you.</p>
                                    <Link to="/custom-request" className="btn bg-white text-slate-900 hover:bg-slate-200 w-full py-2.5 text-sm relative z-10 font-sans font-bold">
                                        Submit Pipeline Request
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
                        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-800/20">
                            <div>
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Settings className="text-purple-400" size={24} />
                                    Manage Compute Upgrades
                                </h2>
                                <p className="text-sm text-slate-400 mt-1">
                                    <span className="font-mono text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded">{managingDataset.id}</span>
                                    <span className="ml-2 font-sans">{managingDataset.name}</span>
                                </p>
                            </div>
                            <button
                                onClick={() => { setManageModalOpen(false); setManagingDataset(null); }}
                                className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto custom-scrollbar font-sans">
                            <h3 className="text-lg font-semibold text-primary mb-4">Request Feature Add-ons</h3>
                            <p className="text-sm text-slate-400 mb-6 font-sans">Add persistence, premium support, or GPU runtimes directly into your active container instance workspace.</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {ADDONS.map((addon) => (
                                    <div key={addon.id} className="bg-slate-800/40 border border-slate-700 rounded-xl p-4 flex flex-col">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-bold text-white leading-tight font-sans">{addon.name}</h4>
                                            <span className="text-xs font-semibold text-purple-400 bg-purple-400/10 px-2 py-1 rounded shrink-0">{addon.price}</span>
                                        </div>
                                        <p className="text-xs text-slate-400 mb-4 flex-grow font-sans">{addon.desc}</p>
                                        
                                        <div className="mt-auto pt-4">
                                            {addonState[addon.id] === 'paid' ? (
                                                <button disabled className="w-full py-2 rounded-lg text-sm font-semibold flex justify-center items-center gap-2 bg-green-500/10 text-green-400 border border-green-500/30">
                                                    <Check size={16} /> Paid & Provisioning
                                                </button>
                                            ) : addonState[addon.id] === 'authorized' ? (
                                                <button 
                                                    onClick={() => handlePayAddon(addon)}
                                                    className="w-full py-2 rounded-lg text-sm font-semibold flex justify-center items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-900 shadow-lg shadow-amber-500/20"
                                                >
                                                    <CreditCard size={16} /> Deduct & Activate
                                                </button>
                                            ) : addonState[addon.id] === 'requested' ? (
                                                <button disabled className="w-full py-2 rounded-lg text-sm font-semibold flex justify-center items-center gap-2 bg-slate-700/50 text-slate-400 border border-slate-600">
                                                    <Activity size={16} className="animate-spin-slow" /> Awaiting Ethics Board...
                                                </button>
                                            ) : (
                                                <button 
                                                    onClick={() => handleRequestAddon(addon)}
                                                    className="w-full py-2 rounded-lg text-sm font-semibold flex justify-center items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white"
                                                >
                                                    <Plus size={16} /> Request Upgrade
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
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl font-sans">
                        <div className="p-6 border-b border-slate-800 flex justify-between items-start bg-slate-800/20 shrink-0">
                            <div>
                                <span className="font-mono text-xs text-purple-400 bg-purple-400/10 px-2 py-0.5 rounded border border-purple-500/20">{detailsDataset.id}</span>
                                <h2 className="text-2xl font-bold text-white mt-3 mb-1 font-sans">
                                    {detailsDataset.name}
                                </h2>
                                <p className="text-sm text-slate-400 flex flex-wrap items-center gap-4 mt-2">
                                    <span className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                                        License: <span className="font-semibold text-slate-300">Active</span>
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

                        <div className="p-6 overflow-y-auto flex-1 relative font-sans">
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
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-4 flex flex-col justify-between">
                                    <div>
                                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Compute Environment</p>
                                        <p className="font-semibold text-white font-mono text-xs">{detailsDataset.envType}</p>
                                    </div>
                                    <button 
                                        className="mt-4 w-full btn btn-primary py-2 px-3 text-xs flex justify-center items-center gap-2"
                                        onClick={() => { setDetailsModalOpen(false); setSelectedWorkspace(detailsDataset); }}
                                    >
                                        <Code size={14} /> Launch IDE Workspace
                                    </button>
                                </div>
                                <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-4 flex flex-col justify-between">
                                    <div>
                                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">License Type</p>
                                        <p className="font-semibold text-white font-sans">{detailsDataset.license}</p>
                                    </div>
                                    <button 
                                        className="mt-4 w-full btn btn-outline py-2 px-3 text-xs flex justify-center items-center gap-2 border-slate-600 hover:border-purple-400 hover:text-purple-400 transition-colors"
                                        onClick={() => alert(`Retrieving signed IRB DUA agreement details for ${detailsDataset.name}...`)}
                                    >
                                        <FileText size={14} /> View Signed DUA
                                    </button>
                                </div>
                            </div>

                            <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-5 flex items-start gap-4">
                                <Activity className="text-indigo-400 shrink-0 mt-0.5" size={20} />
                                <div>
                                    <h4 className="font-bold text-indigo-400 mb-1">Sandbox License Expiry</h4>
                                    <p className="text-sm text-indigo-200/80 mb-2">Workspace licenses are active for a 1-year period from purchase date, and must be renewed annually.</p>
                                    <p className="font-mono text-lg font-bold text-white tracking-wide">{detailsDataset.expiry}</p>
                                </div>
                            </div>

                            {/* License Extension Selection - Year Wise */}
                            <div className="mt-6 border-t border-slate-700/50 pt-6">
                                <h4 className="text-sm font-bold text-slate-300 mb-4">Renew Workspace License Period</h4>
                                <div className="grid grid-cols-3 gap-2">
                                    {[1, 2, 3].map(yr => (
                                        <button 
                                            key={yr}
                                            onClick={() => setExtensionYears(yr)}
                                            className={`py-2 flex flex-col items-center justify-center rounded-lg text-sm font-semibold transition-all ${extensionYears === yr ? 'bg-purple-500/20 border border-purple-500/50 text-purple-400' : 'bg-slate-800/40 border border-slate-700 text-slate-400 hover:text-slate-300 hover:border-slate-600'}`}
                                        >
                                            <span className="text-lg leading-none mb-1">{yr}</span> 
                                            <span className="text-[10px] uppercase tracking-wider">{yr === 1 ? 'Year' : 'Years'}</span>
                                        </button>
                                    ))}
                                </div>
                                <div className="flex justify-between items-end mt-4 px-1">
                                    <div className="text-sm text-slate-400">Rate: {detailsDataset.price} Credits / Year</div>
                                    <div className="text-2xl font-bold text-white">Total: <span className="text-purple-400">{(extensionYears * detailsDataset.price).toLocaleString()} Credits</span></div>
                                </div>
                            </div>

                            {detailsDataset.category === 'Imaging' && (
                                <div className="mt-6 border-t border-slate-700/50 pt-6">
                                    <h4 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2">
                                        <Database size={16} className="text-indigo-400" /> Patient Image Scan Previews
                                    </h4>
                                    <p className="text-xs text-slate-400 mb-4 font-sans">Review DICOM headers for sample de-identified patient scans loaded in the compute sandbox environment.</p>
                                    
                                    <div className="grid grid-cols-2 gap-2">
                                        {(() => {
                                            const sampleRows = GET_SAMPLE_DATA('Imaging');
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
                                                        <div className="text-[10px] text-slate-500 mt-0.5">{row.scan_modality} • {row.finding_label}</div>
                                                    </div>
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
                                    const cost = extensionYears * detailsDataset.price;
                                    if (credits < cost) {
                                        alert("Insufficient credits in pool to renew license!");
                                        return;
                                    }
                                    deductCredits(cost);
                                    // Update expiry date by adding years
                                    const dateArr = detailsDataset.expiry.split('/');
                                    const nextYr = Number(dateArr[2] || new Date().getFullYear()) + extensionYears;
                                    detailsDataset.expiry = `${dateArr[0]}/${dateArr[1]}/${nextYr}`;
                                    setDetailsModalOpen(false); 
                                    alert(`Workspace license successfully renewed for ${extensionYears} Year(s)! ${cost} Credits debited.`);
                                }}
                                className="btn btn-primary py-2.5 px-6 shadow-lg shadow-purple-500/20 flex gap-2 items-center font-bold"
                            >
                                <RotateCcw size={16} /> Renew Sandbox License
                            </button>
                            <button 
                                onClick={() => { setDetailsModalOpen(false); setDetailsDataset(null); setShowCitation(false); setExtensionYears(1); }}
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
    <div className="glass-panel p-8 font-sans">
        <h2 className="text-2xl font-bold text-primary mb-2 flex items-center gap-3">
            <FileText className="text-orange-400" /> Executed Agreements & DUAs
        </h2>
        <p className="text-slate-400 mb-8 border-b border-slate-800 pb-6 font-sans">Review your legal clearance certificates, signed DUAs, and ethics clearances.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5 flex justify-between items-center hover:border-orange-500/30 transition-colors">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-400/10 rounded-lg text-purple-400"><File size={24} /></div>
                    <div>
                        <h4 className="font-bold text-primary font-sans">Compute Isolation NDA - AUR-EHR-101.pdf</h4>
                        <div className="text-xs text-slate-400 font-sans">Signed 2 hours ago • 840 KB</div>
                    </div>
                </div>
                <button onClick={() => alert("Downloading signed NDA compliance PDF...")} className="text-slate-400 hover:text-white"><Download size={20} /></button>
            </div>

            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5 flex justify-between items-center hover:border-orange-500/30 transition-colors">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-400/10 rounded-lg text-emerald-400"><File size={24} /></div>
                    <div>
                        <h4 className="font-bold text-primary font-sans">IRB Approval Declaration - AUR-EHR-101.pdf</h4>
                        <div className="text-xs text-slate-400 font-sans">Approved yesterday • 412 KB</div>
                    </div>
                </div>
                <button onClick={() => alert("Downloading IRB Declaration PDF...")} className="text-slate-400 hover:text-white"><Download size={20} /></button>
            </div>
        </div>
    </div>
);

export default Dashboard;
