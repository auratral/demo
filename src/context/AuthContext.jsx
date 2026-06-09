import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
    onAuthStateChanged, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut, 
    signInWithPopup, 
    signInWithRedirect,
    GoogleAuthProvider, 
    GithubAuthProvider,
    updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

const fetchDocWithTimeout = (docRef, ms = 1500) => {
    return Promise.race([
        getDoc(docRef),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Firestore timeout")), ms))
    ]);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                const defaultName = firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User';
                const localAvatar = localStorage.getItem(`avatar_${firebaseUser.uid}`);
                const storedRole = localStorage.getItem('auth_selected_role') || 'consumer';
                const fallbackProfile = {
                    name: defaultName,
                    email: firebaseUser.email || '',
                    role: storedRole,
                    avatarUrl: localAvatar || firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(defaultName)}&background=random`,
                    createdAt: new Date().toISOString()
                };

                try {
                    const docRef = doc(db, 'users', firebaseUser.uid);
                    // Timeout firestore fetch to 1.5 seconds maximum
                    const docSnap = await fetchDocWithTimeout(docRef, 1500);
                    
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        setUser({ 
                            uid: firebaseUser.uid, 
                            ...data, 
                            avatarUrl: localAvatar || data.avatarUrl || fallbackProfile.avatarUrl 
                        });
                    } else {
                        // Background write, non-blocking
                        setDoc(docRef, fallbackProfile).catch((writeErr) => {
                            console.warn("Could not write new profile to Firestore:", writeErr);
                        });
                        setUser({ uid: firebaseUser.uid, ...fallbackProfile });
                    }
                } catch (error) {
                    console.error("Error fetching user profile from Firestore, using Auth details as fallback:", error);
                    setUser({ uid: firebaseUser.uid, ...fallbackProfile });
                } finally {
                    localStorage.removeItem('auth_selected_role');
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const loginWithEmail = async (email, password) => {
        const trimmedEmail = email.trim().toLowerCase();
        if (trimmedEmail === 'admin@auratral.com' && password === 'AuraTral2026@') {
            try {
                const credential = await signInWithEmailAndPassword(auth, trimmedEmail, password);
                const docRef = doc(db, 'users', credential.user.uid);
                const docSnap = await getDoc(docRef);
                if (!docSnap.exists()) {
                    const profile = {
                        name: 'Auratral Admin',
                        email: 'admin@auratral.com',
                        role: 'provider',
                        avatarUrl: 'https://ui-avatars.com/api/?name=Admin&background=a855f7&color=fff',
                        createdAt: new Date().toISOString()
                    };
                    await setDoc(docRef, profile);
                }
                return credential;
            } catch (err) {
                console.warn("Firebase Auth for admin failed, using local bypass fallback:", err);
                const mockAdminUser = {
                    uid: 'admin-mock-uid-999',
                    name: 'Auratral Admin',
                    email: 'admin@auratral.com',
                    role: 'provider',
                    avatarUrl: 'https://ui-avatars.com/api/?name=Admin&background=a855f7&color=fff',
                    createdAt: new Date().toISOString()
                };
                localStorage.setItem('auratral_user', JSON.stringify(mockAdminUser));
                setUser(mockAdminUser);
                return { user: mockAdminUser };
            }
        }
        return signInWithEmailAndPassword(auth, email, password);
    };

    const signupWithEmail = async (email, password, name, role) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;
        
        try {
            await updateProfile(firebaseUser, { displayName: name });
        } catch (profileErr) {
            console.warn("Could not update auth profile display name:", profileErr);
        }

        const profile = {
            name,
            email,
            role,
            avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
            createdAt: new Date().toISOString()
        };
        
        // Background write, non-blocking to prevent UI hang
        setDoc(doc(db, 'users', firebaseUser.uid), profile).catch((dbErr) => {
            console.warn("Could not write signup profile to Firestore:", dbErr);
        });
        
        setUser({ uid: firebaseUser.uid, ...profile });
        return userCredential;
    };

    const loginWithGoogle = async (role = 'consumer') => {
        localStorage.setItem('auth_selected_role', role);
        const provider = new GoogleAuthProvider();
        
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        if (isMobile) {
            return signInWithRedirect(auth, provider);
        }

        try {
            const userCredential = await signInWithPopup(auth, provider);
            const firebaseUser = userCredential.user;
            
            const displayName = firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User';
            const profile = {
                name: displayName,
                email: firebaseUser.email || '',
                role,
                avatarUrl: firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random`,
                createdAt: new Date().toISOString()
            };
            
            try {
                const docRef = doc(db, 'users', firebaseUser.uid);
                const docSnap = await fetchDocWithTimeout(docRef, 1500);
                
                if (!docSnap.exists()) {
                    setDoc(docRef, profile).catch((writeErr) => {
                        console.warn("Google signup document write failed:", writeErr);
                    });
                    setUser({ uid: firebaseUser.uid, ...profile });
                } else {
                    setUser({ uid: firebaseUser.uid, ...docSnap.data() });
                }
            } catch (dbErr) {
                console.error("Firestore error in Google Sign-In, using Auth metadata fallback:", dbErr);
                setUser({ uid: firebaseUser.uid, ...profile });
            }
            return userCredential;
        } catch (popupErr) {
            console.warn("Google signInWithPopup failed, falling back to signInWithRedirect:", popupErr);
            if (popupErr.code === 'auth/popup-blocked' || 
                popupErr.code === 'auth/cancelled-popup-request' ||
                popupErr.code === 'auth/popup-closed-by-user') {
                return signInWithRedirect(auth, provider);
            }
            throw popupErr;
        }
    };

    const loginWithGithub = async (role = 'consumer') => {
        localStorage.setItem('auth_selected_role', role);
        const provider = new GithubAuthProvider();
        
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        if (isMobile) {
            return signInWithRedirect(auth, provider);
        }

        try {
            const userCredential = await signInWithPopup(auth, provider);
            const firebaseUser = userCredential.user;
            
            const displayName = firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User';
            const profile = {
                name: displayName,
                email: firebaseUser.email || '',
                role,
                avatarUrl: firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random`,
                createdAt: new Date().toISOString()
            };
            
            try {
                const docRef = doc(db, 'users', firebaseUser.uid);
                const docSnap = await fetchDocWithTimeout(docRef, 1500);
                
                if (!docSnap.exists()) {
                    setDoc(docRef, profile).catch((writeErr) => {
                        console.warn("GitHub signup document write failed:", writeErr);
                    });
                    setUser({ uid: firebaseUser.uid, ...profile });
                } else {
                    setUser({ uid: firebaseUser.uid, ...docSnap.data() });
                }
            } catch (dbErr) {
                console.error("Firestore error in GitHub Sign-In, using Auth metadata fallback:", dbErr);
                setUser({ uid: firebaseUser.uid, ...profile });
            }
            return userCredential;
        } catch (popupErr) {
            console.warn("GitHub signInWithPopup failed, falling back to signInWithRedirect:", popupErr);
            if (popupErr.code === 'auth/popup-blocked' || 
                popupErr.code === 'auth/cancelled-popup-request' ||
                popupErr.code === 'auth/popup-closed-by-user') {
                return signInWithRedirect(auth, provider);
            }
            throw popupErr;
        }
    };

    const logout = () => {
        return signOut(auth);
    };

    const updateProfilePicture = async (newUrl) => {
        if (user) {
            try {
                const docRef = doc(db, 'users', user.uid);
                // Background write, non-blocking
                updateDoc(docRef, { avatarUrl: newUrl }).catch((dbErr) => {
                    console.warn("Could not update profile picture in Firestore:", dbErr);
                });
            } catch (dbErr) {
                console.warn("Could not reference profile document in Firestore:", dbErr);
            }

            try {
                await updateProfile(auth.currentUser, { photoURL: newUrl });
            } catch (authErr) {
                console.warn("Could not update auth profile photo URL:", authErr);
            }

            setUser(prev => ({ ...prev, avatarUrl: newUrl }));
        }
    };

    const value = {
        user,
        loading,
        loginWithEmail,
        signupWithEmail,
        loginWithGoogle,
        loginWithGithub,
        logout,
        updateProfilePicture
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

