'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../src/services/auth';
import TaskInput from '../../src/components/TaskInput';
import TaskList from '../../src/components/TaskList';
import { getTasks, updateTask, deleteTask } from '../../src/services/task';
import { useError } from '../../src/services/error';

export default function TasksPage() {
  const { isAuthenticated, logout, token } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { setError } = useError();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      fetchTasks();
    }
  }, [isAuthenticated]);

  const fetchTasks = async () => {
    if (!token) {
      setError('Authentication token missing.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const fetchedTasks = await getTasks(token);
      setTasks(fetchedTasks);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const handleTaskUpdate = async (updatedTask: Task) => {
    if (!token) {
      setError('Authentication token missing.');
      return;
    }
    try {
      const returnedTask = await updateTask(updatedTask.id, updatedTask.description, updatedTask.completed_status, token);
      setTasks(tasks.map(task => task.id === returnedTask.id ? returnedTask : task));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleTaskDelete = async (taskId: number) => {
    if (!token) {
      setError('Authentication token missing.');
      return;
    }
    try {
      await deleteTask(taskId, token);
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center py-6">
        <h1 className="text-2xl font-bold">Your Tasks</h1>
        <button onClick={handleLogout} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Logout</button>
      </div>
      <TaskInput onTaskCreated={fetchTasks} />
      <TaskList tasks={tasks} onTaskUpdate={handleTaskUpdate} onTaskDelete={handleTaskDelete} isLoading={loading} />
    </div>
  );
}
