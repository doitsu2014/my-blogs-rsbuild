import { Home } from 'lucide-react';
import Breadcrumbs from '@/app/admin/components/my-breadcrumbs';
import CategoryForm from '../category-form';

export default function AdminCreateCategoryPage() {
  return (
    <div className="container-fluid mx-auto">
      <Breadcrumbs
        items={[
          { label: 'Admin', href: '/admin', icon: <Home className="w-4 h-4" /> },
          { label: 'Categories', href: '/admin/categories' },
          { label: 'Create Category' }
        ]}
      />
      <div>
        <h1 className="text-2xl font-bold mb-4">Create Category</h1>
        <CategoryForm id={undefined} />
      </div>
    </div>
  );
}
