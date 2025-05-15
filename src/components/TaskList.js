import React from 'react';
import TaskItem from './TaskItem';

function TaskList({ tasks, onDeleteTask }) {
    if (!tasks || tasks.length === 0) {
        return <p>No tasks yet. Add one!</p>;
    }

    return (
        <ul className="task-list">
            {tasks.map((task) => (
                <TaskItem
                    key={task.id}
                    task={task}
                    onDeleteTask={onDeleteTask}
                />
            ))}
        </ul>
    );
}

export default TaskList;