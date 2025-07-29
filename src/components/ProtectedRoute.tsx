import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

// Type definition for the decoded token
interface DecodedToken {
    exp: number;
}

interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const token = localStorage.getItem('token');

    // Check if the token exists and is not expired
    const isTokenValid = (token: string | null): boolean => {
        if (!token) return false;

        try {
            const decoded = jwtDecode<DecodedToken>(token);
            const currentTime = Date.now() / 1000; // Convert to seconds
            return decoded.exp > currentTime;
        } catch (err) {
            console.error('Invalid token:', err);
            return false;
        }
    };

    return isTokenValid(token) ? <>{children}</> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
