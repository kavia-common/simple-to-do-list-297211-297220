import React, { useState, useEffect } from 'react';
import './App.css';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import useTasks from './hooks/useTasks';

// PUBLIC_INTERFACE
function App() {
  /**
   * App provides the single-page layout:
   * - Header with title and theme toggle
   * - TaskForm for adding/updating tasks
   * - TaskList to display and manage tasks
   */
  const [theme, setTheme] = useState('light');

  // Tasks state and API actions from custom hook
  const {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    toggleStatus,
    refresh,
  } = useTasks();

  // Editing state for TaskForm
  const [editingTask, setEditingTask] = useState(null);

  // Effect to apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Handle form submit for create/update
  const handleSubmit = async (data) => {
    if (editingTask) {
      await updateTask(editingTask.id, data);
      setEditingTask(null);
    } else {
      await createTask(data);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  return (
    <div className="App">
      <header className="app-header" role="banner">
        <div className="container">
          <div className="header-bar">
            <h1 className="title" aria-label="To-Do App">To‑Do</h1>
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
            </button>
          </div>
          <p className="subtitle">Manage tasks with ease</p>
        </div>
      </header>

      <main className="app-main" role="main">
        <div className="container">
          <section aria-labelledby="task-form-heading" className="card">
            <h2 id="task-form-heading" className="section-title">
              {editingTask ? 'Edit Task' : 'Add Task'}
            </h2>
            <TaskForm
              key={editingTask ? editingTask.id : 'new'}
              initialValues={
                editingTask || { title: '', description: '', status: 'pending' }
              }
              onSubmit={handleSubmit}
              onCancel={editingTask ? handleCancelEdit : undefined}
              submitting={loading}
            />
          </section>

          <section aria-labelledby="task-list-heading" className="card">
            <div className="list-header">
              <h2 id="task-list-heading" className="section-title">Tasks</h2>
              <button
                className="btn btn-secondary"
                onClick={refresh}
                disabled={loading}
                aria-label="Refresh task list"
              >
                ⟳ Refresh
              </button>
            </div>

            <div role="status" aria-live="polite" className="sr-only">
              {loading ? 'Loading tasks...' : 'Tasks loaded'}
            </div>

            {error && (
              <div
                role="alert"
                aria-live="assertive"
                className="alert alert-error"
              >
                {error}
              </div>
            )}

            <TaskList
              tasks={tasks}
              onEdit={handleEdit}
              onDelete={deleteTask}
              onToggleStatus={toggleStatus}
              busy={loading}
            />
          </section>
        </div>
      </main>

      <footer className="app-footer" role="contentinfo">
        <div className="container">
          <small className="muted">
            API base: {process.env.REACT_APP_API_BASE || 'http://localhost:4000/api'}
          </small>
        </div>
      </footer>
    </div>
  );
}

export default App;
