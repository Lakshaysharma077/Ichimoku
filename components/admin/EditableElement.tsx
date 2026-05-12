"use client";

import React, { useRef, useState, useCallback, useEffect, memo } from 'react';
import { useEditStore } from '@/lib/store/useEditStore';
import { clsx } from 'clsx';
import { Pencil, Upload, Loader2 } from 'lucide-react';
import RichTextToolbar from './RichTextToolbar';

interface EditableElementProps {
  section: string;
  path: string[];
  content: string;
  type?: 'text' | 'image' | 'textarea';
  className?: string;
  as?: 'span' | 'div' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'label';
  onSave?: (newValue: string) => void;
}

/**
 * Inner contentEditable component that NEVER re-renders after mount.
 * This prevents React from resetting the innerHTML while the user edits.
 */
const ContentEditable = memo(function ContentEditable({
  tagName,
  initialContent,
  className: initialClassName,
  section,
  pathStr,
  onChangeRef,
  onFocusRef,
  onBlurRef,
}: {
  tagName: string;
  initialContent: string;
  className?: string;
  section: string;
  pathStr: string;
  onChangeRef: React.RefObject<((html: string) => void) | null>;
  onFocusRef: React.RefObject<(() => void) | null>;
  onBlurRef: React.RefObject<((html: string) => void) | null>;
}) {
  const elRef = useRef<HTMLElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    const handleInput = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        if (elRef.current && onChangeRef.current) {
          onChangeRef.current(elRef.current.innerHTML);
        }
      }, 1500);
    };

    const handleBlur = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (elRef.current && onBlurRef.current) {
        onBlurRef.current(elRef.current.innerHTML);
      }
    };

    const handleFocus = () => {
      if (onFocusRef.current) onFocusRef.current();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && tagName === 'span') {
        e.preventDefault();
        document.execCommand('insertLineBreak');
      }
      if (e.key === 'Escape') {
        el.blur();
      }
    };

    el.addEventListener('input', handleInput);
    el.addEventListener('blur', handleBlur);
    el.addEventListener('focus', handleFocus);
    el.addEventListener('keydown', handleKeyDown);

    return () => {
      el.removeEventListener('input', handleInput);
      el.removeEventListener('blur', handleBlur);
      el.removeEventListener('focus', handleFocus);
      el.removeEventListener('keydown', handleKeyDown);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const Tag = tagName as any;

  return (
    <Tag
      ref={elRef}
      contentEditable
      suppressContentEditableWarning
      className={clsx(
        initialClassName,
        "outline-none cursor-text"
      )}
      data-section={section}
      data-path={pathStr}
      dangerouslySetInnerHTML={{ __html: initialContent }}
    />
  );
}, () => true); // Always return true = NEVER re-render

export default function EditableElement({
  section,
  path,
  content,
  type = 'text',
  className,
  as: Component = 'span',
  onSave
}: EditableElementProps) {
  const { isEditMode, addChange } = useEditStore();
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showToolbar, setShowToolbar] = useState(false);
  const [imgSrc, setImgSrc] = useState(content);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const doSave = useCallback((newValue: string) => {
    if (newValue !== content) {
      addChange(section, path, newValue);
      if (onSave) onSave(newValue);
    }
  }, [content, section, path, onSave, addChange]);

  // Stable refs for callbacks so the memoized child never needs to re-render
  const onChangeRef = useRef<((html: string) => void) | null>(null);
  const onFocusRef = useRef<(() => void) | null>(null);
  const onBlurRef = useRef<((html: string) => void) | null>(null);

  onChangeRef.current = (html: string) => {
    doSave(html);
  };

  onFocusRef.current = () => {
    setIsFocused(true);
  };

  onBlurRef.current = (html: string) => {
    setIsFocused(false);
    setShowToolbar(false);
    doSave(html);
  };

  // Block link navigation in edit mode
  const handleClick = (e: React.MouseEvent) => {
    if (isEditMode) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const handleImageClick = (e: React.MouseEvent) => {
    if (isEditMode && type === 'image') {
      e.preventDefault();
      e.stopPropagation();
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      if (res.ok) {
        const data = await res.json();
        setImgSrc(data.url);
        doSave(data.url);
      } else throw new Error('upload failed');
    } catch {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setImgSrc(base64);
        doSave(base64);
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(false);
    }
  };

  // --- Non-edit mode: render plain content ---
  if (!isEditMode) {
    if (type === 'image') {
      return <img src={content} className={className} alt="" />;
    }
    return <Component className={className}>{content}</Component>;
  }

  // --- Edit mode: image type ---
  if (type === 'image') {
    return (
      <div
        className={clsx("relative group/edit inline-block", className)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img
          src={imgSrc}
          className={clsx("cursor-pointer transition-all duration-300", isHovered ? "opacity-75 ring-2 ring-accent/40 rounded" : "")}
          onClick={handleImageClick}
          alt=""
        />
        <div
          className={clsx(
            "absolute inset-0 flex items-center justify-center transition-all duration-300 cursor-pointer z-10",
            isHovered ? "opacity-100" : "opacity-0"
          )}
        >
          <div className="bg-accent text-bg-primary p-2.5 rounded-full shadow-lg transform hover:scale-110 transition-transform">
            {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          </div>
        </div>
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
        <span className={clsx(
          "absolute -top-7 left-1/2 -translate-x-1/2 bg-accent text-bg-primary text-[9px] font-bold px-2 py-1 rounded-md whitespace-nowrap transition-all duration-200 pointer-events-none z-20",
          isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
        )}>
          Click to replace image
        </span>
        <div className="absolute top-1 right-1 bg-accent/90 text-bg-primary p-1 rounded-md opacity-0 group-hover/edit:opacity-100 transition-opacity pointer-events-none z-20">
          <Pencil className="w-3 h-3" />
        </div>
      </div>
    );
  }

  // --- Edit mode: text type ---
  const label = path[path.length - 1]
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (s) => s.toUpperCase())
    .trim();

  return (
    <span
      className="relative inline-flex"
      onClick={handleClick}
      onClickCapture={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setShowToolbar(false); }}
    >
      {/* Visual ring overlay - separate from the editable element */}
      {(isHovered || isFocused) && (
        <div
          className={clsx(
            "absolute inset-0 rounded-sm pointer-events-none transition-all duration-200 z-0",
            isFocused
              ? "ring-1 ring-accent/50 bg-accent/[0.04] shadow-[0_0_20px_rgba(251,225,120,0.08)]"
              : "ring-1 ring-accent/30 bg-accent/[0.02]"
          )}
        />
      )}

      {/* The actual editable element - NEVER re-renders */}
      <ContentEditable
        tagName={Component as string}
        initialContent={content}
        className={className}
        section={section}
        pathStr={path.join('.')}
        onChangeRef={onChangeRef}
        onFocusRef={onFocusRef}
        onBlurRef={onBlurRef}
      />

      {/* Hover label */}
      {isHovered && !isFocused && (
        <span className={clsx(
          "absolute -top-6 left-0 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[8px] font-bold uppercase tracking-wider transition-all duration-200 pointer-events-none z-30 whitespace-nowrap",
          "bg-accent text-bg-primary shadow-sm"
        )}>
          <Pencil className="w-2.5 h-2.5" />
          {label}
        </span>
      )}

      {showToolbar && (
        <RichTextToolbar
          targetElement={document.querySelector(`[data-section="${section}"][data-path="${path.join('.')}"]`) as HTMLElement}
          onClose={() => setShowToolbar(false)}
        />
      )}
    </span>
  );
}
