import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { blogFormSchema, type BlogFormData } from '@/schemas/blog.schema';
import type { PostModel } from '@/domains/post';
import type { CategoryModel } from '@/domains/category';
import MultiChipInput, {
  getRandomColor,
} from '../components/inputs/multi-chip-input';
import { Info, ImagePlus, Tag, BookOpen, Save, FileText, ArrowLeft } from 'lucide-react';
import { RichTextEditor } from '../components/inputs/rich-text-editor/rich-text-editor';
import ThumbnailsInput from '../components/inputs/thumbnail-input';
import { getApiUrl, authenticatedFetch } from '@/config/api.config';
import { useAuth } from '@/auth/AuthContext';

export default function BlogForm({ id }: { id?: string }) {
  const navigate = useNavigate();
  const { token, keycloak } = useAuth();
  const [categories, setCategories] = useState<CategoryModel[]>([]);
  const [originalContent, setOriginalContent] = useState('');
  const [fetchingData, setFetchingData] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BlogFormData>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: '',
      previewContent: '',
      content: '',
      thumbnailPaths: [],
      published: false,
      tagNames: [],
      categoryId: '',
      rowVersion: 0,
    },
  });

  const isLoading = isSubmitting || fetchingData;

  useEffect(() => {
    if (id) {
      const fetchPost = async () => {
        setFetchingData(true);
        try {
          const response = await authenticatedFetch(
            getApiUrl(`/posts/${id}`),
            token,
            { cache: 'no-store' },
            keycloak || undefined
          );
          if (response && response.ok) {
            const res: { data: PostModel } = await response.json();
            setOriginalContent(res.data.content);
            reset({
              title: res.data.title,
              previewContent: res.data.previewContent,
              content: res.data.content,
              thumbnailPaths: res.data.thumbnailPaths,
              published: res.data.published,
              tagNames: res.data.tags?.map((tag) => tag.name) ?? [],
              categoryId: res.data.categoryId,
              rowVersion: res.data.rowVersion,
            });
          } else {
            toast.error('Failed to load post data');
          }
        } catch (error) {
          console.error('Error fetching post:', error);
          toast.error('Error loading post');
        } finally {
          setFetchingData(false);
        }
      };

      fetchPost();
    } else {
      reset({
        title: '',
        previewContent: '',
        content: '',
        thumbnailPaths: [],
        published: false,
        tagNames: [],
        categoryId: '',
        rowVersion: 0,
      });
      setOriginalContent('');
    }
  }, [id, reset, token, keycloak]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await authenticatedFetch(
          getApiUrl('/categories'),
          token,
          { cache: 'no-store' },
          keycloak || undefined
        );
        if (response.ok) {
          const res: { data: CategoryModel[] } = await response.json();
          setCategories(res.data);

          // If we don't have a selected category yet and there are categories, select the first one
          const currentCategoryId = watch('categoryId');
          if (!currentCategoryId && res.data.length > 0 && !id) {
            setValue('categoryId', res.data[0].id);
          }
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to load categories');
        setCategories([]);
      }
    };

    fetchCategories();
  }, [id, token, keycloak, setValue, watch]);

  const onSubmit = async (data: BlogFormData) => {
    try {
      const postData = {
        id,
        ...data,
      };

      const method = id ? 'PUT' : 'POST';

      const response = await authenticatedFetch(
        getApiUrl('/posts'),
        token,
        {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(postData),
        },
        keycloak || undefined
      );

      if (response.ok) {
        toast.success(id ? 'Post updated successfully' : 'Post created successfully');
        navigate('/admin/blogs');
      } else {
        const errorData = await response.json();
        console.error(errorData, response.status);
        toast.error(errorData.message || 'Failed to save post');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Network error. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full max-w-6xl">
      {/* Basic Information */}
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body">
          <h2 className="card-title text-lg flex items-center gap-2">
            <Info className="w-5 h-5" />
            Basic Information
          </h2>
          <p className="text-sm text-base-content/60 mb-4">
            Set the title, category, and publication status for your blog post
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="form-control w-full md:col-span-2">
              <div className="label">
                <span className="label-text font-medium">Title</span>
              </div>
              <input
                type="text"
                {...register('title')}
                className={`input input-bordered w-full ${errors.title ? 'input-error' : ''}`}
                placeholder="Enter an engaging title"
                disabled={isLoading}
              />
              {errors.title && (
                <div className="label">
                  <span className="label-text-alt text-error">{errors.title.message}</span>
                </div>
              )}
            </label>

            <label className="form-control w-full">
              <div className="label">
                <span className="label-text font-medium">Category</span>
              </div>
              <select
                {...register('categoryId')}
                className={`select select-bordered w-full ${errors.categoryId ? 'select-error' : ''}`}
                disabled={isLoading || categories.length === 0}
              >
                <option value="" disabled>
                  Select a category
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.displayName}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <div className="label">
                  <span className="label-text-alt text-error">{errors.categoryId.message}</span>
                </div>
              )}
              {categories.length === 0 && (
                <div className="label">
                  <span className="label-text-alt text-warning">No categories available</span>
                </div>
              )}
            </label>

            <div className="form-control w-full">
              <div className="label">
                <span className="label-text font-medium">Published Status</span>
              </div>
              <Controller
                name="published"
                control={control}
                render={({ field }) => (
                  <div className="flex items-center gap-3 border border-base-300 rounded-lg px-4 h-12 bg-base-100">
                    <input
                      type="checkbox"
                      className="toggle toggle-primary toggle-sm"
                      checked={field.value}
                      onChange={field.onChange}
                      disabled={isLoading}
                    />
                    <span
                      className={`badge ${field.value ? 'badge-success' : 'badge-ghost'}`}
                    >
                      {field.value ? 'Published' : 'Draft'}
                    </span>
                  </div>
                )}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Thumbnails */}
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="card-title text-lg flex items-center gap-2">
                <ImagePlus className="w-5 h-5" />
                Thumbnails
              </h2>
              <p className="text-sm text-base-content/60">Upload images for your blog post</p>
            </div>
            <span className="badge badge-ghost">Optional</span>
          </div>
          <div className="mt-4">
            <Controller
              name="thumbnailPaths"
              control={control}
              render={({ field }) => (
                <ThumbnailsInput
                  value={field.value}
                  onUploadSuccess={(urls) => field.onChange([...urls])}
                />
              )}
            />
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="card-title text-lg flex items-center gap-2">
                <Tag className="w-5 h-5" />
                Tags
              </h2>
              <p className="text-sm text-base-content/60">Add tags to categorize your content</p>
            </div>
            <span className="badge badge-ghost">Optional</span>
          </div>

          <label className="form-control w-full mt-4">
            <Controller
              name="tagNames"
              control={control}
              render={({ field }) => (
                <MultiChipInput
                  chips={field.value.map((tag) => ({
                    label: tag,
                    color: getRandomColor(),
                  }))}
                  setChips={(chips: { label: string; color: string }[]) => {
                    field.onChange(chips.map((chip) => chip.label.toLowerCase()));
                  }}
                  className="flex flex-wrap border border-base-300 rounded-lg p-3 min-h-[48px] bg-base-100"
                  loading={isLoading}
                  formControlName="tags"
                />
              )}
            />
            <div className="label">
              <span className="label-text-alt text-base-content/50">Press Enter to add a tag</span>
            </div>
          </label>
        </div>
      </div>

      {/* Preview Content */}
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body">
          <h2 className="card-title text-lg flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Preview Content
          </h2>
          <p className="text-sm text-base-content/60 mb-4">
            Write a short summary that will appear in blog listings
          </p>

          <label className="form-control w-full">
            <textarea
              {...register('previewContent')}
              className={`textarea textarea-bordered w-full min-h-24 ${errors.previewContent ? 'textarea-error' : ''}`}
              placeholder="Enter a brief preview of your blog post"
              disabled={isLoading}
            />
            {errors.previewContent && (
              <div className="label">
                <span className="label-text-alt text-error">{errors.previewContent.message}</span>
              </div>
            )}
          </label>
        </div>
      </div>

      {/* Full Article Content */}
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body">
          <h2 className="card-title text-lg flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Full Article Content
          </h2>
          <p className="text-sm text-base-content/60 mb-4">Write your full article content</p>

          <div
            className="form-control w-full bg-base-100 rounded-lg border border-base-300"
            key="main-editor"
          >
            <Controller
              name="content"
              control={control}
              render={({ field }) => (
                <RichTextEditor
                  key={`editor-${id}`}
                  id="content-editor"
                  defaultValue={originalContent}
                  onTextChange={(value: string) => {
                    field.onChange(value);
                  }}
                  onSelectionChange={() => {}}
                  readOnly={false}
                />
              )}
            />
          </div>
          {errors.content && (
            <div className="label">
              <span className="label-text-alt text-error">{errors.content.message}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
        <button
          type="button"
          className="btn btn-ghost gap-2"
          onClick={() => navigate('/admin/blogs')}
          disabled={isLoading}
        >
          <ArrowLeft className="w-4 h-4" />
          Cancel
        </button>
        <button type="submit" className="btn btn-primary flex-1 gap-2" disabled={isLoading}>
          {isSubmitting ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              {id ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              {id ? 'Update Post' : 'Create Post'}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
