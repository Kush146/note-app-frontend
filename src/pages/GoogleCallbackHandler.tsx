import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

const GoogleCallbackHandler = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const tokenFromUrl = new URLSearchParams(window.location.search).get('token');

        if (tokenFromUrl) {
            // Check if token is expired
            const decodedToken: any = jwtDecode(tokenFromUrl);
            const currentTime = Date.now() / 1000;

            if (decodedToken.exp < currentTime) {
                console.error('❌ Token expired');
                localStorage.removeItem('token');
                navigate('/login');
                return;
            }

            // Save the JWT token in localStorage
            localStorage.setItem('token', tokenFromUrl);

            // Redirect to dashboard after successful login
            navigate('/dashboard');
        } else {
            // Redirect to login if no token is present
            navigate('/login');
        }
    }, [navigate]);

    return (
        <div className="flex items-center justify-center h-screen text-xl font-medium">
            Logging in with Google...
        </div>
    );
};

export default GoogleCallbackHandler;
