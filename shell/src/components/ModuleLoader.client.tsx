import { Suspense, lazy } from 'react';

const ClientSideApp = lazy(() => import('client_side/App'));

const ModuleLoaderClient: React.FC = () => {
  return (
    <div className="module-container">
      <Suspense fallback={<div>Loading ClientSide...</div>}>
        <ClientSideApp />
      </Suspense>
    </div>
  );
};

export default ModuleLoaderClient;
