'use client'
import React, { useState } from 'react';
import { Task } from '../services/task';
import { useError } from '../services/error';

interface TaskItemProps {
  task: Task;
  onUpdate: (updatedTask: Task) => void;
  onDelete: (taskId: number) => void; // Added for future delete functionality
}

export default function TaskItem({ task, onUpdate, onDelete }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState(task.description);
  const { setError } = useError();

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    setError(null);
    try {
      const updatedTask = { ...task, description: editedDescription };
      onUpdate(updatedTask);
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleCancel = () => {
    setEditedDescription(task.description);
    setIsEditing(false);
  };

  const handleCheckboxChange = async () => {
    setError(null);
    try {
      const updatedTask = { ...task, completed_status: !task.completed_status };
      onUpdate(updatedTask);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <li key={task.id} className="flex items-center justify-between py-2 border-b">
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={task.completed_status}
          onChange={handleCheckboxChange}
          className="mr-2"
        />
        {isEditing ? (
          <input
            type="text"
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            className="p-1 border rounded"
          />
        ) : (
          <span onDoubleClick={handleEdit} className={`${task.completed_status ? 'line-through text-gray-500' : ''}`}>
            {task.description}
          </span>
        )}
      </div>
      <div className="flex gap-2">
        {isEditing ? (
          <>
            <button onClick={handleSave} className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600">Save</button>
            <button onClick={handleCancel} className="px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600">Cancel</button>
          </>
        ) : (
          <>
            <button onClick={handleEdit} className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600">Edit</button>
            <button onClick={() => onDelete(task.id)} className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600">Delete</button>
          </>
        )}
      </div>
    </li>
  );
}
