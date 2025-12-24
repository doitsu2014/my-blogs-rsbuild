import React, { useEffect, useRef } from 'react';

// Note: This is a simplified version of the rich text editor
// The full implementation with Quill and all plugins will be added when needed
// For now, this provides a basic textarea for content editing

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
  key,
  id,
  readOnly,
  defaultValue,
  onTextChange,
  onSelectionChange,
  className
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current && defaultValue) {
      textareaRef.current.value = defaultValue;
    }
  }, [defaultValue]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onTextChange) {
      onTextChange(e.target.value);
    }
  };

  return (
    <div className={className} id={id} key={key}>
      <div className="border border-base-300 rounded-md p-4 bg-base-100">
        <div className="text-sm text-warning mb-2">
          📝 Note: Rich text editor with Quill will be fully implemented in a future update.
          For now, use this textarea for HTML content.
        </div>
        <textarea
          ref={textareaRef}
          className="textarea textarea-bordered w-full min-h-96 font-mono text-sm"
          placeholder="Enter your blog content here (HTML supported)..."
          defaultValue={defaultValue}
          onChange={handleChange}
          readOnly={readOnly}
          disabled={readOnly}
        />
        <div className="text-xs text-gray-500 mt-2">
          Supports HTML tags. Basic formatting: &lt;h1&gt;, &lt;h2&gt;, &lt;p&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;ul&gt;, &lt;ol&gt;, &lt;li&gt;, &lt;a&gt;, &lt;img&gt;, &lt;code&gt;, &lt;pre&gt;
        </div>
      </div>
    </div>
  );
};

export default RichTextEditor;
