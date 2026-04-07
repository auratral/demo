import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Database, Activity, CheckCircle2, Upload } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [role, setRole] = useState('consumer');
    // For demo purposes, we capture the name from the email
    const [email, setEmail] = useState('');

    return (
        <div className="min-h-screen pt-20 flex flex-col lg:flex-row font-sans">
            {/* Left Side - Visuals (Hidden on small screens) */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-black/20 backdrop-blur items-center justify-center p-12 border-r border-glass-border">
                {/* Background Glows */}
                <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px]"></div>

                {/* Visual Content */}
                <div className="relative z-10 max-w-lg">
                    <div className="glass-panel p-8 mb-8 backdrop-blur-xl border-t-2 border-t-blue-500 relative">
                        <div className="absolute -top-4 -left-4 w-8 h-8 bg-purple-500/20 shadow-lg shadow-purple-500/50 border border-white/10 rounded flex items-center justify-center">
                            <Activity size={16} className="text-blue-400" />
                        </div>
                        <h3 className="font-bold text-lg text-primary mb-2">Secure API Access</h3>
                        <p className="text-sm text-slate-400 leading-relaxed">Connect directly to our network of 150+ healthcare providers via REST or GraphQL. HIPAA & DPDP-compliant endpoints guaranteed.</p>
                    </div>

                    <div className="glass-panel p-8 backdrop-blur-xl border-t-2 border-t-purple-500 ml-12 relative">
                        <div className="absolute -top-4 -left-4 w-8 h-8 bg-blue-500/20 shadow-lg shadow-blue-500/50 border border-white/10 rounded flex items-center justify-center">
                            <Database size={16} className="text-purple-400" />
                        </div>
                        <h3 className="font-bold text-lg text-primary mb-2">Curated Cohorts</h3>
                        <p className="text-sm text-slate-400 leading-relaxed">Search millions of de-identified patient records across EHR, Imaging, and Clinical Trials instantly. Quality scoring applied to every dataset.</p>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex items-center justify-center p-8 lg:p-12 relative bg-transparent">
                <div className="w-full max-w-md relative z-10">

                    <div className="text-center lg:text-left mb-8">
                        <Link to="/" className="inline-block mb-8">
                            <img src={`${import.meta.env.BASE_URL}logo.png`} alt="Auratral" className="h-12 w-auto mx-auto lg:mx-0" />
                        </Link>
                        <h1 className="text-3xl font-bold text-primary mb-3">
                            {role === 'consumer' ? 'Welcome back' : 'Provider Portal'}
                        </h1>
                        <p className="text-slate-400">
                            {role === 'consumer' ? 'Log in to manage your datasets, API keys, and billing.' : 'Log in to manage your data assets and monitor usage.'}
                        </p>
                    </div>

                    {/* Role Toggle */}
                    <div className="flex bg-slate-800/50 p-1 rounded-lg border border-slate-700/50 mb-8">
                        <button
                            type="button"
                            onClick={() => setRole('consumer')}
                            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${role === 'consumer' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'text-slate-400 hover:text-slate-300'}`}
                        >
                            Data Consumer
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole('provider')}
                            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${role === 'provider' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'text-slate-400 hover:text-slate-300'}`}
                        >
                            Data Provider
                        </button>
                    </div>

                    <form className="space-y-6" onSubmit={(e) => {
                        e.preventDefault();
                        const name = email.split('@')[0] || (role === 'consumer' ? 'Researcher' : 'Provider');
                        login({ name: name.charAt(0).toUpperCase() + name.slice(1), role, email });
                        navigate(role === 'consumer' ? '/dashboard' : '/provider-dashboard');
                    }}>
                        <div>
                            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Institutional Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3.5 text-primary outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-inner"
                                placeholder="researcher@university.edu"
                            />
                        </div>
                        <div>
                            <div className="flex justify-between items-end mb-2">
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest">Password</label>
                                <a href="#" className="text-xs text-blue-400 hover:text-blue-300 font-semibold transition-colors">Forgot password?</a>
                            </div>
                            <input
                                type="password"
                                required
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3.5 text-primary outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-inner"
                                placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                            />
                        </div>

                        <button type="submit" className="w-full btn btn-primary py-3.5 justify-center text-sm tracking-wide mt-4 shadow-lg shadow-blue-500/20">
                            Sign In to Console
                        </button>
                    </form>

                    <div className="mt-10 pt-8 border-t border-glass-border text-center text-sm text-slate-400">
                        Don't have an account? <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">Create an account</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;

export const Signup = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [role, setRole] = useState('consumer');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [isStudent, setIsStudent] = useState(false);
    const [verificationMethod, setVerificationMethod] = useState('email');
    const [isVerified, setIsVerified] = useState(false);
    const [verificationSent, setVerificationSent] = useState(false);
    return (
        <div className="min-h-screen pt-20 flex flex-col lg:flex-row-reverse font-sans">
            {/* Right Side - Visuals (Hidden on small screens) */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-black/20 backdrop-blur items-center justify-center p-12 border-l border-glass-border">
                {/* Background Glows */}
                <div className="absolute top-1/4 -right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]"></div>

                {/* Visual Content */}
                <div className="relative z-10 max-w-lg text-center">
                    <ShieldCheck size={48} className="text-purple-400 mx-auto mb-6" />
                    <h2 className="text-3xl font-bold text-primary mb-4">Enterprise-Grade Security</h2>
                    <p className="text-slate-400 text-lg leading-relaxed mb-8">
                        Join 1,000+ researchers and ML engineers accelerating healthcare innovation. Every dataset is scrutinized to meet HIPAA Safe Harbor, GDPR Article 9, and DPDP Act requirements.
                    </p>

                    <div className="grid grid-cols-2 gap-4 text-left">
                        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                            <div className="text-2xl font-bold text-blue-400 mb-1">150+</div>
                            <div className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Provider Networks</div>
                        </div>
                        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                            <div className="text-2xl font-bold text-purple-400 mb-1">40M+</div>
                            <div className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Patient Records</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Left Side - Form */}
            <div className="flex-1 flex items-center justify-center p-8 lg:p-12 relative bg-transparent">
                <div className="w-full max-w-md relative z-10">

                    <div className="text-center lg:text-left mb-8">
                        <Link to="/" className="inline-block mb-8">
                            <img src={`${import.meta.env.BASE_URL}logo.png`} alt="Auratral" className="h-12 w-auto mx-auto lg:mx-0" />
                        </Link>
                        <h1 className="text-3xl font-bold text-primary mb-3">
                            {role === 'consumer' ? 'Create your account' : 'Become a Provider'}
                        </h1>
                        <p className="text-slate-400">
                            {role === 'consumer' ? 'Start provisioning compliant medical data today.' : 'Monetize your compliant medical datasets today.'}
                        </p>
                    </div>

                    {/* Role Toggle */}
                    <div className="flex bg-slate-800/50 p-1 rounded-lg border border-slate-700/50 mb-8">
                        <button
                            type="button"
                            onClick={() => setRole('consumer')}
                            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${role === 'consumer' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'text-slate-400 hover:text-slate-300'}`}
                        >
                            Data Consumer
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole('provider')}
                            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${role === 'provider' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'text-slate-400 hover:text-slate-300'}`}
                        >
                            Data Provider
                        </button>
                    </div>

                    {role === 'consumer' && (
                        <div className="mb-6 flex items-start gap-3 bg-blue-500/5 border border-blue-500/20 p-4 rounded-xl">
                            <input 
                                type="checkbox" 
                                id="studentCheck" 
                                checked={isStudent} 
                                onChange={(e) => {
                                    setIsStudent(e.target.checked);
                                    if(e.target.checked) setRole('consumer'); // force consumer if student
                                }}
                                className="mt-1 w-4 h-4 rounded border-slate-700 bg-slate-800/50 text-purple-500 focus:ring-purple-500" 
                            />
                            <div>
                                <label htmlFor="studentCheck" className="text-sm font-semibold text-slate-200 cursor-pointer block leading-none">
                                    I am a Student / Research Scholar
                                </label>
                                <p className="text-xs text-slate-400 mt-1">Requires university email or active student ID verification.</p>
                            </div>
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={(e) => {
                        e.preventDefault();
                        if (isStudent && !isVerified) {
                            alert("Please complete the student verification to proceed.");
                            return;
                        }
                        login({ name: `${firstName} ${lastName}`.trim() || 'New User', role, email });
                        navigate(role === 'consumer' ? '/dashboard' : '/provider-dashboard');
                    }}>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">First Name</label>
                                <input
                                    type="text"
                                    required
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3.5 text-primary outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all shadow-inner"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Last Name</label>
                                <input
                                    type="text"
                                    required
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3.5 text-primary outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all shadow-inner"
                                />
                            </div>
                        </div>

                        {isStudent ? (
                            <div className="bg-slate-800/30 border border-purple-500/30 rounded-xl p-4 space-y-4">
                                <h4 className="text-sm font-bold text-purple-400 flex items-center gap-2"><ShieldCheck size={16} /> University Verification Required</h4>
                                
                                <div className="flex bg-slate-800/50 p-1 rounded-lg border border-slate-700/50">
                                    <button type="button" onClick={() => setVerificationMethod('email')} className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${verificationMethod === 'email' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'text-slate-400 hover:text-slate-300'}`}>.edu Email OTP</button>
                                    <button type="button" onClick={() => setVerificationMethod('id')} className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${verificationMethod === 'id' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'text-slate-400 hover:text-slate-300'}`}>Upload ID Card</button>
                                </div>

                                {verificationMethod === 'email' ? (
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">University Email (.edu)</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="email"
                                                required={!isVerified}
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 text-primary outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all shadow-inner"
                                                placeholder="scholar@university.edu"
                                                disabled={isVerified}
                                            />
                                            {!isVerified && (
                                                <button 
                                                    type="button" 
                                                    onClick={() => {
                                                        if(!email) return alert("Please enter email first");
                                                        setVerificationSent(true);
                                                        setTimeout(() => { setIsVerified(true); alert("OTP 6289 verified successfully!"); }, 1000);
                                                    }}
                                                    className="btn bg-slate-700 hover:bg-slate-600 px-4 py-2 text-xs shrink-0 border border-slate-600"
                                                >
                                                    {verificationSent ? "Verifying..." : "Send OTP"}
                                                </button>
                                            )}
                                        </div>
                                        {isVerified && <p className="text-xs text-green-400 mt-2 flex items-center gap-1"><CheckCircle2 size={12} /> Account Verified</p>}
                                    </div>
                                ) : (
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Upload Valid University ID</label>
                                        <div className="border-2 border-dashed border-slate-700 rounded-lg p-6 text-center hover:border-purple-500/50 transition-colors cursor-pointer bg-slate-800/40"
                                             onClick={() => {
                                                 setVerificationSent(true);
                                                 setTimeout(() => { setIsVerified(true); alert("ID Document uploaded & reviewed successfully."); }, 1200);
                                             }}
                                        >
                                            {isVerified ? (
                                                <div className="flex flex-col items-center gap-2 text-green-400">
                                                    <CheckCircle2 size={24} />
                                                    <span className="text-sm font-semibold">ID Validated</span>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center gap-2 text-slate-400">
                                                    <Upload size={24} className={verificationSent ? "animate-bounce text-purple-400" : ""} />
                                                    <span className="text-sm">{verificationSent ? "Uploading..." : "Click to browse or drop file here"}</span>
                                                    <span className="text-[10px]">JPG, PNG, PDF formats accepted</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div>
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Work Email</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3.5 text-primary outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all shadow-inner"
                                    placeholder="name@institution.edu"
                                />
                                <p className="text-[10px] text-slate-500 mt-1.5">Please use your institutional or company email domain.</p>
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Password</label>
                            <input
                                type="password"
                                required
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3.5 text-primary outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all shadow-inner"
                                placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                            />
                        </div>

                        <button type="submit" className="w-full btn btn-primary py-3.5 justify-center text-sm tracking-wide mt-6 shadow-lg shadow-purple-500/20">
                            Create Account
                        </button>

                        <p className="text-center text-xs text-slate-500 mt-4 leading-relaxed">
                            By creating an account, you agree to Auratral's <a href="#" className="text-purple-400 hover:underline">Terms of Service</a> and <a href="#" className="text-purple-400 hover:underline">Privacy Policy</a>.
                        </p>
                    </form>

                    <div className="mt-8 pt-8 border-t border-glass-border text-center text-sm text-slate-400">
                        Already have an account? <Link to="/login" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">Log in here</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
