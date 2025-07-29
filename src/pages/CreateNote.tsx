import React, { useState } from 'react';

const CreateNote = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) return alert('Not logged in');

        setLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/notes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token
                },
                body: JSON.stringify({ title, content })
            });

            if (res.ok) {
                alert('Note added!');
                setTitle('');
                setContent('');
            } else {
                const errorData = await res.json();
                alert(errorData.message || 'Failed to add note');
            }
        } catch (error) {
            alert('Error while submitting note.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto mt-10 p-4 bg-white shadow-md rounded-md space-y-4">
            <h2 className="text-2xl font-bold text-center">Create Note</h2>
            <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
                placeholder="Content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[150px]"
            ></textarea>
            <button
                type="submit"
                disabled={loading}
                className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
            >
                {loading ? 'Adding...' : 'Add Note'}
            </button>
        </form>
    );
};

export default CreateNote;
