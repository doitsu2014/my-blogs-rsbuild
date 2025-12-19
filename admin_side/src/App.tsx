import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './app/admin/layout';
import AdminDashboard from './app/admin/page';
import AdminCategoriesListPage from './app/admin/categories/page';
import AdminCreateCategoryPage from './app/admin/categories/create/page';
import AdminEditCategoryPage from './app/admin/categories/edit/page';
import AdminBlogsPage from './app/admin/blogs/page';
import AdminCreateBlogPage from './app/admin/blogs/create/page';
import AdminEditBlogPage from './app/admin/blogs/edit/page';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
        <Route path="/admin/categories" element={<AdminLayout><AdminCategoriesListPage /></AdminLayout>} />
        <Route path="/admin/categories/create" element={<AdminLayout><AdminCreateCategoryPage /></AdminLayout>} />
        <Route path="/admin/categories/edit/:id" element={<AdminLayout><AdminEditCategoryPage /></AdminLayout>} />
        <Route path="/admin/blogs" element={<AdminLayout><AdminBlogsPage /></AdminLayout>} />
        <Route path="/admin/blogs/create" element={<AdminLayout><AdminCreateBlogPage /></AdminLayout>} />
        <Route path="/admin/blogs/edit/:id" element={<AdminLayout><AdminEditBlogPage /></AdminLayout>} />
        <Route path="/" element={<Navigate to="/admin" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

