import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const [title, setTitle] = useState('');
  const [previewContent, setPreviewContent] = useState('');
  const [content, setContent] = useState('');
  const [originalContent, setOriginalContent] = useState('');
  const [thumbnailPaths, setThumbnailPaths] = useState<string[]>([]);
  const [published, setPublished] = useState(false);
  const [rowVersion, setRowVersion] = useState(0);
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState<{ label: string; color: string }[]>([]);
  const [categories, setCategories] = useState<CategoryModel[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');

  useEffect(() => {
    if (id) {
      const fetchPost = async () => {
        try {
          const response = await authenticatedFetch(
            getApiUrl(`/posts/${id}`),
            token,
            { cache: 'no-store' },
          );
          if (response && response.ok) {
            const res: { data: PostModel } = await response.json();
            setTitle(res.data.title);
            setPreviewContent(res.data.previewContent);
            setContent(res.data.content);
            setOriginalContent(res.data.content);
            setThumbnailPaths(res.data.thumbnailPaths);
            setPublished(res.data.published);
            setRowVersion(res.data.rowVersion);
            setTags(
              res.data.postTags.map((tag) => ({
                label: tag.name,
                color: getRandomColor(),
              })),
            );
            setSelectedCategoryId(res.data.categoryId);
          }
        } catch (error) {
          console.error('Error fetching post:', error);
        } finally {
          setLoading(false);
        }
      };

      setLoading(true);
      fetchPost();
    } else {
      setTitle('');
      setPreviewContent('');
      setContent('');
      setThumbnailPaths([]);
      setPublished(false);
      setRowVersion(0);
      setTags([]);
    }
  }, [id]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await authenticatedFetch(
          getApiUrl('/posts?categoryType=Blog'),
          token,
          { cache: 'no-store' },
        );
        if (response.ok) {
          const res: {data: CategoryModel[]} = await response.json();
          setCategories(res.data);

          // If we don't have a selected category yet and there are categories, select the first one
          if (!selectedCategoryId && res.data.length > 0 && !id) {
            setSelectedCategoryId(res.data[0].id);
          }
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Set empty array if API not available
        setCategories([]);
      }
    };

    fetchCategories();
  }, [id, selectedCategoryId]);

  const submitHandler = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const postData = {
        id,
        title,
        previewContent,
        content,
        thumbnailPaths,
        published,
        rowVersion,
        tagNames: tags.map((tag) => tag.label),
        categoryId: selectedCategoryId,
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
        navigate('/admin/blogs');
      } else {
        console.error(await response.json(), response.status);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleThumbnailUploadSuccess = (urls: string[]) => {
    setThumbnailPaths([...urls]);
  };

  return (
    <form
      onSubmit={submitHandler}
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
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input input-bordered w-full"
              placeholder="Enter an engaging title"
              required
              name="title"
              disabled={loading}
            />
          </label>

          <label className="form-control w-full mt-4">
            <div className="label">
              <span className="label-text font-medium">Category</span>
            </div>
            <select
              className="select select-bordered w-full"
              disabled={loading || categories.length === 0}
              name="category"
              required
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
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
            <label className="cursor-pointer label justify-start gap-3 bg-base-100 rounded-md p-3">
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                disabled={loading}
              />
              <span className="label-text">
                {published ? 'Published' : 'Draft'}
              </span>
            </label>
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
          <ThumbnailsInput
            value={thumbnailPaths}
            onUploadSuccess={handleThumbnailUploadSuccess}
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
            <MultiChipInput
              chips={tags}
              setChips={(chips: { label: string; color: string }[]) => {
                setTags(
                  chips.map((chip) => ({
                    label: chip.label.toLowerCase(),
                    color: chip.color,
                  })),
                );
              }}
              className="flex flex-wrap border border-base-300 rounded-md p-2 min-h-16 bg-base-200"
              loading={loading}
              formControlName="tags"
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
              value={previewContent}
              onChange={(e) => setPreviewContent(e.target.value)}
              className="textarea textarea-bordered w-full min-h-24"
              placeholder="Enter a brief preview of your blog post"
              required
              name="previewContent"
              disabled={loading}
            />
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
            <RichTextEditor
              key={`editor-${id}`}
              id="content-editor"
              defaultValue={originalContent}
              onTextChange={(e: any) => {
                setContent(e);
              }}
              onSelectionChange={() => {}}
              readOnly={false}
            />
          </div>
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
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
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

      <input type="hidden" name="rowVersion" value={rowVersion} />
      <input type="hidden" name="id" value={id || ''} />
    </form>
  );
}
