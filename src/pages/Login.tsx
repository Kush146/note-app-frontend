import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:5000/api/auth'; // Make sure this is correct

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState<'email' | 'otp'>('email');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(''); // To handle errors globally
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const tokenFromUrl = params.get('token');
        if (tokenFromUrl) {
            localStorage.setItem('token', tokenFromUrl);  // Store token in localStorage
            navigate('/dashboard');  // Redirect to dashboard
        }
    }, [navigate]);

    const isValidEmail = (email: string): boolean =>
        /\S+@\S+\.\S+/.test(email);

    // Send OTP
    const sendOtp = async () => {
        if (!isValidEmail(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        try {
            setLoading(true);
            const res = await fetch(`${API_BASE_URL}/send-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }), // Send email as part of the JSON body
            });
            setLoading(false);

            if (res.ok) {
                setStep('otp');  // Move to OTP verification step
            } else {
                const data = await res.json();
                setError(data.message || 'Failed to send OTP.');
            }
        } catch (error) {
            setLoading(false);
            setError('Network error. Please try again.');
        }
    };


    // Verify OTP
    // Inside Login.tsx
    const verifyOtp = async () => {
        if (!otp.trim()) {
            alert('Please enter the OTP.');
            return;
        }

        try {
            setLoading(true);
            const res = await fetch(`${API_BASE_URL}/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp }), // Ensure this line sends the correct body
            });
            setLoading(false);

            if (res.ok) {
                const data = await res.json();
                localStorage.setItem('token', data.token);  // Store token in localStorage
                navigate('/dashboard');  // Redirect to dashboard
            } else {
                const data = await res.json();
                setError(data.message || 'Invalid OTP.');
            }
        } catch (error) {
            setLoading(false);
            setError('Something went wrong. Please try again.');
        }
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 space-y-6">
                <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>

                {error && <div className="text-red-500 text-center">{error}</div>} {/* Error Display */}

                {step === 'email' ? (
                    <>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={sendOtp}
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition duration-200 disabled:opacity-50"
                        >
                            {loading ? 'Sending OTP...' : 'Send OTP'}
                        </button>
                    </>
                ) : (
                    <>
                        <div className="flex items-center gap-2">
                            <img src="/otp.png" alt="OTP" className="w-6 h-6" />
                            <input
                                type="text"
                                placeholder="Enter the OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                        <button
                            onClick={verifyOtp}
                            disabled={loading}
                            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition duration-200 disabled:opacity-50"
                        >
                            {loading ? 'Verifying...' : 'Verify OTP'}
                        </button>
                    </>
                )}

                <div className="flex items-center justify-center my-4">
                    <div className="border-t border-gray-300 w-full" />
                    <span className="px-3 text-gray-400 text-sm">or</span>
                    <div className="border-t border-gray-300 w-full" />
                </div>

                <a
                    href={`${API_BASE_URL}/google`}
                    className="flex items-center justify-center gap-2 bg-white hover:bg-gray-100 border border-gray-300 py-2 px-3 rounded-lg transition duration-200 shadow-sm w-full"
                >
                    <img src="/google2.png" alt="Google" className="w-6 h-6" /> {/* Your Google icon */}
                    <span className="text-sm font-medium text-gray-800">Sign in with Google</span>
                </a>

            </div>
        </div>
    );

};

export default Login;
