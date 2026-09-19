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
    <div className="flex items-center gap-1 overflow-x-auto max-w-[400px] shrink-0" dir="rtl">
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
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors relative ${
                  activeTopicId === topic.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
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
                className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 p-0.5 text-white bg-red-500 hover:bg-red-600 rounded-full shadow-sm"
                title="מחק נושא"
              >
                <X size={10} />
              </button>
            )}
          </div>
        ))}

        {!isProtected && (
          <div className="flex items-center mr-1 pl-1">
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
  );
}
