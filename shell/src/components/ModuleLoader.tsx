import { Suspense, lazy } from 'react';

interface ModuleLoaderProps {
  moduleName: string;
}

const ModuleLoader: React.FC<ModuleLoaderProps> = ({ moduleName }) => {
  const renderModule = () => {
    switch (moduleName) {
      case 'client_side': {
        const ClientSideApp = lazy(() => import('client_side/App'));
        return (
          <Suspense fallback={<div>Loading ClientSide...</div>}>
            <ClientSideApp />
          </Suspense>
        );
      }
      case 'admin_side': {
        const AdminSideApp = lazy(() => import('admin_side/App'));
        return (
          <Suspense fallback={<div>Loading AdminSide...</div>}>
            <AdminSideApp />
          </Suspense>
        );
      }
      default:
        return <div>Module not found: {moduleName}</div>;
    }
  };

  return <div className="module-container">{renderModule()}</div>;
};

export default ModuleLoader;
