"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import { Bold, Italic, Underline, List, Link2, Heading2, Heading3 } from 'lucide-react';

interface RichTextToolbarProps {
  targetElement: HTMLElement | null;
  onClose: () => void;
}

export default function RichTextToolbar({ targetElement, onClose }: RichTextToolbarProps) {
  const toolbarRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const updatePosition = useCallback(() => {
    if (!targetElement) return;
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || !selection.toString()) {
      onClose();
      return;
    }

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    
    let top = rect.top - 44;
    let left = rect.left + rect.width / 2;

    if (top < 8) top = rect.bottom + 8;

    const toolbarWidth = 280;
    if (left - toolbarWidth / 2 < 8) left = toolbarWidth / 2 + 8;
    if (left + toolbarWidth / 2 > window.innerWidth - 8) left = window.innerWidth - toolbarWidth / 2 - 8;

    setPosition({ top, left });
  }, [targetElement, onClose]);

  useEffect(() => {
    updatePosition();
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [updatePosition]);

  useEffect(() => {
    const handleMouseUp = () => {
      setTimeout(updatePosition, 0);
    };
    document.addEventListener('mouseup', handleMouseUp);
    return () => document.removeEventListener('mouseup', handleMouseUp);
  }, [updatePosition]);

  const exec = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    targetElement?.focus();
    updatePosition();
  };

  const handleLink = () => {
    const url = prompt('Enter URL:', 'https://');
    if (url) exec('createLink', url);
  };

  return (
    <div
      ref={toolbarRef}
      className="fixed z-[9999] flex items-center gap-0.5 px-1.5 py-1 bg-[#1a1d23]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] select-none"
      style={{
        top: position.top,
        left: position.left,
        transform: 'translateX(-50%)',
      }}
      onMouseDown={(e) => e.preventDefault()}
    >
      <ToolbarButton onClick={() => exec('bold')} icon={<Bold className="w-3.5 h-3.5" />} label="Bold" />
      <ToolbarButton onClick={() => exec('italic')} icon={<Italic className="w-3.5 h-3.5" />} label="Italic" />
      <ToolbarButton onClick={() => exec('underline')} icon={<Underline className="w-3.5 h-3.5" />} label="Underline" />
      <div className="w-px h-5 bg-white/10 mx-1" />
      <ToolbarButton onClick={() => exec('formatBlock', 'h2')} icon={<Heading2 className="w-3.5 h-3.5" />} label="Heading 2" />
      <ToolbarButton onClick={() => exec('formatBlock', 'h3')} icon={<Heading3 className="w-3.5 h-3.5" />} label="Heading 3" />
      <div className="w-px h-5 bg-white/10 mx-1" />
      <ToolbarButton onClick={() => exec('insertUnorderedList')} icon={<List className="w-3.5 h-3.5" />} label="Bullet List" />
      <ToolbarButton onClick={handleLink} icon={<Link2 className="w-3.5 h-3.5" />} label="Insert Link" />
    </div>
  );
}

function ToolbarButton({ onClick, icon, label }: { onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
      title={label}
    >
      {icon}
    </button>
  );
}
