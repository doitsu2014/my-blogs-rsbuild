import { Suspense, lazy } from 'react';

// Lazy load the homepage module
const HomepageApp = lazy(() => import('homepage/App'));

interface ModuleLoaderProps {
  moduleName: string;
}

const ModuleLoader: React.FC<ModuleLoaderProps> = ({ moduleName }) => {
  const renderModule = () => {
    switch (moduleName) {
      case 'homepage':
        return (
          <Suspense fallback={<div>Loading Homepage...</div>}>
            <HomepageApp />
          </Suspense>
        );
      default:
        return <div>Module not found: {moduleName}</div>;
    }
  };

  return (
    <div className="module-container">
      {renderModule()}
    </div>
  );
};

export default ModuleLoader;