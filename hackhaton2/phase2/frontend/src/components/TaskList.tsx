'use client'
import React from 'react';
import { Task } from '../services/task';
import TaskItem from './TaskItem'; // Import TaskItem

interface TaskListProps {
  tasks: Task[];
  onTaskUpdate: (updatedTask: Task) => void;
  onTaskDelete: (taskId: number) => void;
  isLoading: boolean;
}

export default function TaskList({ tasks, onTaskUpdate, onTaskDelete, isLoading }: TaskListProps) {
  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      {tasks.length === 0 ? (
        <p>No tasks yet. Add one above!</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onUpdate={onTaskUpdate}
              onDelete={onTaskDelete}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
