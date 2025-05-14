import { useState } from 'react';
import { ComplianceFlag, ColorOption } from '../types/client-profile.types';

/**
 * Hook for managing compliance flags
 * @param initialFlags - Initial list of compliance flags
 * @param defaultColorValue - Default color value for new flags
 */
export function useComplianceFlags(initialFlags: ComplianceFlag[], defaultColorValue: string) {
  const [flags, setFlags] = useState<ComplianceFlag[]>(initialFlags);
  
  // Form state for new flag
  const [newFlagLabel, setNewFlagLabel] = useState('');
  const [newFlagColor, setNewFlagColor] = useState(defaultColorValue);
  const [newFlagComment, setNewFlagComment] = useState('');
  
  // Form state for editing flag
  const [editingFlagId, setEditingFlagId] = useState<number | null>(null);
  const [editingFlagLabel, setEditingFlagLabel] = useState('');
  const [editingFlagColor, setEditingFlagColor] = useState(defaultColorValue);
  const [editingFlagComment, setEditingFlagComment] = useState('');

  // Add a new flag
  const addFlag = () => {
    if (!newFlagLabel.trim()) return;
    
    const newFlag: ComplianceFlag = {
      id: Date.now(),
      label: newFlagLabel,
      color: newFlagColor,
      comment: newFlagComment
    };
    
    setFlags(current => [newFlag, ...current]);
    
    // Reset form
    setNewFlagLabel('');
    setNewFlagColor(defaultColorValue);
    setNewFlagComment('');
    
    // In a real app, this would also call an API to save the flag
  };

  // Start editing a flag
  const startEditingFlag = (flag: ComplianceFlag) => {
    setEditingFlagId(flag.id);
    setEditingFlagLabel(flag.label);
    setEditingFlagColor(flag.color);
    setEditingFlagComment(flag.comment);
  };

  // Save edited flag
  const saveEditedFlag = (id: number) => {
    if (!editingFlagLabel.trim()) return;
    
    setFlags(current => 
      current.map(flag => 
        flag.id === id 
          ? { 
              ...flag, 
              label: editingFlagLabel, 
              color: editingFlagColor, 
              comment: editingFlagComment 
            } 
          : flag
      )
    );
    
    // Reset editing state
    cancelEditingFlag();
    
    // In a real app, this would also call an API to update the flag
  };

  // Cancel editing
  const cancelEditingFlag = () => {
    setEditingFlagId(null);
    setEditingFlagLabel('');
    setEditingFlagColor(defaultColorValue);
    setEditingFlagComment('');
  };

  // Delete a flag
  const deleteFlag = (id: number) => {
    setFlags(current => current.filter(flag => flag.id !== id));
    
    // In a real app, this would also call an API to delete the flag
  };

  return {
    // State
    flags,
    newFlagLabel,
    newFlagColor,
    newFlagComment,
    editingFlagId,
    editingFlagLabel,
    editingFlagColor,
    editingFlagComment,
    
    // Setters
    setNewFlagLabel,
    setNewFlagColor,
    setNewFlagComment,
    
    // Actions
    addFlag,
    startEditingFlag,
    saveEditedFlag,
    cancelEditingFlag,
    deleteFlag
  };
}
