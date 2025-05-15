import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import Login from './components/Login';
import Register from './components/Register';
import { getTasks, createTask, deleteTask } from './api/taskApi';
import './App.css'; // Подключим стили

function TasksPage({ token, onLogout }) {
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchTasks = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const fetchedTasks = await getTasks(token);
            setTasks(fetchedTasks || []);
        } catch (err) {
            setError(err.message);
            console.error("Failed to fetch tasks:", err);
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const handleAddTask = async (taskData) => {
        // taskData: { title, description }
        setIsLoading(true);
        setError(null);
        try {
            const newTask = await createTask(taskData, token);
            setTasks((prevTasks) => [...prevTasks, newTask]);
        } catch (err) {
            setError(err.message);
            console.error("Failed to create task:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteTask = async (taskId) => {
        setIsLoading(true);
        setError(null);
        try {
            await deleteTask(taskId, token);
            setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
        } catch (err) {
            setError(err.message);
            console.error(`Failed to delete task ${taskId}:`, err);
        } finally {
            setIsLoading(false);
        }
    };

    // Если бы было обновление статуса:
    // const handleUpdateTaskStatus = async (taskId, newStatus) => {
    //     try {
    //         const updatedTask = await updateTask(taskId, { status: newStatus });
    //         setTasks(prevTasks =>
    //             prevTasks.map(task => (task.id === taskId ? updatedTask : task))
    //         );
    //     } catch (err) {
    //         setError(err.message);
    //     }
    // };

    return (
        <div className="app-container">
            <header className="app-header">
                <h1>Task Manager</h1>
                <button onClick={onLogout} className="logout-btn">Logout</button>
            </header>
            <main className="app-main">
                <TaskForm onAddTask={handleAddTask} />
                {isLoading && <p className="loading-message">Loading tasks...</p>}
                {error && <p className="error-message">Error: {error}</p>}
                {!isLoading && !error && (
                    <TaskList
                        tasks={tasks}
                        onDeleteTask={handleDeleteTask}
                        // onUpdateTaskStatus={handleUpdateTaskStatus} // Если будет обновление
                    />
                )}
            </main>
            <footer className="app-footer">
                <p>© {new Date().getFullYear()} My Task Manager App</p>
            </footer>
        </div>
    );
}

function App() {
    const [token, setToken] = useState(() => localStorage.getItem('token'));

    const handleLogin = (newToken) => {
        setToken(newToken);
    };

    const handleLogout = () => {
        setToken(null);
        localStorage.removeItem('token');
    };

    return (
        <Router>
            <Routes>
                {!token ? (
                    <>
                        <Route path="/login" element={<AuthWrapper isLogin onLogin={handleLogin} />} />
                        <Route path="/register" element={<AuthWrapper onRegisterSuccess={() => window.location.replace('/login')} />} />
                        <Route path="*" element={<Navigate to="/login" replace />} />
                    </>
                ) : (
                    <>
                        <Route path="/tasks" element={<TasksPage token={token} onLogout={handleLogout} />} />
                        <Route path="*" element={<Navigate to="/tasks" replace />} />
                    </>
                )}
            </Routes>
        </Router>
    );
}

function AuthWrapper({ isLogin, onLogin, onRegisterSuccess }) {
    const navigate = useNavigate();
    return (
        <div className="auth-container">
            <nav className="auth-nav">
                <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
            </nav>
            {isLogin ? (
                <Login onLogin={onLogin} />
            ) : (
                <Register onRegisterSuccess={() => {
                    if (onRegisterSuccess) onRegisterSuccess();
                    else navigate('/login');
                }} />
            )}
        </div>
    );
}

export default App;