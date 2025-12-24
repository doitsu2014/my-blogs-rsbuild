import { Home } from 'lucide-react';
import { useParams } from 'react-router-dom';
import Breadcrumbs from '@/app/admin/components/my-breadcrumbs';
import CategoryForm from '../category-form';

export default function AdminEditCategoryPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="container-fluid mx-auto">
      <Breadcrumbs
        items={[
          { label: 'Admin', href: '/admin', icon: <Home className="w-4 h-4" /> },
          { label: 'Categories', href: '/admin/categories' },
          { label: 'Edit Category' },
          { label: id || '' }
        ]}
      />
      <div>
        <h1 className="text-2xl font-bold mb-4">Edit Category</h1>
        <CategoryForm id={id} />
      </div>
    </div>
  );
}
