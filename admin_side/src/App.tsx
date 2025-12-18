import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './app/admin/layout';
import AdminDashboard from './app/admin/page';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
        <Route path="/admin/categories" element={<AdminLayout><div className="p-6"><h1 className="text-2xl">Categories - Coming Soon</h1></div></AdminLayout>} />
        <Route path="/admin/blogs" element={<AdminLayout><div className="p-6"><h1 className="text-2xl">Blogs - Coming Soon</h1></div></AdminLayout>} />
        <Route path="/" element={<Navigate to="/admin" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

