import React from 'react';

function TaskItem({ task, onDeleteTask }) {
    // API не предоставляет метода для изменения статуса, поэтому пока просто отображаем
    // Если бы был метод PUT /tasks/{taskId} для обновления, здесь могла бы быть кнопка/чекбокс
    // const handleToggleStatus = () => {
    //     // Логика для вызова API обновления статуса
    //     // onUpdateTaskStatus(task.id, newStatus);
    // };

    return (
        <li className={`task-item ${task.status === 'completed' ? 'completed' : ''}`}>
            <div className="task-info">
                <h4>{task.title}</h4>
                <p>{task.description || 'No description'}</p>
                <small>Status: {task.status || 'N/A'}</small>
                <small>ID: {task.id}</small>
            </div>
            <div className="task-actions">
                {/* <button onClick={handleToggleStatus}>Toggle Status</button>  // Закомментировано, т.к. нет API */}
                <button onClick={() => onDeleteTask(task.id)} className="delete-btn">
                    Delete
                </button>
            </div>
        </li>
    );
}

export default TaskItem;