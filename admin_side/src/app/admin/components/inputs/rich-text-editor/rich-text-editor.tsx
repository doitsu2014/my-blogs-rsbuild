import React, { useEffect, useRef, useState } from 'react';
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

// Import highlight.js for code syntax highlighting
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';

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

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  id,
  readOnly = false,
  defaultValue = '',
  onTextChange,
  onSelectionChange,
  className
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!editorRef.current || isInitialized) return;

    // Quill configuration
    const quill = new Quill(editorRef.current, {
      theme: 'snow',
      readOnly,
      modules: {
        syntax: {
          highlight: (text: string) => hljs.highlightAuto(text).value,
        },
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
            ['fullscreen'],
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
          buttonTitle: 'Edit HTML',
          syntax: false,
        },
        fullscreen: {
          // Fullscreen module options
        },
      },
    });

    quillRef.current = quill;
    setIsInitialized(true);

    // Set initial content
    if (defaultValue) {
      quill.root.innerHTML = defaultValue;
    }

    // Handle text changes
    quill.on('text-change', () => {
      const html = quill.root.innerHTML;
      if (onTextChange) {
        onTextChange(html);
      }
    });

    // Handle selection changes
    if (onSelectionChange) {
      quill.on('selection-change', (...args) => {
        onSelectionChange(...args);
      });
    }

    // Cleanup
    return () => {
      if (quillRef.current) {
        quillRef.current = null;
      }
    };
  }, []);

  // Update content when defaultValue changes
  useEffect(() => {
    if (quillRef.current && isInitialized && defaultValue !== undefined) {
      const currentContent = quillRef.current.root.innerHTML;
      if (currentContent !== defaultValue) {
        quillRef.current.root.innerHTML = defaultValue;
      }
    }
  }, [defaultValue, isInitialized]);

  // Update readOnly state
  useEffect(() => {
    if (quillRef.current) {
      quillRef.current.enable(!readOnly);
    }
  }, [readOnly]);

  return (
    <div className={`rich-text-editor-container ${className || ''}`} id={id}>
      <div ref={editorRef} className="quill-editor" />
    </div>
  );
};

export default RichTextEditor;
