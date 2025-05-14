import { useState } from 'react';
import { Note } from '../types/client-profile.types';

/**
 * Hook for managing client notes
 * @param initialNotes - Initial list of notes
 */
export function useNotes(initialNotes: Note[]) {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [newNote, setNewNote] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState('');

  // Add a new note
  const addNote = () => {
    if (!newNote.trim()) return;
    
    const note: Note = {
      id: Date.now(),
      text: newNote,
      created: new Date().toLocaleString(),
    };
    
    setNotes(current => [note, ...current]);
    setNewNote('');
    
    // In a real app, this would also call an API to save the note
  };

  // Start editing a note
  const startEditingNote = (id: number, text: string) => {
    setEditingNoteId(id);
    setEditingText(text);
  };

  // Save edited note
  const saveEditedNote = (id: number) => {
    if (!editingText.trim()) return;
    
    setNotes(current => 
      current.map(note => 
        note.id === id ? { ...note, text: editingText } : note
      )
    );
    
    setEditingNoteId(null);
    setEditingText('');
    
    // In a real app, this would also call an API to update the note
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingNoteId(null);
    setEditingText('');
  };

  // Delete a note
  const deleteNote = (id: number) => {
    setNotes(current => current.filter(note => note.id !== id));
    
    // In a real app, this would also call an API to delete the note
  };

  return {
    notes,
    newNote,
    editingNoteId,
    editingText,
    setNewNote,
    setEditingText,
    addNote,
    startEditingNote,
    saveEditedNote,
    cancelEditing,
    deleteNote,
  };
}
