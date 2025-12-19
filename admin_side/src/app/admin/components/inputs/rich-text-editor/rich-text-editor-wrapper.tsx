import { useEffect, useState } from 'react';
import { RichTextEditorProps } from './rich-text-editor';

// Lazy load the rich text editor component
const RichTextEditor = React.lazy(() => import('./rich-text-editor'));
import React from 'react';

export const RichTextEditorWrapper: React.FC<RichTextEditorProps> = ({
  id,
  readOnly,
  defaultValue,
  onTextChange,
  onSelectionChange,
  className
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [editorDefaultValue, setEditorDefaultValue] = useState('');

  useEffect(() => {
    setIsLoading(true);
    if (defaultValue) {
      setTimeout(() => {
        setEditorDefaultValue(defaultValue);
        setIsLoading(false);
      }, 500);
    } else {
      setIsLoading(false);
    }
  }, [defaultValue]);

  return (
    <div>
      {isLoading ? (
        <div className="loading loading-spinner loading-lg"></div>
      ) : (
        <React.Suspense fallback={<div className="loading loading-spinner loading-lg"></div>}>
          <RichTextEditor
            key={id}
            id={id}
            readOnly={readOnly}
            defaultValue={editorDefaultValue}
            onTextChange={onTextChange}
            onSelectionChange={onSelectionChange}
            className={className}
          />
        </React.Suspense>
      )}
    </div>
  );
};
