import React from 'react';
import type { RichTextEditorProps } from './rich-text-editor';

// Lazy load the rich text editor component for better performance
const RichTextEditor = React.lazy(() => import('./rich-text-editor'));

/**
 * Wrapper component for the Rich Text Editor
 * Handles lazy loading with a suspense boundary
 */
export const RichTextEditorWrapper: React.FC<RichTextEditorProps> = (props) => {
  return (
    <React.Suspense
      fallback={
        <div className="flex justify-center items-center min-h-[400px] bg-base-200 rounded-lg">
          <div className="flex flex-col items-center gap-3">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <span className="text-sm text-base-content/70">Loading editor...</span>
          </div>
        </div>
      }
    >
      <RichTextEditor {...props} />
    </React.Suspense>
  );
};
