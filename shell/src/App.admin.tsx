import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import ModuleLoaderAdmin from './components/ModuleLoader.admin';
import './App.css';

const AppAdmin = () => {
  return (
    <Router basename="/admin">
      <div className="shell-container">
        <Routes>
          {/* Default admin route */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Admin module routes - all paths under /admin/* */}
          <Route
            path="/*"
            element={<ModuleLoaderAdmin />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default AppAdmin;
