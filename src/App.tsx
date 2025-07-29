import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import GoogleCallbackHandler from './pages/GoogleCallbackHandler';  // Add Google Callback handler

// ProtectedRoute is a wrapper that checks if the user is authenticated
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
            <Router>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/auth/callback" element={<GoogleCallbackHandler />} /> {/* Redirects after Google login */}

                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
