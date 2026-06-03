import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Database, Activity, CheckCircle2, Upload, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
    const navigate = useNavigate();
    const { user, loading: authLoading, loginWithEmail, loginWithGoogle, loginWithGithub } = useAuth();
    const [role, setRole] = useState('consumer');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user && !authLoading) {
            navigate(user.role === 'provider' ? '/provider-dashboard' : '/dashboard', { replace: true });
        }
    }, [user, authLoading, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            await loginWithEmail(email, password);
        } catch (err) {
            console.error("Sign-in error:", err);
            let message = "Failed to sign in. Please verify your credentials.";
            if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
                message = "Invalid email or password.";
            } else if (err.code === 'auth/invalid-credential') {
                message = "Invalid login credentials.";
            } else if (err.code === 'auth/invalid-email') {
                message = "The email address is badly formatted.";
            }
            setError(message);
            setLoading(false);
        }
    };

    const handleSocialLogin = async (loginMethod) => {
        setError(null);
        setLoading(true);
        try {
            await loginMethod(role);
        } catch (err) {
            console.error("Social login error:", err);
            setError(err.message || "An error occurred during social login.");
            setLoading(false);
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f0518] text-white">
                <div className="glass-panel p-8 max-w-sm w-full mx-4 flex flex-col items-center justify-center text-center space-y-4 border-t-2 border-t-purple-500/50">
                    <div className="relative animate-pulse">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
                    </div>
                </div>
            </div>
        );
    }

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
                    <div className="flex bg-slate-800/50 p-1 rounded-lg border border-slate-700/50 mb-6">
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

                    {error && (
                        <div className="mb-6 flex items-start gap-3 bg-red-500/10 border border-red-500/30 p-4 rounded-xl text-red-400 animate-in fade-in slide-in-from-top-2">
                            <AlertCircle size={18} className="shrink-0 mt-0.5" />
                            <div className="text-sm font-medium">{error}</div>
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Institutional Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3.5 text-primary outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-inner"
                                placeholder="researcher@university.edu"
                                disabled={loading}
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
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3.5 text-primary outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-inner"
                                placeholder="••••••••"
                                disabled={loading}
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full btn btn-primary py-3.5 justify-center text-sm tracking-wide mt-4 shadow-lg shadow-blue-500/20 disabled:opacity-50"
                        >
                            {loading ? "Signing in..." : "Sign In to Console"}
                        </button>
                    </form>

                    {/* Or Continue With divider */}
                    <div className="relative flex py-6 items-center">
                        <div className="flex-grow border-t border-glass-border"></div>
                        <span className="flex-shrink mx-4 text-slate-500 text-xs font-semibold uppercase tracking-wider">Or continue with</span>
                        <div className="flex-grow border-t border-glass-border"></div>
                    </div>

                    {/* Social Login Buttons */}
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => handleSocialLogin(loginWithGoogle)}
                            disabled={loading}
                            className="flex items-center justify-center gap-2 bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700 hover:border-slate-500 rounded-lg py-3 text-slate-200 hover:text-white transition-all shadow-inner font-semibold text-sm disabled:opacity-50"
                        >
                            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                            </svg>
                            Google
                        </button>
                        <button
                            type="button"
                            onClick={() => handleSocialLogin(loginWithGithub)}
                            disabled={loading}
                            className="flex items-center justify-center gap-2 bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700 hover:border-slate-500 rounded-lg py-3 text-slate-200 hover:text-white transition-all shadow-inner font-semibold text-sm disabled:opacity-50"
                        >
                            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.193 22 16.44 22 12.017 22 6.484 17.522 2 12 2z" />
                            </svg>
                            GitHub
                        </button>
                    </div>

                    <div className="mt-8 pt-8 border-t border-glass-border text-center text-sm text-slate-400">
                        Don't have an account? <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">Create an account</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const Signup = () => {
    const navigate = useNavigate();
    const { user, loading: authLoading, signupWithEmail, loginWithGoogle, loginWithGithub } = useAuth();
    const [role, setRole] = useState('consumer');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isStudent, setIsStudent] = useState(false);
    const [verificationMethod, setVerificationMethod] = useState('email');
    const [isVerified, setIsVerified] = useState(false);
    const [verificationSent, setVerificationSent] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user && !authLoading) {
            navigate(user.role === 'provider' ? '/provider-dashboard' : '/dashboard', { replace: true });
        }
    }, [user, authLoading, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isStudent && !isVerified) {
            alert("Please complete the student verification to proceed.");
            return;
        }
        setError(null);
        setLoading(true);
        try {
            const rawName = `${firstName} ${lastName}`.trim() || 'New User';
            const fullName = rawName
                .split(' ')
                .filter(Boolean)
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' ');
            await signupWithEmail(email, password, fullName, role);
        } catch (err) {
            console.error("Sign-up error:", err);
            let message = "Failed to create account. Please try again.";
            if (err.code === 'auth/email-already-in-use') {
                message = "An account already exists with this email address.";
            } else if (err.code === 'auth/weak-password') {
                message = "The password is too weak (must be at least 6 characters).";
            } else if (err.code === 'auth/invalid-email') {
                message = "The email address is badly formatted.";
            }
            setError(message);
            setLoading(false);
        }
    };

    const handleSocialLogin = async (loginMethod) => {
        setError(null);
        setLoading(true);
        try {
            await loginMethod(role);
        } catch (err) {
            console.error("Social signup error:", err);
            setError(err.message || "An error occurred during social registration.");
            setLoading(false);
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f0518] text-white">
                <div className="glass-panel p-8 max-w-sm w-full mx-4 flex flex-col items-center justify-center text-center space-y-4 border-t-2 border-t-purple-500/50">
                    <div className="relative animate-pulse">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
                    </div>
                </div>
            </div>
        );
    }


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
                    <div className="flex bg-slate-800/50 p-1 rounded-lg border border-slate-700/50 mb-6">
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

                    {error && (
                        <div className="mb-6 flex items-start gap-3 bg-red-500/10 border border-red-500/30 p-4 rounded-xl text-red-400 animate-in fade-in slide-in-from-top-2">
                            <AlertCircle size={18} className="shrink-0 mt-0.5" />
                            <div className="text-sm font-medium">{error}</div>
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">First Name</label>
                                <input
                                    type="text"
                                    required
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3.5 text-primary outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all shadow-inner"
                                    disabled={loading}
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
                                    disabled={loading}
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
                                                disabled={isVerified || loading}
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
                                    disabled={loading}
                                />
                                <p className="text-[10px] text-slate-500 mt-1.5">Please use your institutional or company email domain.</p>
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3.5 text-primary outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all shadow-inner"
                                placeholder="••••••••"
                                disabled={loading}
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full btn btn-primary py-3.5 justify-center text-sm tracking-wide mt-6 shadow-lg shadow-purple-500/20 disabled:opacity-50"
                        >
                            {loading ? "Creating Account..." : "Create Account"}
                        </button>

                        <p className="text-center text-xs text-slate-500 mt-4 leading-relaxed">
                            By creating an account, you agree to Auratral's <a href="#" className="text-purple-400 hover:underline">Terms of Service</a> and <a href="#" className="text-purple-400 hover:underline">Privacy Policy</a>.
                        </p>
                    </form>

                    {/* Or Continue With divider */}
                    <div className="relative flex py-6 items-center">
                        <div className="flex-grow border-t border-glass-border"></div>
                        <span className="flex-shrink mx-4 text-slate-500 text-xs font-semibold uppercase tracking-wider">Or continue with</span>
                        <div className="flex-grow border-t border-glass-border"></div>
                    </div>

                    {/* Social Login Buttons */}
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => handleSocialLogin(loginWithGoogle)}
                            disabled={loading}
                            className="flex items-center justify-center gap-2 bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700 hover:border-slate-500 rounded-lg py-3 text-slate-200 hover:text-white transition-all shadow-inner font-semibold text-sm disabled:opacity-50"
                        >
                            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                            </svg>
                            Google
                        </button>
                        <button
                            type="button"
                            onClick={() => handleSocialLogin(loginWithGithub)}
                            disabled={loading}
                            className="flex items-center justify-center gap-2 bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700 hover:border-slate-500 rounded-lg py-3 text-slate-200 hover:text-white transition-all shadow-inner font-semibold text-sm disabled:opacity-50"
                        >
                            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.193 22 16.44 22 12.017 22 6.484 17.522 2 12 2z" />
                            </svg>
                            GitHub
                        </button>
                    </div>

                    <div className="mt-8 pt-8 border-t border-glass-border text-center text-sm text-slate-400">
                        Already have an account? <Link to="/login" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">Log in here</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
