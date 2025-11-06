import { useState } from "react";

export default function AddNoteModal({ onAdd, onClose }) {
  const [note, setNote] = useState({
    note_title: "",
    note_text: "",
    note_label: "Personal",
  });

  const labels = ["Personal", "Work", "Social", "Important"];

  const handleChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(note);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[var(--color-bg-panel)] p-6 rounded-xl w-full max-w-lg shadow-md border border-[var(--color-border)]">
        <h2 className="text-xl font-semibold mb-4 text-[var(--color-primary)]">
          Add New Note
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Title</label>
            <input
              type="text"
              name="note_title"
              value={note.note_title}
              onChange={handleChange}
              required
              maxLength={100} // ✅ limit title length
              className="w-full p-2 border rounded-md bg-[var(--color-bg-body)] focus:ring-2 focus:ring-[var(--color-primary)]"
            />
            <small className="text-xs text-[var(--color-text-muted)]">
              {note.note_title.length}/100
            </small>
          </div>

          <div>
            <label className="block text-sm mb-1">Description</label>
            <textarea
              name="note_text"
              value={note.note_text}
              onChange={handleChange}
              required
              rows="3"
              maxLength={500}
              className="w-full p-2 border rounded-md bg-[var(--color-bg-body)] focus:ring-2 focus:ring-[var(--color-primary)]"
            />
            <small className="text-xs text-[var(--color-text-muted)]">
              {note.note_text.length}/500
            </small>
          </div>

          <div>
            <label className="block text-sm mb-1">Label</label>
            <select
              name="note_label"
              value={note.note_label}
              onChange={handleChange}
              className="w-full p-2 border rounded-md bg-[var(--color-bg-body)]"
            >
              {labels.map((label) => (
                <option key={label}>{label}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-gray-400/20 hover:bg-gray-400/40"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-[var(--color-primary)] text-white"
            >
              Add Note
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
