import React from 'react';
import { useNavigate } from 'react-router-dom'; // If you want to navigate to a different page after signup

const Signup = () => {
    const navigate = useNavigate();

    // Handle Signup action (navigate to Login page or show signup form)
    const handleSignup = () => {
        navigate('/login'); // Redirect to the login page, or you could handle signup logic here
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
            <div className="bg-white shadow-md rounded-2xl p-6 sm:p-10 w-full max-w-md text-center">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                    Signup
                </h2>
                <p className="text-gray-500 mb-6">
                    This is optional if you are only using OTP login.
                </p>
                {/* Add other fields or instructions for signup if needed */}
                <button
                    onClick={handleSignup}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition duration-200"
                >
                    Signup
                </button>
            </div>
        </div>
    );
};

export default Signup;
