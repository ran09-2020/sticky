import { useState, useRef, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import type { BoardTopic } from '@/types/luach';

interface BoardTabsProps {
  topics: BoardTopic[];
  activeTopicId: string;
  onSelectTopic: (id: string) => void;
  onAddTopic: (name: string) => void;
  onRenameTopic: (id: string, name: string) => void;
  onRemoveTopic: (id: string) => void;
  isProtected?: boolean;
}

export function BoardTabs({
  topics,
  activeTopicId,
  onSelectTopic,
  onAddTopic,
  onRenameTopic,
  onRemoveTopic,
  isProtected
}: BoardTabsProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTopicName, setNewTopicName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAdding || editingId) {
      inputRef.current?.focus();
    }
  }, [isAdding, editingId]);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTopicName.trim()) {
      onAddTopic(newTopicName.trim());
    }
    setIsAdding(false);
    setNewTopicName('');
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId && editName.trim()) {
      onRenameTopic(editingId, editName.trim());
    }
    setEditingId(null);
    setEditName('');
  };

  return (
    <div className="absolute top-16 left-0 right-0 z-40 flex justify-center pointer-events-none" dir="rtl">
      <div className="flex items-center gap-1 bg-white/80 backdrop-blur shadow-sm rounded-b-lg px-2 pb-1 pt-2 pointer-events-auto overflow-x-auto max-w-full border border-t-0 border-gray-200">
        {topics.map(topic => (
          <div key={topic.id} className="relative group flex items-center">
            {editingId === topic.id ? (
              <form onSubmit={handleEditSubmit} className="flex items-center">
                <input
                  ref={inputRef}
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  onBlur={handleEditSubmit}
                  className="w-24 px-2 py-1 text-sm border-b-2 border-blue-500 bg-transparent outline-none"
                  dir="auto"
                />
              </form>
            ) : (
              <button
                onClick={() => onSelectTopic(topic.id)}
                onDoubleClick={() => {
                  if (!isProtected) {
                    setEditingId(topic.id);
                    setEditName(topic.name);
                  }
                }}
                className={`px-6 py-1.5 text-sm font-medium rounded-t-md transition-colors relative ${
                  activeTopicId === topic.id
                    ? 'bg-white text-blue-600 border-b-2 border-blue-500'
                    : 'text-gray-600 hover:bg-white/50 hover:text-gray-900 border-b-2 border-transparent'
                }`}
                title={!isProtected ? "לחיצה כפולה לשינוי שם" : ""}
              >
                {topic.name}
              </button>
            )}

            {!isProtected && topics.length > 1 && !editingId && activeTopicId === topic.id && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveTopic(topic.id);
                }}
                className="absolute left-1 opacity-0 group-hover:opacity-100 p-0.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"
                title="מחק נושא"
              >
                <X size={12} />
              </button>
            )}
          </div>
        ))}

        {!isProtected && (
          <div className="flex items-center mr-2 border-r border-gray-300 pr-2">
            {isAdding ? (
              <form onSubmit={handleAddSubmit} className="flex items-center">
                <input
                  ref={inputRef}
                  type="text"
                  value={newTopicName}
                  onChange={e => setNewTopicName(e.target.value)}
                  onBlur={handleAddSubmit}
                  placeholder="נושא חדש..."
                  className="w-24 px-2 py-1 text-sm border-b-2 border-blue-500 bg-transparent outline-none"
                  dir="auto"
                />
              </form>
            ) : (
              <button
                onClick={() => setIsAdding(true)}
                className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                title="הוסף נושא"
              >
                <Plus size={16} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
