import React, { useState } from 'react';
import { ComplianceFlag, ColorOption } from '../../types/client-profile.types';

interface ComplianceFlagsProps {
  initialFlags: ComplianceFlag[];
  flagColors: ColorOption[];
  canEdit: boolean;
}

/**
 * Component for managing compliance flags with edit/delete capabilities
 */
export function ComplianceFlags({ initialFlags, flagColors, canEdit }: ComplianceFlagsProps) {
  const [flags, setFlags] = useState<ComplianceFlag[]>(initialFlags);
  const [newFlagLabel, setNewFlagLabel] = useState('');
  const [newFlagColor, setNewFlagColor] = useState(flagColors[0]?.value || '');
  const [newFlagComment, setNewFlagComment] = useState('');
  
  const [editingFlagId, setEditingFlagId] = useState<number | null>(null);
  const [editingFlagLabel, setEditingFlagLabel] = useState('');
  const [editingFlagColor, setEditingFlagColor] = useState(flagColors[0]?.value || '');
  const [editingFlagComment, setEditingFlagComment] = useState('');

  const handleAddFlag = () => {
    if (!newFlagLabel.trim()) return;
    
    setFlags(f => [
      { 
        id: Date.now(), 
        label: newFlagLabel, 
        color: newFlagColor, 
        comment: newFlagComment 
      },
      ...f,
    ]);
    
    // Reset form
    setNewFlagLabel('');
    setNewFlagColor(flagColors[0]?.value || '');
    setNewFlagComment('');
  };

  const handleDeleteFlag = (id: number) => {
    setFlags(f => f.filter(flag => flag.id !== id));
  };

  const handleEditFlag = (flag: ComplianceFlag) => {
    setEditingFlagId(flag.id);
    setEditingFlagLabel(flag.label);
    setEditingFlagColor(flag.color);
    setEditingFlagComment(flag.comment);
  };

  const handleSaveEditFlag = (id: number) => {
    setFlags(f => f.map(flag => 
      flag.id === id 
        ? { 
            ...flag, 
            label: editingFlagLabel, 
            color: editingFlagColor, 
            comment: editingFlagComment 
          } 
        : flag
    ));
    
    // Reset editing state
    setEditingFlagId(null);
    setEditingFlagLabel('');
    setEditingFlagColor(flagColors[0]?.value || '');
    setEditingFlagComment('');
  };

  return (
    <>
      <div className="mb-2 font-semibold">Compliance Flags</div>
      
      {/* Add new flag form */}
      <div className="mb-4 flex gap-2 items-end">
        <input
          type="text"
          value={newFlagLabel}
          onChange={e => setNewFlagLabel(e.target.value)}
          placeholder="Flag label (e.g. High Risk)"
          className="border rounded px-2 py-1 text-sm"
          disabled={!canEdit}
        />
        <select
          value={newFlagColor}
          onChange={e => setNewFlagColor(e.target.value)}
          className="border rounded px-2 py-1 text-sm"
          disabled={!canEdit}
        >
          {flagColors.map(c => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
        <input
          type="text"
          value={newFlagComment}
          onChange={e => setNewFlagComment(e.target.value)}
          placeholder="Comment (optional)"
          className="border rounded px-2 py-1 text-sm flex-1"
          disabled={!canEdit}
        />
        <button 
          onClick={handleAddFlag} 
          className="px-3 py-1 bg-blue-600 text-white rounded" 
          disabled={!canEdit}
        >
          Add
        </button>
      </div>
      
      {/* Flags list */}
      <ul className="space-y-2 mb-6">
        {flags.map(flag => (
          <li key={flag.id} className="flex items-center gap-2">
            {editingFlagId === flag.id ? (
              <>
                <input
                  type="text"
                  value={editingFlagLabel}
                  onChange={e => setEditingFlagLabel(e.target.value)}
                  className="border rounded px-2 py-1 text-sm"
                  disabled={!canEdit}
                />
                <select
                  value={editingFlagColor}
                  onChange={e => setEditingFlagColor(e.target.value)}
                  className="border rounded px-2 py-1 text-sm"
                  disabled={!canEdit}
                >
                  {flagColors.map(c => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={editingFlagComment}
                  onChange={e => setEditingFlagComment(e.target.value)}
                  className="border rounded px-2 py-1 text-sm flex-1"
                  disabled={!canEdit}
                />
                <button 
                  onClick={() => handleSaveEditFlag(flag.id)} 
                  className="text-green-600 hover:underline" 
                  disabled={!canEdit}
                >
                  Save
                </button>
                <button 
                  onClick={() => setEditingFlagId(null)} 
                  className="text-gray-500 hover:underline"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span className={`inline-block px-2 py-0.5 rounded bg-${flag.color} text-white text-xs font-semibold`}>
                  {flag.label}
                </span>
                {flag.comment && (
                  <span className="text-xs text-gray-500 ml-2">({flag.comment})</span>
                )}
                {canEdit && (
                  <>
                    <button 
                      onClick={() => handleEditFlag(flag)} 
                      className="text-blue-600 hover:underline ml-2"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteFlag(flag.id)} 
                      className="text-red-600 hover:underline ml-2"
                    >
                      Delete
                    </button>
                  </>
                )}
              </>
            )}
          </li>
        ))}
        {flags.length === 0 && <li className="text-gray-400">No compliance flags.</li>}
      </ul>
    </>
  );
}
