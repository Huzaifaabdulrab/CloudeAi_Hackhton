// frontend/src/services/task.ts

interface Task {
    id: number;
    description: string;
    completed_status: boolean;
    owner_id: number;
}

export async function createTask(description: string, token: string): Promise<Task> {
    const response = await fetch('http://localhost:8000/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ description }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create task');
    }

    return response.json();
}

export async function getTasks(token: string): Promise<Task[]> {
    const response = await fetch('http://localhost:8000/tasks', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to retrieve tasks');
    }

    return response.json();
}

export async function updateTask(taskId: number, description: string, completed_status: boolean, token: string): Promise<Task> {
    const response = await fetch(`http://localhost:8000/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ description, completed_status }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update task');
    }

    return response.json();
}

export async function deleteTask(taskId: number, token: string): Promise<void> {
    const response = await fetch(`http://localhost:8000/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to delete task');
    }
}
