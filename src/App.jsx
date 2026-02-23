import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';

// Page Imports
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import DatasetDetail from './pages/DatasetDetail';
import CustomRequest from './pages/CustomRequest';
import Testimonials from './pages/Testimonials';
import News from './pages/News';
import { Customize, Agreement, Checkout } from './pages/CheckoutFlow';
import { Login, Signup } from './pages/Auth';
import Dashboard from './pages/Dashboard';

function App() {
    return (
        <BrowserRouter>
            <div className="flex flex-col min-h-screen">
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
                        <Route path="/news/:id" element={<News />} /> {/* Hack to catch news article links for demo */}
                        <Route path="/testimonials" element={<Testimonials />} />

                        {/* Authentication & Dashboard */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/dashboard" element={<Dashboard />} />

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
        </BrowserRouter>
    );
}

export default App;
