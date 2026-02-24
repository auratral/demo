import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Check for stored user on mount
        const storedUser = localStorage.getItem('auratral_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = (userData) => {
        // Add a default avatar if none provided
        const userToStore = {
            ...userData,
            avatarUrl: userData.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=random`
        };
        setUser(userToStore);
        localStorage.setItem('auratral_user', JSON.stringify(userToStore));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('auratral_user');
    };

    const updateProfilePicture = (newUrl) => {
        if (user) {
            const updatedUser = { ...user, avatarUrl: newUrl };
            setUser(updatedUser);
            localStorage.setItem('auratral_user', JSON.stringify(updatedUser));
        }
    };

    const value = {
        user,
        login,
        logout,
        updateProfilePicture
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
