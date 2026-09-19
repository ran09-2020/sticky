import { useState, useRef, useEffect } from 'react';
import { BoardTabs } from './BoardTabs';
import type { BoardTopic } from '@/types/luach';

interface HeaderProps {
  slug: string;
  title: string;
  author: string;
  isProtected: boolean;
  onTitleChange: (title: string) => void;
  onAuthorChange: (author: string) => void;
  topics?: BoardTopic[];
  activeTopicId?: string;
  onSelectTopic?: (id: string) => void;
  onAddTopic?: (name: string) => void;
  onRenameTopic?: (id: string, name: string) => void;
  onRemoveTopic?: (id: string) => void;
}

export function Header({
  slug,
  title,
  author,
  isProtected,
  onTitleChange,
  onAuthorChange,
  topics,
  activeTopicId,
  onSelectTopic,
  onAddTopic,
  onRenameTopic,
  onRemoveTopic
}: HeaderProps) {
  const [editingTitle, setEditingTitle] = useState(false);
  const [localTitle, setLocalTitle] = useState(title);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLocalTitle(title);
  }, [title]);

  useEffect(() => {
    if (editingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [editingTitle]);

  const handleTitleSubmit = () => {
    setEditingTitle(false);
    if (localTitle !== title) {
      onTitleChange(localTitle);
    }
  };

  return (
    <div data-ev-id="ev_ee0bfebf47"
    className="fixed top-4 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur rounded-xl shadow-lg px-4 py-2 flex items-center gap-4 z-40"
    dir="rtl">

      {/* Board Name */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-bold text-gray-800">
          לוח: {decodeURIComponent(slug).toUpperCase()}
        </span>
      </div>

      {/* Divider */}
      <div className="w-px h-4 bg-gray-300" />

      {/* Topic */}
      <div data-ev-id="ev_01c6118ad4" className="flex items-center gap-2">
        <label className="text-xs text-gray-500">נושא:</label>
        {editingTitle && !isProtected ?
        <input data-ev-id="ev_a5d5ac2aed"
        ref={titleInputRef}
        type="text"
        value={localTitle}
        onChange={(e) => setLocalTitle(e.target.value)}
        onBlur={handleTitleSubmit}
        onKeyDown={(e) => e.key === 'Enter' && handleTitleSubmit()}
        className="px-2 py-0.5 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="נושא הלוח" /> :


        <h1 data-ev-id="ev_2e71df04da"
        className={`text-sm font-medium ${
        !isProtected ? 'cursor-pointer hover:text-blue-600' : ''}`
        }
        onClick={() => !isProtected && setEditingTitle(true)}
        title={!isProtected ? 'לחץ לעריכה' : undefined}>

            {title || 'ללא נושא'}
          </h1>
        }
      </div>

      {/* Tabs */}
      {topics && activeTopicId && onSelectTopic && onAddTopic && onRenameTopic && onRemoveTopic && (
        <>
          <div className="w-px h-4 bg-gray-300 mx-2" />
          <BoardTabs 
            topics={topics}
            activeTopicId={activeTopicId}
            onSelectTopic={onSelectTopic}
            onAddTopic={onAddTopic}
            onRenameTopic={onRenameTopic}
            onRemoveTopic={onRemoveTopic}
            isProtected={isProtected}
          />
        </>
      )}

      {/* Divider */}
      <div data-ev-id="ev_5344e9d381" className="w-px h-4 bg-gray-300" />

      {/* Author input */}
      <div data-ev-id="ev_8fecd1c9bf" className="flex items-center gap-2">
        <label data-ev-id="ev_a69a5c3ce2" className="text-xs text-gray-500">השם שלי:</label>
        <input data-ev-id="ev_3e17f7e236"
        type="text"
        value={author}
        onChange={(e) => onAuthorChange(e.target.value)}
        className="px-2 py-0.5 text-sm border rounded w-24 focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="אורח" />

      </div>
    </div>);

}