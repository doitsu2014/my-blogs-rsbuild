import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { ChevronDown, ChevronUp, Home, Pencil, Trash } from 'lucide-react';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../components/my-breadcrumbs';
import TableSkeleton from '../components/skeleton/table-skeleton';
import { TagModel } from '@/domains/tag';
import { CategoryModel } from '@/domains/category';
import { getApiUrl, authenticatedFetch } from '@/config/api.config';
import { useAuth } from '@/auth/AuthContext';

export default function AdminCategoriesListPage() {
  const { token } = useAuth();
  const [categories, setCategories] = useState<CategoryModel[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(
    null
  );
  const [textFilter, setTextFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryModel | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setPageLoading(true);
        const response = await authenticatedFetch(
          getApiUrl('/categories'),
          token,
          { cache: 'no-store' }
        );
        const res: { data: CategoryModel[] } = await response.json();
        console.log(res);
        setCategories(res.data);
      } catch (error) {
        console.error("Failed to load categories:", error);
        // For now, set empty array if API not available
        setCategories([]);
      } finally {
        setPageLoading(false);
      }
    };

    loadCategories();
  }, []);

  const handleDeleteClick = (category: CategoryModel) => {
    setCategoryToDelete(category);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;

    try {
      setIsDeleting(true);
      const response = await authenticatedFetch(
        getApiUrl(`/admin/categories/${categoryToDelete.id}`),
        token,
        { method: 'DELETE' }
      );

      if (response.ok) {
        setCategories(categories.filter(c => c.id !== categoryToDelete.id));
        setIsDeleteModalOpen(false);
        setCategoryToDelete(null);
        toast.success('Category deleted successfully');
      } else {
        console.error('Failed to delete category');
        toast.error('Failed to delete category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('An error occurred while deleting the category');
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setCategoryToDelete(null);
  };

  let filteredCategories = categories;

  // Apply Filtering
  if (textFilter) {
    filteredCategories = filteredCategories.filter((c) => 
      c.slug.toLowerCase().includes(textFilter.toLowerCase()) || 
      c.displayName.toLowerCase().includes(textFilter.toLowerCase())
    );
  }

  if (typeFilter) {
    filteredCategories = filteredCategories.filter((c) => c.categoryType === typeFilter);
  }

  // Sorting
  const sortBy = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig?.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    filteredCategories.sort((a: any, b: any) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  };

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: 'Admin', href: '/admin', icon: <Home className="w-4 h-4" /> },
          { label: 'Categories' }
        ]}
      />

      <div className="flex justify-between">
        <h1 className="text-3xl font-bold mb-6">Manage Categories</h1>
        {/* Create Category Button */}
        <Link to="/admin/categories/create" className="btn btn-primary">
          + Create Category
        </Link>
      </div>

      {/* Filter Controls */}
      <div className="flex space-x-4 mb-4">
        <input
          type="text"
          placeholder="Filter by name or slug..."
          className="input input-bordered w-1/3"
          value={textFilter}
          onChange={(e) => setTextFilter(e.target.value)}
        />

        <select
          className="select select-bordered w-1/3"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="">All</option>
          <option value="Blog">Blog</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Categories Table */}
      <div className="overflow-x-auto">
        {pageLoading ? (
          <TableSkeleton 
            rows={5} 
            columns={6} 
            showHeader={true} 
            className="w-full" 
          />
        ) : (
          <table className="table w-full">
            <thead>
              <tr className="bg-base-300 text-base-content">
                <th className="p-3 cursor-pointer" onClick={() => sortBy('name')}>
                  Name{' '}
                  {sortConfig?.key === 'name' ? (
                    sortConfig.direction === 'asc' ? (
                      <ChevronUp className="inline w-4 h-4" />
                    ) : (
                      <ChevronDown className="inline w-4 h-4" />
                    )
                  ) : null}
                </th>
                <th className="p-3 cursor-pointer" onClick={() => sortBy('slug')}>
                  Slug{' '}
                  {sortConfig?.key === 'slug' ? (
                    sortConfig.direction === 'asc' ? (
                      <ChevronUp className="inline w-4 h-4" />
                    ) : (
                      <ChevronDown className="inline w-4 h-4" />
                    )
                  ) : null}
                </th>
                <th className="p-3 cursor-pointer" onClick={() => sortBy('categoryType')}>
                  Type{' '}
                  {sortConfig?.key === 'categoryType' ? (
                    sortConfig.direction === 'asc' ? (
                      <ChevronUp className="inline w-4 h-4" />
                    ) : (
                      <ChevronDown className="inline w-4 h-4" />
                    )
                  ) : null}
                </th>
                <th className="p-3">Created By</th>
                <th className="p-3">Tags</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories?.map((category) => (
                <tr key={category.id} className="hover:bg-base-200 transition-all">
                  <td className="p-3 font-semibold">{category.displayName}</td>
                  <td className="p-3 text-gray-500">{category.slug}</td>
                  <td className="p-3">
                    <span className="badge badge-info">{category.categoryType}</span>
                  </td>
                  <td className="p-3 text-gray-600">{category.createdBy}</td>
                  <td className="p-3">
                    {category.categoryTags?.length > 0 ? (
                      category.categoryTags?.map((tag: TagModel) => (
                        <span key={tag.id} className="badge badge-secondary mr-1">
                          {tag.name}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400">No Tags</span>
                    )}
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex gap-2">
                      <Link
                        to={`/admin/categories/edit/${category.id}`}
                        className="btn btn-sm btn-outline"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button 
                        className="btn btn-sm btn-outline btn-error"
                        onClick={() => handleDeleteClick(category)}
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Delete Confirmation Modal - DaisyUI Dialog */}
      <dialog id="delete_category_modal" className={`modal ${isDeleteModalOpen ? 'modal-open' : ''}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">Confirm Deletion</h3>
          <p className="py-4">
            Are you sure you want to delete the category <span className="font-semibold">"{categoryToDelete?.displayName}"</span>?
            This action cannot be undone.
          </p>
          <div className="modal-action">
            <button className="btn btn-ghost" onClick={cancelDelete} disabled={isDeleting}>
              Cancel
            </button>
            <button className="btn btn-error" onClick={confirmDelete} disabled={isDeleting}>
              {isDeleting ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop" onClick={cancelDelete}>
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}
