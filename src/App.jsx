import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';

const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
};
import { AlertTriangle } from 'lucide-react';
import UnicornScene from 'unicornstudio-react';
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
import Pricing from './pages/Pricing';

function App() {
    const { scrollY } = useScroll();
    // Parallax effect: moves up at 20% the speed of normal scroll
    const bgY = useTransform(scrollY, [0, 5000], [0, -1000]);

    // Remove UnicornStudio watermark that gets dynamically injected by the SDK
    useEffect(() => {
        const removeWatermark = () => {
            // Target all possible watermark elements
            const selectors = [
                'a[href*="unicorn.studio"]',
                'a[href*="unicornstudio"]',
                'img[src*="made_in_us"]',
                'img[src*="free_user_logo"]',
                'img[src*="unicorn.studio"]',
                '[data-us-watermark]',
            ];
            selectors.forEach(sel => {
                document.querySelectorAll(sel).forEach(el => {
                    // Walk up to find the closest positioned container wrapping the watermark
                    let target = el;
                    while (target.parentElement && target.parentElement !== document.body && target.parentElement.children.length <= 2) {
                        target = target.parentElement;
                    }
                    target.style.display = 'none';
                    target.style.visibility = 'hidden';
                    target.style.opacity = '0';
                    target.style.width = '0';
                    target.style.height = '0';
                    target.style.overflow = 'hidden';
                    target.style.position = 'absolute';
                    target.remove();
                });
            });
        };

        // Run after a delay to ensure SDK has loaded
        const timer1 = setTimeout(removeWatermark, 2000);
        const timer2 = setTimeout(removeWatermark, 4000);
        const timer3 = setTimeout(removeWatermark, 6000);

        // Also observe DOM mutations for dynamically injected watermarks
        const observer = new MutationObserver(() => {
            removeWatermark();
        });
        observer.observe(document.body, { childList: true, subtree: true });

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
            observer.disconnect();
        };
    }, []);

    return (
        <AuthProvider>
            <HashRouter>
                <ScrollToTop />
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

                {/* Unicorn Studio WebGL Background Scene */}
                <div className="unicorn-bg-layer">
                    <UnicornScene
                        projectId="HkHTIRutSoB70lrll2zE"
                        sdkUrl="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.1.5/dist/unicornStudio.umd.js"
                        width="100%"
                        height="100%"
                        scale={1}
                        dpi={1.5}
                    />
                </div>

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
                            <Route path="/pricing" element={<Pricing />} />

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
