import express from 'express';

/**
 * Tasks Router - provides CRUD endpoints for tasks backed by SQLite.
 * Model fields:
 * - id INTEGER PRIMARY KEY AUTOINCREMENT
 * - title TEXT NOT NULL
 * - description TEXT
 * - status TEXT ('pending'|'completed') DEFAULT 'pending'
 * - created_at DATETIME
 * - updated_at DATETIME
 */
const router = express.Router();

// Helpers
const isValidStatus = (s) => s === 'pending' || s === 'completed';

// Map sqlite row to API task object (already matches columns)
const mapRow = (row) => row;

// PUBLIC_INTERFACE
router.get('/', (req, res, next) => {
  /**
   * List tasks
   * GET /api/tasks
   * Returns: 200 [{...task}]
   */
  const sql = 'SELECT id, title, description, status, created_at, updated_at FROM tasks ORDER BY created_at DESC';
  req.db.all(sql, [], (err, rows) => {
    if (err) return next(err);
    res.json(rows.map(mapRow));
  });
});

// PUBLIC_INTERFACE
router.get('/:id', (req, res, next) => {
  /**
   * Get single task by id
   * GET /api/tasks/:id
   * Returns: 200 {...task} or 404
   */
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ message: 'Invalid id' });

  const sql = 'SELECT id, title, description, status, created_at, updated_at FROM tasks WHERE id = ?';
  req.db.get(sql, [id], (err, row) => {
    if (err) return next(err);
    if (!row) return res.status(404).json({ message: 'Task not found' });
    res.json(mapRow(row));
  });
});

// PUBLIC_INTERFACE
router.post('/', (req, res, next) => {
  /**
   * Create a task
   * POST /api/tasks
   * Body: { title: string, description?: string, status?: 'pending'|'completed' }
   * Returns: 201 {...task}
   */
  const { title, description = '', status = 'pending' } = req.body || {};
  if (!title || typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ message: 'Title is required' });
  }
  if (status && !isValidStatus(status)) {
    return res.status(400).json({ message: "Status must be 'pending' or 'completed'" });
  }

  const sql = 'INSERT INTO tasks (title, description, status) VALUES (?, ?, ?)';
  req.db.run(sql, [title.trim(), String(description || ''), status], function onInsert(err) {
    if (err) return next(err);
    const id = this.lastID;
    req.db.get(
      'SELECT id, title, description, status, created_at, updated_at FROM tasks WHERE id = ?',
      [id],
      (err2, row) => {
        if (err2) return next(err2);
        res.status(201).json(mapRow(row));
      }
    );
  });
});

// PUBLIC_INTERFACE
router.put('/:id', (req, res, next) => {
  /**
   * Update a task by id (full or partial)
   * PUT /api/tasks/:id
   * Body: { title?, description?, status? }
   * Returns: 200 {...task} or 404
   */
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ message: 'Invalid id' });

  const { title, description, status } = req.body || {};
  if (status !== undefined && !isValidStatus(status)) {
    return res.status(400).json({ message: "Status must be 'pending' or 'completed'" });
  }

  // Fetch current row first
  req.db.get('SELECT * FROM tasks WHERE id = ?', [id], (err, curr) => {
    if (err) return next(err);
    if (!curr) return res.status(404).json({ message: 'Task not found' });

    const nextTitle = title !== undefined ? String(title).trim() : curr.title;
    if (!nextTitle) return res.status(400).json({ message: 'Title is required' });
    const nextDesc = description !== undefined ? String(description) : curr.description;
    const nextStatus = status !== undefined ? status : curr.status;

    const sql = 'UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ?';
    req.db.run(sql, [nextTitle, nextDesc, nextStatus, id], function onUpdate(err2) {
      if (err2) return next(err2);
      req.db.get(
        'SELECT id, title, description, status, created_at, updated_at FROM tasks WHERE id = ?',
        [id],
        (err3, row) => {
          if (err3) return next(err3);
          res.json(mapRow(row));
        }
      );
    });
  });
});

// PUBLIC_INTERFACE
router.delete('/:id', (req, res, next) => {
  /**
   * Delete a task by id
   * DELETE /api/tasks/:id
   * Returns: 204 on success or 404 if not found
   */
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ message: 'Invalid id' });

  req.db.run('DELETE FROM tasks WHERE id = ?', [id], function onDelete(err) {
    if (err) return next(err);
    if (this.changes === 0) return res.status(404).json({ message: 'Task not found' });
    res.status(204).send();
  });
});

export default router;
