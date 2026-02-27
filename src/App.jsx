import React from 'react';
import { HashRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
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
                        backgroundImage: "url('/subtle_bg_pattern.png')",
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

                    <Footer />
                </div>
            </HashRouter>
        </AuthProvider>
    );
}

export default App;
