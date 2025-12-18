import { Suspense, lazy } from 'react';

const AdminSideApp = lazy(() => import('admin_side/App'));

const ModuleLoaderAdmin: React.FC = () => {
  return (
    <div className="module-container">
      <Suspense fallback={<div>Loading AdminSide...</div>}>
        <AdminSideApp />
      </Suspense>
    </div>
  );
};

export default ModuleLoaderAdmin;
