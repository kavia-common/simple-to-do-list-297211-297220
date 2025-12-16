import React from 'react';

/**
 * TaskItem shows one task row with title, description, status badge,
 * edit, delete, and status toggle actions.
 * Props:
 * - task: { id, title, description, status }
 * - onEdit(task)
 * - onDelete(id)
 * - onToggleStatus(id)
 * - disabled: boolean
 */

// PUBLIC_INTERFACE
export default function TaskItem({ task, onEdit, onDelete, onToggleStatus, disabled }) {
  const isCompleted = task.status === 'completed';

  return (
    <div className="task-item" role="group" aria-label={`Task: ${task.title}`}>
      <div>
        <div className="task-meta">
          <span className={`badge ${isCompleted ? 'badge-completed' : 'badge-pending'}`} aria-label={`Status: ${task.status}`}>
            {isCompleted ? 'Completed' : 'Pending'}
          </span>
          <h3 className="task-title">{task.title}</h3>
        </div>
        {task.description ? (
          <p className="task-desc">{task.description}</p>
        ) : (
          <p className="task-desc muted">No description</p>
        )}
      </div>

      <div className="actions" aria-label="Task actions">
        <button
          className="btn btn-ghost"
          onClick={() => onToggleStatus(task.id)}
          aria-label={isCompleted ? 'Mark as pending' : 'Mark as completed'}
          disabled={disabled}
          title={isCompleted ? 'Mark as pending' : 'Mark as completed'}
        >
          {isCompleted ? '↺ Pending' : '✓ Complete'}
        </button>
        <button
          className="btn btn-ghost"
          onClick={() => onEdit(task)}
          aria-label="Edit task"
          disabled={disabled}
          title="Edit"
        >
          ✎ Edit
        </button>
        <button
          className="btn btn-danger"
          onClick={() => onDelete(task.id)}
          aria-label="Delete task"
          disabled={disabled}
          title="Delete"
        >
          🗑 Delete
        </button>
      </div>
    </div>
  );
}
