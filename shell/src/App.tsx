import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import ModuleLoader from './components/ModuleLoader';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="shell-container">
        <Routes>
          {/* Default route redirects to client_side */}
          <Route path="/" element={<Navigate to="/client_side" replace />} />

          {/* Route to load client_side module */}
          <Route
            path="/client_side"
            element={<ModuleLoader moduleName="client_side" />}
          />

          <Route
            path="/admin_side"
            element={<ModuleLoader moduleName="admin_side" />}
          />

          {/* Catch-all route for unknown paths */}
          <Route
            path="*"
            element={
              <div className="not-found">
                <h2>Page Not Found</h2>
                <p>The requested page could not be found.</p>
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
