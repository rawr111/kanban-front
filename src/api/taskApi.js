const API_BASE_URL = 'http://95.163.237.78:8080/api/v1'; // Убедись, что схема (http/https) и порт верны

export const getTasks = async (token) => {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to fetch tasks' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
};

export const createTask = async (taskData, token) => {
    // taskData должен соответствовать models.TaskCreatePayload: { title: string, description?: string }
    const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(taskData),
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to create task' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return response.json(); // Возвращает созданную задачу (models.Task)
};

// getTaskById - если понадобится отдельная страница для задачи, пока не используем
// export const getTaskById = async (taskId) => {
//     const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`);
//     if (!response.ok) {
//         const errorData = await response.json().catch(() => ({ message: `Failed to fetch task ${taskId}` }));
//         throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
//     }
//     return response.json();
// };

export const deleteTask = async (taskId, token) => {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    if (!response.ok && response.status !== 204) { // 204 No Content - успешное удаление
        const errorData = await response.json().catch(() => ({ message: `Failed to delete task ${taskId}` }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    // Для DELETE запроса с ответом 204 тело ответа обычно пустое
    return response.status === 204;
};

// Обрати внимание: в твоем API нет эндпоинта для обновления задачи (например, изменения статуса).
// Если он появится (например, PUT /tasks/{taskID}), нужно будет добавить соответствующую функцию.
// export const updateTask = async (taskId, taskUpdateData) => { ... };