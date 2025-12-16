import React from 'react';
import TaskItem from './TaskItem';

/**
 * TaskList renders a list of tasks.
 * Props:
 * - tasks: Array<{id, title, description, status}>
 * - onEdit(task)
 * - onDelete(id)
 * - onToggleStatus(id)
 * - busy: boolean (disables actions when true)
 */

// PUBLIC_INTERFACE
export default function TaskList({ tasks, onEdit, onDelete, onToggleStatus, busy }) {
  if (!tasks || tasks.length === 0) {
    return <p className="muted">No tasks yet. Add your first task above.</p>;
  }

  return (
    <div aria-live="polite" aria-busy={busy}>
      <ul aria-label="Task list" style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 12 }}>
        {tasks.map((t) => (
          <li key={t.id}>
            <TaskItem
              task={t}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleStatus={onToggleStatus}
              disabled={busy}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
