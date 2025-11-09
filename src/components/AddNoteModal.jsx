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
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <div
        className="relative p-6 rounded-xl w-full max-w-lg shadow-lg border transition-all duration-300"
        style={{
          backgroundColor: "var(--color-bg-panel)",
          borderColor: "var(--color-border)",
          color: "var(--color-text-main)",
        }}
      >
        {/* ✕ Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-[var(--color-text-muted)] hover:text-red-500 transition"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-4 text-center text-[var(--color-primary)]">
          Add New Note
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm mb-1 text-[var(--color-text-muted)]">
              Title
            </label>
            <input
              type="text"
              name="note_title"
              value={note.note_title}
              onChange={handleChange}
              required
              maxLength={100}
              className="w-full p-2 border rounded-md bg-transparent focus:ring-2 focus:ring-[var(--color-primary)]"
              style={{
                borderColor: "var(--color-border)",
                color: "var(--color-text-main)",
              }}
            />
            <small className="text-xs text-[var(--color-text-muted)]">
              {note.note_title.length}/100
            </small>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm mb-1 text-[var(--color-text-muted)]">
              Description
            </label>
            <textarea
              name="note_text"
              value={note.note_text}
              onChange={handleChange}
              required
              rows="3"
              maxLength={500}
              className="w-full p-2 border rounded-md resize-none bg-transparent focus:ring-2 focus:ring-[var(--color-primary)]"
              style={{
                borderColor: "var(--color-border)",
                color: "var(--color-text-main)",
              }}
            />
            <small className="text-xs text-[var(--color-text-muted)]">
              {note.note_text.length}/500
            </small>
          </div>

          {/* Label */}
          <div className="relative">
            <label className="block text-sm mb-1 text-[var(--color-text-muted)]">
              Label
            </label>
            <select
              name="note_label"
              value={note.note_label}
              onChange={handleChange}
              className="w-full p-2 border rounded-md appearance-none focus:ring-2 focus:ring-[var(--color-primary)] bg-transparent cursor-pointer"
              style={{
                borderColor: "var(--color-border)",
                color: "var(--color-text-main)",
              }}
            >
              {labels.map((label) => (
                <option
                  key={label}
                  value={label}
                  className="border cursor-pointer"
                  style={{
                    backgroundColor: "var(--color-bg-panel)",
                    color: "var(--color-text-main)",
                  }}
                >
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Add Button */}
          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="px-6 py-2 rounded-md text-white font-medium transition cursor-pointer"
              style={{
                backgroundColor: "var(--color-primary)",
              }}
            >
              Add Note
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
