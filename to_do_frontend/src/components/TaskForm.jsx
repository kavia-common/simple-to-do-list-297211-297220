import React, { useEffect, useMemo, useState } from 'react';

/**
 * TaskForm renders inputs for title, description, and status with buttons to submit/cancel.
 * Props:
 * - initialValues: { title, description, status }
 * - onSubmit(values)
 * - onCancel() optional
 * - submitting: boolean
 */

// PUBLIC_INTERFACE
export default function TaskForm({ initialValues, onSubmit, onCancel, submitting }) {
  const defaults = useMemo(() => ({
    title: '',
    description: '',
    status: 'pending',
    ...(initialValues || {}),
  }), [initialValues]);

  const [values, setValues] = useState(defaults);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setValues(defaults);
    setErrors({});
  }, [defaults]);

  const validate = () => {
    const e = {};
    if (!values.title.trim()) e.title = 'Title is required';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const eMap = validate();
    setErrors(eMap);
    if (Object.keys(eMap).length > 0) return;
    await onSubmit({
      title: values.title.trim(),
      description: values.description.trim(),
      status: values.status,
    });
    setValues({ title: '', description: '', status: 'pending' });
  };

  return (
    <form onSubmit={handleSubmit} noValidate aria-describedby="form-help">
      <div id="form-help" className="sr-only">
        All fields have labels. Title is required.
      </div>
      <div className="form-grid">
        <div className="form-row">
          <label htmlFor="title" className="label">Title</label>
          <input
            id="title"
            name="title"
            className="input"
            type="text"
            placeholder="e.g., Buy groceries"
            value={values.title}
            onChange={handleChange}
            aria-invalid={!!errors.title}
            aria-describedby={errors.title ? 'title-error' : undefined}
          />
          {errors.title && (
            <div id="title-error" role="alert" className="alert alert-error">
              {errors.title}
            </div>
          )}
        </div>

        <div className="form-row form-row--full">
          <label htmlFor="description" className="label">Description</label>
          <textarea
            id="description"
            name="description"
            className="textarea"
            placeholder="Optional details..."
            value={values.description}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <label htmlFor="status" className="label">Status</label>
          <select
            id="status"
            name="status"
            className="select"
            value={values.status}
            onChange={handleChange}
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="form-row form-row--full form-actions">
          {onCancel && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
              aria-label="Cancel editing task"
              disabled={submitting}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="btn btn-primary"
            aria-label="Save task"
            disabled={submitting}
          >
            {submitting ? 'Saving...' : 'Save Task'}
          </button>
        </div>
      </div>
    </form>
  );
}
