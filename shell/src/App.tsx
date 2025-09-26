import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ModuleLoader from './components/ModuleLoader';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="shell-container">
        <Routes>
          {/* Default route redirects to homepage */}
          <Route path="/" element={<Navigate to="/homepage" replace />} />
          
          {/* Route to load homepage module */}
          <Route 
            path="/homepage" 
            element={<ModuleLoader moduleName="homepage" />} 
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
