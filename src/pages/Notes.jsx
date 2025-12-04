// src/pages/Notes.jsx
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
        await dispatch(fetchNotes());
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

  // return style object for the card background / text
  const getLabelStyle = (label) => {
    switch (label) {
      case "Work":
        return {
          backgroundColor: "rgba(187, 247, 208, 0.4)", // green-100/40
          color: "#16a34a", // green-600
        };
      case "Social":
        return {
          backgroundColor: "rgba(254, 215, 170, 0.4)", // orange-100/40
          color: "#ea580c", // orange-600
        };
      case "Important":
        return {
          backgroundColor: "rgba(254, 202, 202, 0.4)", // red-100/40
          color: "#dc2626", // red-600
        };
      default:
        return {
          backgroundColor: "rgba(191, 219, 254, 0.4)", // blue-100/40
          color: "#2563eb", // blue-600
        };
    }
  };

  return (
    <div
      className="container"
      style={{
        maxWidth: "72rem",
        padding: "1.5rem",
      }}
    >
      {/* Header */}
      <div
        className="d-flex justify-content-between align-items-center mb-4"
        style={{ gap: "0.75rem" }}
      >
        <h1
          className="mb-0"
          style={{
            fontSize: "1.5rem",
            fontWeight: 600,
            color: "var(--color-text-main)",
          }}
        >
          Notes
        </h1>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="btn btn-primary"
          style={{
            backgroundColor: "var(--color-primary)",
            borderColor: "var(--color-primary)",
            fontWeight: 500,
            padding: "0.5rem 1rem",
            borderRadius: "0.6rem",
            boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
          }}
        >
          + Add Note
        </button>
      </div>

      {/* Notes Grid / States */}
      {status === "loading" ? (
        <p
          style={{
            fontSize: "0.9rem",
            color: "var(--color-text-muted)",
          }}
        >
          Loading notes...
        </p>
      ) : list?.length === 0 ? (
        <p
          style={{
            fontSize: "0.75rem",
            marginTop: "0.75rem",
            opacity: 0.6,
          }}
        >
          No notes yet. Add one!
        </p>
      ) : (
        <div className="row g-3">
          {list?.map((note) => {
            const labelStyle = getLabelStyle(note?.note_label);

            return (
              <div
                key={note.note_id}
                className="col-12 col-sm-6 col-lg-4 col-xl-3"
              >
                <div
                  className="h-100 border shadow-sm rounded-4 d-flex flex-column"
                  style={{
                    padding: "1rem",
                    borderColor: "var(--color-border)",
                    backgroundColor: labelStyle.backgroundColor,
                    color: labelStyle.color,
                  }}
                >
                  <div className="d-flex justify-content-between align-items-start">
                    <h3
                      className="mb-0"
                      style={{
                        fontSize: "1rem",
                        fontWeight: 600,
                        color: "var(--color-text-main)",
                      }}
                    >
                      {note.note_title}
                    </h3>
                    <button
                      type="button"
                      onClick={() => handleDelete(note.note_id)}
                      className="btn btn-link p-0 ms-2"
                      style={{
                        color: "#ef4444",
                        textDecoration: "none",
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <p
                    className="mt-2 mb-1"
                    style={{
                      fontSize: "0.9rem",
                      color: "var(--color-text-main)",
                      overflowWrap: "break-word",
                      wordBreak: "break-word",
                      flexGrow: 1,
                    }}
                  >
                    {note?.note_text}
                  </p>

                  <span
                    style={{
                      fontSize: "0.75rem",
                      marginTop: "0.5rem",
                      opacity: 0.6,
                    }}
                  >
                    {note?.note_label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <AddNoteModal onAdd={handleAdd} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}
