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
import { Info, ImagePlus, Tag, BookOpen, Save, FileText } from 'lucide-react';
import { RichTextEditor } from '../components/inputs/rich-text-editor/rich-text-editor';
import ThumbnailsInput from '../components/inputs/thumbnail-input';
import { getApiUrl, authenticatedFetch } from '@/config/api.config';
import { useAuth } from '@/auth/AuthContext';

export default function BlogForm({ id }: { id?: string }) {
  const navigate = useNavigate();
  const { token } = useAuth();
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
              tagNames: res.data.postTags.map((tag) => tag.name),
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
  }, [id, reset, token]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await authenticatedFetch(
          getApiUrl('/posts?categoryType=Blog'),
          token,
          { cache: 'no-store' },
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
  }, [id, token, setValue, watch]);

  const onSubmit = async (data: BlogFormData) => {
    try {
      const postData = {
        id,
        ...data,
      };

      const method = id ? 'PUT' : 'POST';

      const response = await authenticatedFetch(getApiUrl('/posts'), token, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col space-y-4 max-w-6xl mx-auto"
    >
      {/* Basic Information */}
      <div className="card bg-base-200 shadow-sm">
        <div className="card-body p-4">
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <Info size={18} />
            Basic Information
          </h3>

          <label className="form-control w-full">
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

          <label className="form-control w-full mt-4">
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
                <span className="label-text-alt text-error">
                  No categories available
                </span>
              </div>
            )}
          </label>

          <div className="form-control mt-4">
            <div className="label">
              <span className="label-text font-medium">Published Status:</span>
            </div>
            <Controller
              name="published"
              control={control}
              render={({ field }) => (
                <label className="cursor-pointer label justify-start gap-3 bg-base-100 rounded-md p-3">
                  <input
                    type="checkbox"
                    className="toggle toggle-primary"
                    checked={field.value}
                    onChange={field.onChange}
                    disabled={isLoading}
                  />
                  <span className="label-text">
                    {field.value ? 'Published' : 'Draft'}
                  </span>
                </label>
              )}
            />
          </div>
        </div>
      </div>

      {/* Thumbnails */}
      <div className="card bg-base-200 shadow-sm">
        <div className="card-body p-4">
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <ImagePlus size={18} />
            Thumbnails
          </h3>
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

      {/* Tags */}
      <div className="card bg-base-200 shadow-sm">
        <div className="card-body p-4">
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <Tag size={18} />
            Tags
          </h3>

          <label className="form-control w-full">
            <div className="label">
              <span className="label-text font-medium">Add Tags</span>
              <span className="label-text-alt">Press Enter to add</span>
            </div>
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
                  className="flex flex-wrap border border-base-300 rounded-md p-2 min-h-16 bg-base-200"
                  loading={isLoading}
                  formControlName="tags"
                />
              )}
            />
          </label>
        </div>
      </div>

      {/* Content */}
      <div className="card bg-base-200 shadow-sm">
        <div className="card-body p-4">
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <BookOpen size={18} />
            Preview Content
          </h3>

          <label className="form-control w-full">
            <div className="label">
              <span className="label-text font-medium">Short Preview</span>
              <span className="label-text-alt">
                This will appear in blog lists
              </span>
            </div>
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
      <div className="card bg-base-200 shadow-sm">
        <div className="card-body p-4">
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <FileText size={18} />
            Full Article Content
          </h3>

          <div
            className="form-control w-full bg-base-100 rounded-md border border-base-300"
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

      {/* Form Actions */}
      <div className="card bg-base-200 shadow-sm">
        <div className="card-body p-4">
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => navigate('/admin/blogs')}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isSubmitting ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  {id ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <Save size={18} />
                  {id ? 'Update Post' : 'Create Post'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
