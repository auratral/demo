import React from 'react';
import { HashRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import { AuthProvider } from './context/AuthContext';

// Page Imports
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import DatasetDetail from './pages/DatasetDetail';
import CustomRequest from './pages/CustomRequest';
import News from './pages/News';
import NewsArticle from './pages/NewsArticle';
import { Customize, Agreement, Checkout } from './pages/CheckoutFlow';
import { Login, Signup } from './pages/Auth';
import Dashboard from './pages/Dashboard';
import ProviderDashboard from './pages/ProviderDashboard';

function App() {
    const { scrollY } = useScroll();
    // Parallax effect: moves up at 20% the speed of normal scroll
    const bgY = useTransform(scrollY, [0, 5000], [0, -1000]);

    return (
        <AuthProvider>
            <HashRouter>
                <motion.div
                    className="fixed inset-0 -z-50 w-full opacity-60 pointer-events-none"
                    style={{
                        backgroundImage: `url('${import.meta.env.BASE_URL}subtle_bg_pattern.png')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center top',
                        backgroundRepeat: 'repeat-y',
                        height: '200vh',
                        y: bgY
                    }}
                />
                <div className="flex flex-col min-h-screen relative z-0">
                    <Navbar />

                    <main className="flex-grow">
                        <Routes>
                            {/* Core Application Flow */}
                            <Route path="/" element={<Home />} />

                            {/* Gallery & Products */}
                            <Route path="/gallery" element={<Gallery />} />
                            <Route path="/dataset/:id" element={<DatasetDetail />} />
                            <Route path="/custom-request" element={<CustomRequest />} />

                            {/* Checkout Flow */}
                            <Route path="/customize" element={<Customize />} />
                            <Route path="/agreement" element={<Agreement />} />
                            <Route path="/checkout" element={<Checkout />} />

                            {/* Informational Pages */}
                            <Route path="/news" element={<News />} />
                            <Route path="/news/:id" element={<NewsArticle />} />

                            {/* Authentication & Dashboard */}
                            <Route path="/login" element={<Login />} />
                            <Route path="/signup" element={<Signup />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/provider-dashboard" element={<ProviderDashboard />} />

                            {/* 404 Catch-all */}
                            <Route path="*" element={
                                <div className="pt-32 pb-24 min-h-screen flex items-center justify-center px-8">
                                    <div className="glass-panel p-12 text-center max-w-xl w-full border-t-4 border-t-red-500">
                                        <div className="text-6xl mb-6">🔍</div>
                                        <h2 className="text-3xl font-bold text-primary mb-4">404 - Page Not Found</h2>
                                        <p className="text-secondary mb-8">
                                            We couldn't find the dataset or page you were looking for. It may have been moved or removed.
                                        </p>
                                        <a href="/" className="btn btn-outline inline-block">Return Home</a>
                                    </div>
                                </div>
                            } />
                        </Routes>
                    </main>

                    {/* Global Demo Environment Warning Badge */}
                    <div className="fixed bottom-6 left-6 z-50 pointer-events-none hidden md:block">
                        <div className="bg-slate-900/80 backdrop-blur-md border border-purple-500/30 px-4 py-3 rounded-2xl shadow-2xl flex items-start gap-3 max-w-xs pointer-events-auto transition-all hover:border-purple-500/60 hover:bg-slate-900/95">
                            <AlertTriangle size={18} className="text-purple-400 mt-0.5 shrink-0" />
                            <div>
                                <div className="text-xs font-bold text-slate-200 mb-0.5 tracking-wide">DEMO ENVIRONMENT</div>
                                <div className="text-[11px] text-slate-400 leading-relaxed font-medium">
                                    All datasets, capabilities, and clinical metrics are for demonstration purposes only.
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Mobile optimized version - centered at bottom */}
                    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-sm z-50 pointer-events-none md:hidden">
                        <div className="bg-slate-900/90 backdrop-blur-xl border border-purple-500/40 px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-3 pointer-events-auto">
                            <AlertTriangle size={16} className="text-purple-400 shrink-0" />
                            <div className="text-[10px] text-slate-300 leading-tight font-medium">
                                <span className="font-bold text-slate-200 mr-1">Demo Platform:</span>
                                Data is for demonstration only.
                            </div>
                        </div>
                    </div>

                    <Footer />
                </div>
            </HashRouter>
        </AuthProvider>
    );
}

export default App;
