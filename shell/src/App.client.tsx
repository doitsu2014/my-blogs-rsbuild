import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import ModuleLoaderClient from './components/ModuleLoader.client';
import './App.css';

const AppClient = () => {
  return (
    <Router>
      <div className="shell-container">
        <Routes>
          {/* Client-side module handles all routes (SSR-enabled) */}
          <Route
            path="/*"
            element={<ModuleLoaderClient />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default AppClient;
