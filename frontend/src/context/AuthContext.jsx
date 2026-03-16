import { createContext, useState, useEffect, useContext } from 'react';
import api from '../lib/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load auth state from local storage on mount
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            setToken(storedToken);
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse user from local storage", e);
            }
        }

        setLoading(false);

        // Listen for auth changes (e.g. from axios interceptor)
        const handleAuthChange = () => {
            if (!localStorage.getItem('token')) {
                setUser(null);
                setToken(null);
            }
        };

        window.addEventListener('auth-change', handleAuthChange);
        return () => window.removeEventListener('auth-change', handleAuthChange);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token, id, name, email: userEmail, role } = response.data;

            // Strip ROLE_ prefix if present (backend returns ROLE_ADMIN, frontend expects ADMIN)
            const cleanRole = role.replace('ROLE_', '');
            const userData = { id, name, email: userEmail, role: cleanRole };

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));

            setToken(token);
            setUser(userData);

            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Login failed';
        }
    };

    const register = async (userData) => {
        try {
            const response = await api.post('/auth/register', userData);
            return response.data; // usually "User registered successfully!" string
        } catch (error) {
            console.error("Registration Error:", error);
            if (!error.response) {
                throw 'Network Error: Cannot connect to backend server. Please ensure the backend is running on port 8080.';
            }
            throw error.response?.data?.message || 'Registration failed';
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setToken(null);
    };

    const value = {
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!token,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
