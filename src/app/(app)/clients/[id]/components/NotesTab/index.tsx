import React, { useState, ChangeEvent, KeyboardEvent } from 'react';
import { Note } from '../../types/client-profile.types';
import { Section } from '../Section';

interface NotesTabProps {
  initialNotes: Note[];
}

/**
 * Component for displaying and managing client notes
 */
export function NotesTab({ initialNotes }: NotesTabProps) {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [newNote, setNewNote] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState('');

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    
    setNotes(n => [
      { id: Date.now(), text: newNote, created: new Date().toLocaleString() },
      ...n,
    ]);
    setNewNote('');
  };

  const handleDeleteNote = (id: number) => {
    setNotes(n => n.filter(note => note.id !== id));
  };

  const handleEditNote = (id: number, text: string) => {
    setEditingNoteId(id);
    setEditingText(text);
  };

  const handleSaveEditNote = (id: number) => {
    setNotes(n => n.map(note => 
      note.id === id ? { ...note, text: editingText } : note
    ));
    setEditingNoteId(null);
    setEditingText('');
  };

  return (
    <Section title="Notes">
      {/* The Section component requires children */}
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          value={newNote}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setNewNote(e.target.value)}
          placeholder="Add a note..."
          className="border rounded px-2 py-1 text-sm flex-1"
          onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => { if (e.key === 'Enter') handleAddNote(); }}
        />
        <button
          onClick={handleAddNote}
          className="px-3 py-1 bg-blue-600 text-white rounded"
        >
          Add
        </button>
      </div>
      
      <ul className="list-disc pl-5 text-gray-700 space-y-2">
        {notes.map(note => (
          <li key={note.id} className="flex items-center gap-2">
            {editingNoteId === note.id ? (
              <>
                <input
                  type="text"
                  value={editingText}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setEditingText(e.target.value)}
                  className="border rounded px-2 py-1 text-sm flex-1"
                  onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => { if (e.key === 'Enter') handleSaveEditNote(note.id); }}
                />
                <button 
                  onClick={() => handleSaveEditNote(note.id)} 
                  className="text-green-600 hover:underline"
                >
                  Save
                </button>
                <button 
                  onClick={() => setEditingNoteId(null)} 
                  className="text-gray-500 hover:underline"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span>{note.text}</span>
                <span className="text-xs text-gray-400 ml-2">({note.created})</span>
                <button 
                  onClick={() => handleEditNote(note.id, note.text)} 
                  className="text-blue-600 hover:underline ml-2"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDeleteNote(note.id)} 
                  className="text-red-600 hover:underline ml-2"
                >
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
        {notes.length === 0 && <li className="text-gray-400">No notes yet.</li>}
      </ul>
    </Section>
  );
}
