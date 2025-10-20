import '../styles/Workspace.css';
import React, { useState, useRef, useEffect, useCallback } from 'react';

interface TextItem {
  id: number;
  content: string;
}

export default function Textarea() {
  const [texts, setTexts] = useState<TextItem[]>([]);
  const nextId = useRef(1);
  const lastTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Autofocus the latest textarea added
  useEffect(() => {
    if (lastTextareaRef.current) {
      lastTextareaRef.current.focus();
    }
  }, [texts]);

  // Add new textarea on empty-space click
  const handleWorkspaceClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    // Prevent multiple additions when clicking a textarea
    if (e.target !== e.currentTarget) return;

    const id = nextId.current++;
    setTexts(prev => [...prev, { id, content: '' }]);
  }, []);

  const handleChange = (id: number, value: string) => {
    setTexts(prev => prev.map(t => (t.id === id ? { ...t, content: value } : t)));
  };

  return (
    <div className="workspace" onClick={handleWorkspaceClick}>
      {texts.map((text, index) => (
        <textarea
          key={text.id}
          ref={index === texts.length - 1 ? lastTextareaRef : null}
          value={text.content}
          onChange={(e) => handleChange(text.id, e.target.value)}
          onClick={(e) => e.stopPropagation()} // don’t trigger workspace click
          className="workspace-textarea"
        />
      ))}
    </div>
  );
}
