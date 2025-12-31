import React, { useEffect, useRef } from 'react';

// highlight.js is loaded globally via init-highlight.ts pre-entry
// No need to import it here

import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import './rich-text-editor.css';

// Import Quill plugins
import QuillTableBetter from 'quill-table-better';
import 'quill-table-better/dist/quill-table-better.css';
import htmlEditButton from 'quill-html-edit-button';
import ImageResize from 'quill-resize-image';
// @ts-ignore - No types available
import QuillFullscreen from 'quill-toggle-fullscreen-button';

// Register Quill modules
Quill.register('modules/table-better', QuillTableBetter);
Quill.register('modules/htmlEditButton', htmlEditButton);
Quill.register('modules/imageResize', ImageResize);
Quill.register('modules/fullscreen', QuillFullscreen);

export interface RichTextEditorProps {
  key?: string;
  id?: string;
  readOnly?: boolean;
  defaultValue?: string;
  onTextChange?: (html: string) => void;
  onSelectionChange?: (...args: any[]) => void;
  className?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  id,
  readOnly = false,
  defaultValue = '',
  onTextChange,
  onSelectionChange,
  className
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Prevent double initialization
    if (quillRef.current) return;

    // Clear any existing content first
    containerRef.current.innerHTML = '';

    const editorDiv = document.createElement('div');
    containerRef.current.appendChild(editorDiv);

    const quill = new Quill(editorDiv, {
      theme: 'snow',
      readOnly,
      modules: {
        syntax: true,
        toolbar: {
          container: [
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ font: [] }],
            [{ size: ['small', false, 'large', 'huge'] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ color: [] }, { background: [] }],
            [{ script: 'sub' }, { script: 'super' }],
            [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
            [{ indent: '-1' }, { indent: '+1' }],
            [{ align: [] }],
            ['blockquote', 'code-block'],
            ['link', 'image', 'video'],
            ['table-better'],
            ['clean'],
          ],
        },
        'table-better': {
          operationMenu: {
            items: {
              unmergeCells: {
                text: 'Unmerge cells',
              },
            },
          },
        },
        imageResize: {
          displaySize: true,
          modules: ['Resize', 'DisplaySize', 'Toolbar'],
        },
        htmlEditButton: {
          debug: false,
          msg: 'Edit HTML',
          okText: 'Save',
          cancelText: 'Cancel',
          buttonHTML: '&lt;&gt;',
          prependSelector: 'div#ql-html', // a string used to select where you want to insert the overlayContainer, default: null (appends to body),
          buttonTitle: 'Edit HTML',
          syntax: true,
          editorModules: {}
        },
        fullscreen: {},
      },
    });

    quillRef.current = quill;

    if (defaultValue) {
      quill.root.innerHTML = defaultValue;
    }

    quill.on('text-change', () => {
      if (onTextChange) {
        onTextChange(quill.root.innerHTML);
      }
    });

    if (onSelectionChange) {
      quill.on('selection-change', (...args) => {
        onSelectionChange(...args);
      });
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
      quillRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (quillRef.current && defaultValue !== undefined) {
      const currentContent = quillRef.current.root.innerHTML;
      if (currentContent !== defaultValue) {
        quillRef.current.root.innerHTML = defaultValue;
      }
    }
  }, [defaultValue]);

  useEffect(() => {
    if (quillRef.current) {
      quillRef.current.enable(!readOnly);
    }
  }, [readOnly]);

  return (
    <div
      ref={containerRef}
      className={`rich-text-editor-container ${className || ''}`}
      id={id}
    />
  );
};

export default RichTextEditor;
