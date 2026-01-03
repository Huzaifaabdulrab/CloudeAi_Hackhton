'use client'
import { useState } from 'react';
import { useAuth } from '../services/auth';
import { useError } from '../services/error';

interface TaskInputProps {
  onTaskCreated: () => void;
}

export default function TaskInput({ onTaskCreated }: TaskInputProps) {
  const [description, setDescription] = useState('');
  const { setError } = useError();
  const { token } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError('You must be logged in to create a task.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ description }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || 'Failed to create task');
      }

      setDescription('');
      onTaskCreated(); // Notify parent component that a task was created
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="mb-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          placeholder="New task description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="flex-grow p-2 border rounded"
        />
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Add Task</button>
      </form>
    </div>
  );
}
