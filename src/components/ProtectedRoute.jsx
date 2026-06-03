import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center relative bg-[#0f0518] text-white">
                {/* Glow spots */}
                <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
                
                {/* Premium Loading Glass Panel */}
                <div className="glass-panel p-8 max-w-sm w-full mx-4 flex flex-col items-center justify-center text-center space-y-4 border-t-2 border-t-purple-500/50">
                    <div className="relative">
                        <Loader2 className="h-10 w-10 text-purple-400 animate-spin" />
                        <div className="absolute inset-0 bg-purple-500/20 blur-md rounded-full -z-10" />
                    </div>
                    <div>
                        <h4 className="font-bold text-lg text-primary tracking-wide">Auratral Console</h4>
                        <p className="text-xs text-slate-400 mt-1">Verifying your secure session...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect user based on their actual role to avoid infinite redirection loops
        const redirectPath = user.role === 'provider' ? '/provider-dashboard' : '/dashboard';
        return <Navigate to={redirectPath} replace />;
    }

    return children;
};

export default ProtectedRoute;
