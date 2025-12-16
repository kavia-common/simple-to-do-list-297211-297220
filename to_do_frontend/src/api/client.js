//
// Simple API client for tasks
//
const DEFAULT_BASE = 'http://localhost:4000/api';
const BASE_URL = (process.env.REACT_APP_API_BASE || DEFAULT_BASE).replace(/\/+$/, '');

async function handleResponse(res) {
  if (!res.ok) {
    let msg = `Request failed with status ${res.status}`;
    try {
      const data = await res.json();
      if (data && data.message) msg = data.message;
      if (data && data.error) msg = data.error;
    } catch {
      // ignore parse error
    }
    throw new Error(msg);
  }
  if (res.status === 204) return null;
  return res.json();
}

// PUBLIC_INTERFACE
export async function listTasks() {
  /** List tasks from the API. */
  // PUBLIC_INTERFACE
  /**
   * List tasks.
   * @returns {Promise<Array>} List of task objects.
   */
  const res = await fetch(`${BASE_URL}/tasks`, { headers: { 'Accept': 'application/json' } });
  return handleResponse(res);
}

// PUBLIC_INTERFACE
export async function createTask(task) {
  /**
   * Create a new task.
   * @param {{title:string,description:string,status:'pending'|'completed'}} task
   * @returns {Promise<Object>} Created task
   */
  const res = await fetch(`${BASE_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(task),
  });
  return handleResponse(res);
}

// PUBLIC_INTERFACE
export async function updateTask(id, updates) {
  /**
   * Update a task by id.
   * @param {number|string} id
   * @param {{title?:string,description?:string,status?:'pending'|'completed'}} updates
   * @returns {Promise<Object>} Updated task
   */
  const res = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(updates),
  });
  return handleResponse(res);
}

// PUBLIC_INTERFACE
export async function deleteTask(id) {
  /**
   * Delete a task by id.
   * @param {number|string} id
   * @returns {Promise<null>} Nothing
   */
  const res = await fetch(`${BASE_URL}/tasks/${id}`, { method: 'DELETE' });
  return handleResponse(res);
}

// PUBLIC_INTERFACE
export async function toggleTaskStatus(id, currentStatus) {
  /**
   * Toggle a task's status between pending and completed.
   * @param {number|string} id
   * @param {'pending'|'completed'} currentStatus
   * @returns {Promise<Object>} Updated task with new status
   */
  const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
  return updateTask(id, { status: newStatus });
}

export const __INTERNALS__ = { BASE_URL };
