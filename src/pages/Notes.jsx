import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchNotes, addNote, deleteNote } from "../features/notes/noteSlice";
import AddNoteModal from "../components/AddNoteModal";
import { Trash2 } from "lucide-react";

export default function Notes() {
  const dispatch = useAppDispatch();
  const { list, status } = useAppSelector((state) => state.notes);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    dispatch(fetchNotes());
  }, [dispatch]);

const handleAdd = async (note) => {
  try {
    const action = await dispatch(addNote(note));

    if (addNote.fulfilled.match(action)) {
      setShowModal(false);
    } else {
      console.error("Add note failed:", action.payload);
    }
  } catch (error) {
    console.error("Error adding note:", error);
  }
};

  const handleDelete = async (id) => {
    await dispatch(deleteNote(id));
  };

  const getLabelColor = (label) => {
    switch (label) {
      case "Work":
        return "bg-green-100/40 text-green-600";
      case "Social":
        return "bg-orange-100/40 text-orange-600";
      case "Important":
        return "bg-red-100/40 text-red-600";
      default:
        return "bg-blue-100/40 text-blue-600";
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-[var(--color-text-main)]">
          Notes
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white font-medium shadow hover:opacity-90"
        >
          + Add Note
        </button>
      </div>

      {/* Notes Grid */}
      {status === "loading" ? (
        <p>Loading notes...</p>
      ) : list.length === 0 ? (
        <p>No notes yet. Add one!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {list.map((note) => (
            <div
              key={note.note_id}
              className={`p-4 rounded-xl shadow border border-[var(--color-border)] ${getLabelColor(
                note?.note_label
              )}`}
            >
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg">{note.note_title}</h3>
                <button
                  onClick={() => handleDelete(note.note_id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <p
                className="text-sm mt-2 break-words"
                style={{
                  color: "var(--color-text-main)", // ✅ adapts to theme
                  overflowWrap: "break-word", // ✅ breaks long unspaced text
                  wordBreak: "break-word",
                }}
              >
                {note?.note_text}
              </p>
              <span className="text-xs mt-3 block opacity-60">
                {note?.note_label}
              </span>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <AddNoteModal onAdd={handleAdd} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}
