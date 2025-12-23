import React from 'react';
import { Button } from './components/Button';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LoadingSkeleton } from './components/LoadingSkeleton';

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        title="Common Side Module" 
        subtitle="Shared Components Library"
      />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">Welcome to Common Side</h2>
            <p className="text-gray-700 mb-4">
              This module exposes shared components that can be used by client_side and admin_side modules.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">Exposed Components:</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li><code className="bg-gray-100 px-2 py-1 rounded">./Button</code> - Reusable button component with variants</li>
              <li><code className="bg-gray-100 px-2 py-1 rounded">./Header</code> - Common header component</li>
              <li><code className="bg-gray-100 px-2 py-1 rounded">./Footer</code> - Common footer component</li>
              <li><code className="bg-gray-100 px-2 py-1 rounded">./LoadingSkeleton</code> - Loading state placeholder</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">Component Examples:</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-medium mb-2">Buttons</h4>
                <div className="flex space-x-3">
                  <Button variant="primary" onClick={() => alert('Primary clicked!')}>
                    Primary Button
                  </Button>
                  <Button variant="secondary" onClick={() => alert('Secondary clicked!')}>
                    Secondary Button
                  </Button>
                  <Button variant="danger" onClick={() => alert('Danger clicked!')}>
                    Danger Button
                  </Button>
                  <Button disabled>Disabled Button</Button>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Loading Skeleton</h4>
                <div className="bg-white p-4 rounded border border-gray-200">
                  <LoadingSkeleton rows={3} />
                </div>
              </div>
            </div>
          </section>

          <section className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">Usage in Other Modules</h3>
            <p className="text-gray-700 mb-4">
              To use these components in client_side or admin_side modules, configure Module Federation remote:
            </p>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto">
{`// rsbuild.config.ts
remotes: {
  common_side: 'common_side@http://localhost:3003/mf-manifest.json'
}

// In your component
import { lazy } from 'react';
const Button = lazy(() => import('common_side/Button'));`}
            </pre>
          </section>
        </div>
      </main>

      <Footer 
        copyrightText="© 2024 Common Side Module"
        links={[
          { label: 'Documentation', href: '#' },
          { label: 'GitHub', href: '#' },
        ]}
      />
    </div>
  );
};

export default App;
