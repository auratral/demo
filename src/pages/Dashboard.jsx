import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Database, Key, CreditCard, Activity, ArrowRight, Download, Settings, FileText, File, X, Plus, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { DATASET_REGISTRY as fallbackRegistry } from '../data/datasetsRegistry';

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
