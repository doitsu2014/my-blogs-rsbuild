import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './app/admin/layout';
import AdminDashboard from './app/admin/page';
import AdminCategoriesListPage from './app/admin/categories/page';
import AdminCreateCategoryPage from './app/admin/categories/create/page';
import AdminEditCategoryPage from './app/admin/categories/edit/page';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
        <Route path="/admin/categories" element={<AdminLayout><AdminCategoriesListPage /></AdminLayout>} />
        <Route path="/admin/categories/create" element={<AdminLayout><AdminCreateCategoryPage /></AdminLayout>} />
        <Route path="/admin/categories/edit/:id" element={<AdminLayout><AdminEditCategoryPage /></AdminLayout>} />
        <Route path="/admin/blogs" element={<AdminLayout><div className="p-6"><h1 className="text-2xl">Blogs - Coming Soon</h1></div></AdminLayout>} />
        <Route path="/" element={<Navigate to="/admin" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

