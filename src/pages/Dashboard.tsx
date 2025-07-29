import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

type Note = {
    _id: string;
    title: string;
    content: string;
};

type DecodedToken = {
    email: string;
    name?: string;
    exp: number;
};

const Dashboard = () => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [userName, setUserName] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState('');
    const [editContent, setEditContent] = useState('');
    const [editingNoteId, setEditingNoteId] = useState<string>('');

    // Check if token is expired
    const isTokenExpired = (token: string): boolean => {
        try {
            const decoded: DecodedToken = jwtDecode(token);
            const currentTime = Date.now() / 1000;
            return decoded.exp < currentTime; // Check if token has expired
        } catch (err) {
            console.error('❌ Error decoding token:', err);
            return true; // Assume expired if error occurs
        }
    };

    // Decode user info from the token
    const decodeUser = (token: string) => {
        try {
            const decoded: DecodedToken = jwtDecode(token);
            setUserName(decoded.name || decoded.email);
        } catch (err) {
            console.error('❌ Invalid token:', err);
        }
    };

    // Fetch notes from the backend
    const fetchNotes = async (token: string) => {
        try {
            const res = await fetch('http://localhost:5000/api/notes', {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
                const data = await res.json();
                setNotes(data);
            } else {
                console.error('❌ Failed to fetch notes');
            }
        } catch (err) {
            console.error('❌ Error fetching notes:', err);
        }
    };

    // Handle creating a new note
    const handleCreateNote = async () => {
        const token = localStorage.getItem('token');
        if (!token || !title.trim() || !content.trim()) {
            alert('Both title and content are required.');
            return;
        }

        try {
            const res = await fetch('http://localhost:5000/api/notes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ title, content }),
            });

            if (res.ok) {
                setTitle('');
                setContent('');
                fetchNotes(token);
            } else {
                alert('Failed to create note');
            }
        } catch (err) {
            console.error('❌ Error creating note:', err);
        }
    };

    // Handle deleting a note
    const handleDeleteNote = async (id: string) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const res = await fetch(`http://localhost:5000/api/notes/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
                fetchNotes(token);
            } else {
                alert('Failed to delete note');
            }
        } catch (err) {
            console.error('❌ Error deleting note:', err);
        }
    };

    // Start editing a note
    const startEditing = (note: Note) => {
        setIsEditing(true);
        setEditTitle(note.title);
        setEditContent(note.content);
        setEditingNoteId(note._id);
    };

    // Handle editing a note
    const handleEditNote = async () => {
        const token = localStorage.getItem('token');
        if (!token || !editTitle.trim() || !editContent.trim()) {
            alert('Both title and content are required.');
            return;
        }

        try {
            const res = await fetch(`http://localhost:5000/api/notes/${editingNoteId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ title: editTitle, content: editContent }),
            });

            if (res.ok) {
                setIsEditing(false);
                fetchNotes(token);
            } else {
                alert('Failed to update note');
            }
        } catch (err) {
            console.error('❌ Error editing note:', err);
        }
    };

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/';
    };

    // UseEffect to handle token validation and fetching notes
    useEffect(() => {
        // Check token in localStorage
        const token = localStorage.getItem('token');
        if (!token) {
            console.log('No token found!');
            window.location.href = '/login';
            return;
        }

        // Check if token is expired
        if (isTokenExpired(token)) {
            console.log('Token expired!');
            localStorage.removeItem('token');
            window.location.href = '/login';
            return;
        }

        // Token is valid, proceed with fetching notes
        decodeUser(token);
        fetchNotes(token); // Pass token to fetchNotes
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">📓 Welcome, {userName || 'User'}</h2>
                <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
                >
                    Logout
                </button>
            </div>

            <div className="bg-white rounded-xl shadow p-6 mb-6 max-w-xl mx-auto">
                <h3 className="text-lg font-medium mb-4">
                    {isEditing ? 'Edit Note' : 'Create New Note'}
                </h3>
                <input
                    type="text"
                    placeholder="Title"
                    className="w-full mb-3 p-2 border rounded-md"
                    value={isEditing ? editTitle : title}
                    onChange={(e) =>
                        isEditing ? setEditTitle(e.target.value) : setTitle(e.target.value)
                    }
                />
                <textarea
                    placeholder="Content"
                    className="w-full mb-3 p-2 border rounded-md h-28"
                    value={isEditing ? editContent : content}
                    onChange={(e) =>
                        isEditing ? setEditContent(e.target.value) : setContent(e.target.value)
                    }
                />
                {isEditing ? (
                    <div className="flex gap-3">
                        <button
                            onClick={handleEditNote}
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
                        >
                            Update
                        </button>
                        <button
                            onClick={() => setIsEditing(false)}
                            className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded-md"
                        >
                            Cancel
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={handleCreateNote}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                    >
                        Add Note
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {notes.map((note) => (
                    <div key={note._id} className="bg-white p-4 rounded-lg shadow">
                        <h4 className="text-xl font-semibold mb-2">{note.title}</h4>
                        <p className="text-gray-700 mb-3 whitespace-pre-wrap">{note.content}</p>
                        <div className="flex justify-between">
                            <button
                                onClick={() => startEditing(note)}
                                className="text-blue-600 hover:underline"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDeleteNote(note._id)}
                                className="text-red-600 hover:underline"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
