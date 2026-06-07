import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Coins, Lock, CreditCard, ArrowLeft, ShieldCheck, CheckCircle2 } from 'lucide-react';

const BuyCredits = () => {
    const navigate = useNavigate();
    const [credits, setCredits] = useState(1000);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    // Mock Card State
    const [cardName, setCardName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cardCvv, setCardCvv] = useState('');

    const exchangeRate = 10; // 1 Credit = 10 INR
    const totalAmount = credits * exchangeRate;

    const handleCardNumberChange = (e) => {
        let value = e.target.value.replace(/\D/g, '');
        // Limit to 16 digits
        value = value.substring(0, 16);
        // Format with spaces
        const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
        setCardNumber(formatted);
    };

    const handleExpiryChange = (e) => {
        let value = e.target.value.replace(/\D/g, '');
        value = value.substring(0, 4);
        if (value.length > 2) {
            value = value.substring(0, 2) + '/' + value.substring(2);
        }
        setCardExpiry(value);
    };

    const handleCvvChange = (e) => {
        const value = e.target.value.replace(/\D/g, '').substring(0, 3);
        setCardCvv(value);
    };

    const handlePurchase = (e) => {
        e.preventDefault();
        if (credits <= 0) {
            alert('Please select a valid credit amount.');
            return;
        }

        setSubmitting(true);

        setTimeout(() => {
            // Update balance in localStorage
            const localBal = localStorage.getItem('auratral_credits_balance');
            const currentBal = localBal ? Number(localBal) : 12500;
            const newBal = currentBal + Number(credits);
            localStorage.setItem('auratral_credits_balance', String(newBal));

            // Log Transaction in history
            const txHistory = JSON.parse(localStorage.getItem('auratral_credits_history') || '[]');
            const newTx = {
                id: Date.now(),
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
                type: 'credit',
                desc: `Bought ${Number(credits).toLocaleString()} Compute Credits`,
                amount: Number(credits)
            };
            txHistory.unshift(newTx);
            localStorage.setItem('auratral_credits_history', JSON.stringify(txHistory));

            // Dispatch event to sync navbar/header immediately
            window.dispatchEvent(new Event('auratral_credits_updated'));

            setSuccess(true);
            setSubmitting(false);
        }, 1500);
    };

    const selectPackage = (amt) => {
        setCredits(amt);
    };

    if (success) {
        return (
            <div className="pt-32 pb-24 min-h-screen flex items-center justify-center px-4 font-sans text-white">
                <div className="glass-panel max-w-md w-full p-8 text-center border border-green-500/30 shadow-2xl shadow-green-500/5">
                    <div className="w-16 h-16 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 size={32} className="text-green-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-primary mb-2">Payment Successful!</h1>
                    <p className="text-slate-400 text-sm mb-6">
                        We have allocated <span className="text-purple-400 font-bold font-mono">{Number(credits).toLocaleString()} Credits</span> to your account.
                    </p>
                    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 mb-8 text-xs font-mono text-left space-y-2">
                        <div className="flex justify-between">
                            <span className="text-slate-500">Transaction ID:</span>
                            <span className="text-slate-300">TX-{Date.now().toString().substring(5)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Amount Paid:</span>
                            <span className="text-slate-300">₹{totalAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Balance:</span>
                            <span className="text-green-400 font-bold">
                                {Number(localStorage.getItem('auratral_credits_balance')).toLocaleString()} Cr
                            </span>
                        </div>
                    </div>
                    <button onClick={() => navigate('/dashboard')} className="w-full btn btn-primary py-3">
                        Go to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-32 pb-24 min-h-screen font-sans text-white relative">
            <div className="container mx-auto px-8 max-w-[1400px]">
                {/* Back Link */}
                <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors text-xs font-semibold mb-8">
                    <ArrowLeft size={14} /> Back to Dashboard
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Left Column: Credit Calculator */}
                    <div className="space-y-8">
                        <div>
                            <h1 className="text-3xl font-extrabold text-primary mb-2">Top Up Compute Credits</h1>
                            <p className="text-slate-400 text-sm">Purchase credits to deploy isolated workspaces and run clinical simulations.</p>
                        </div>

                        {/* Credits Input */}
                        <div className="glass-panel p-6 border border-slate-700/50">
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Enter Credits Needed</label>
                            <div className="flex items-center gap-4 bg-slate-950/80 border border-slate-800 rounded-xl p-3 mb-6 focus-within:border-purple-500/50 transition-all">
                                <Coins size={20} className="text-purple-400 ml-1 shrink-0" />
                                <input
                                    type="number"
                                    min="100"
                                    step="100"
                                    value={credits}
                                    onChange={(e) => setCredits(Math.max(0, Number(e.target.value)))}
                                    className="w-full bg-transparent border-none text-2xl font-bold font-mono text-primary outline-none focus:ring-0"
                                    placeholder="e.g. 1000"
                                />
                                <span className="text-slate-500 font-semibold pr-2 select-none">Credits</span>
                            </div>

                            {/* Money Conversion */}
                            <div className="flex justify-between items-end border-t border-slate-800/80 pt-4 mb-6">
                                <span className="text-xs text-slate-400">Total Money Value (1 Cr = ₹10)</span>
                                <span className="text-3xl font-extrabold text-gradient">₹{totalAmount.toLocaleString()}</span>
                            </div>

                            {/* Preset Packages */}
                            <div className="space-y-3">
                                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Quick Select Tiers</div>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { label: '+500 Cr', desc: '₹5,000', amt: 500 },
                                        { label: '+1,500 Cr', desc: '₹15,000', amt: 1500 },
                                        { label: '+5,000 Cr', desc: '₹50,000', amt: 5000 }
                                    ].map((pkg) => (
                                        <button
                                            key={pkg.label}
                                            onClick={() => selectPackage(pkg.amt)}
                                            className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${credits === pkg.amt ? 'bg-purple-500/10 border-purple-500 text-purple-400' : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'}`}
                                        >
                                            <div className="text-xs font-bold">{pkg.label}</div>
                                            <div className="text-[10px] opacity-80 mt-0.5">{pkg.desc}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Security Information */}
                        <div className="flex items-start gap-3 bg-slate-900/30 border border-slate-800/60 p-4 rounded-xl">
                            <ShieldCheck size={20} className="text-purple-400 mt-0.5 shrink-0" />
                            <div className="text-xs text-slate-400 leading-normal">
                                <strong className="text-slate-300 block mb-0.5">Secure Transaction Guarantee</strong>
                                All credit allocations are instantly provisioned to your local wallet cache. Billing transactions are HIPAA/SOC2 compliance audited.
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Dummy Credit Card & Billing Form */}
                    <div className="space-y-6">
                        {/* Interactive Credit Card Graphic */}
                        <div className="relative w-full aspect-[1.586/1] bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-6 shadow-2xl overflow-hidden border border-white/10 select-none">
                            <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]" />
                            <div className="absolute top-0 right-0 w-44 h-44 bg-white/5 rounded-full blur-2xl pointer-events-none" />
                            
                            <div className="relative flex flex-col justify-between h-full text-white font-mono">
                                <div className="flex justify-between items-start">
                                    <div className="text-xs uppercase tracking-widest font-bold opacity-80">Auratral Wallet Card</div>
                                    <Coins size={28} className="text-white/80 animate-pulse" />
                                </div>

                                <div className="text-xl md:text-2xl font-bold tracking-widest py-3">
                                    {cardNumber || '•••• •••• •••• ••••'}
                                </div>

                                <div className="flex justify-between items-end">
                                    <div className="space-y-0.5">
                                        <div className="text-[8px] uppercase tracking-wider opacity-60">Cardholder Name</div>
                                        <div className="text-sm font-bold truncate max-w-[180px] uppercase">
                                            {cardName || 'Dr. Sophia Patel'}
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="space-y-0.5 text-right">
                                            <div className="text-[8px] uppercase tracking-wider opacity-60">Expires</div>
                                            <div className="text-xs font-bold">{cardExpiry || 'MM/YY'}</div>
                                        </div>
                                        <div className="space-y-0.5 text-right">
                                            <div className="text-[8px] uppercase tracking-wider opacity-60">CVV</div>
                                            <div className="text-xs font-bold">{cardCvv || '•••'}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Dummy Card Billing Form */}
                        <form onSubmit={handlePurchase} className="glass-panel p-6 border border-slate-700/50 space-y-4">
                            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider border-b border-slate-800 pb-2">Dummy Billing Information</h3>
                            
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Cardholder Name</label>
                                <input
                                    required
                                    type="text"
                                    value={cardName}
                                    onChange={(e) => setCardName(e.target.value)}
                                    placeholder="Dr. Sophia Patel"
                                    className="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-4 py-2.5 text-xs text-primary placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Card Number</label>
                                <input
                                    required
                                    type="text"
                                    value={cardNumber}
                                    onChange={handleCardNumberChange}
                                    placeholder="4111 2222 3333 4444"
                                    className="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-4 py-2.5 text-xs text-primary placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-colors"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Expiry Date</label>
                                    <input
                                        required
                                        type="text"
                                        value={cardExpiry}
                                        onChange={handleExpiryChange}
                                        placeholder="MM/YY"
                                        className="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-4 py-2.5 text-xs text-primary placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-colors text-center"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">CVV Code</label>
                                    <input
                                        required
                                        type="password"
                                        maxLength="3"
                                        value={cardCvv}
                                        onChange={handleCvvChange}
                                        placeholder="•••"
                                        className="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-4 py-2.5 text-xs text-primary placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-colors text-center"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full btn btn-primary flex justify-center items-center gap-2 py-3.5 mt-2 font-bold shadow-[0_4px_20px_rgba(168,85,247,0.25)] disabled:opacity-50 transition-all"
                            >
                                <Lock size={14} />
                                {submitting ? 'Authorizing Payment Gateway...' : `Pay ₹${totalAmount.toLocaleString()} & Allocate Credits`}
                            </button>
                            <p className="text-[9px] text-slate-500 text-center">In Demo mode, no money will actually be deducted from your account.</p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BuyCredits;
