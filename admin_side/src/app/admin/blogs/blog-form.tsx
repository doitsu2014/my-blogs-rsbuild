import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { blogFormSchema, type BlogFormData } from '@/schemas/blog.schema';
import type { PostModel } from '@/domains/post';
import type { CategoryModel } from '@/domains/category';
import MultiChipInput, {
  getRandomColor,
} from '../components/inputs/multi-chip-input';
import {
  Info,
  ImagePlus,
  Tag,
  BookOpen,
  Save,
  FileText,
  ArrowLeft,
  Sparkles,
  Globe,
  Languages,
  Plus,
  X,
} from 'lucide-react';
import { RichTextEditor } from '../components/inputs/rich-text-editor/rich-text-editor';
import ThumbnailsInput from '../components/inputs/thumbnail-input';
import { getApiUrl, authenticatedFetch } from '@/config/api.config';
import { useAuth } from '@/auth/AuthContext';

const AVAILABLE_LANGUAGES = [{ code: 'vi', displayName: 'Vietnamese (vi)' }];

export default function BlogForm({ id }: { id?: string }) {
  const navigate = useNavigate();
  const { token, keycloak } = useAuth();
  const [categories, setCategories] = useState<CategoryModel[]>([]);
  const [originalContent, setOriginalContent] = useState('');
  const [originalTranslationContents, setOriginalTranslationContents] = useState<
    Record<number, string>
  >({});
  const [fetchingData, setFetchingData] = useState(false);
  const [activeTranslationTab, setActiveTranslationTab] = useState(0);

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
      translations: [],
      rowVersion: 0,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'translations',
  });

  const translations = watch('translations');
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

            // Store original translation contents for rich text editors
            const translationContents: Record<number, string> = {};
            res.data.translations?.forEach((t, index) => {
              translationContents[index] = t.content;
            });
            setOriginalTranslationContents(translationContents);

            reset({
              title: res.data.title,
              previewContent: res.data.previewContent,
              content: res.data.content,
              thumbnailPaths: res.data.thumbnailPaths,
              published: res.data.published,
              tagNames: res.data.tags?.map((tag) => tag.name) ?? [],
              categoryId: res.data.categoryId,
              translations:
                res.data.translations?.map((t) => ({
                  id: t.id,
                  languageCode: t.languageCode,
                  title: t.title,
                  previewContent: t.previewContent,
                  content: t.content,
                  slug: t.slug,
                })) ?? [],
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
        translations: [],
        rowVersion: 0,
      });
      setOriginalContent('');
      setOriginalTranslationContents({});
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
        translations: data.translations?.map((t) => ({
          id: t.id || undefined,
          languageCode: t.languageCode,
          title: t.title,
          previewContent: t.previewContent,
          content: t.content,
          slug: t.slug || undefined,
        })),
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

  const addTranslationTab = () => {
    append({
      id: '',
      languageCode: '',
      title: '',
      previewContent: '',
      content: '',
      slug: '',
    });
    setActiveTranslationTab(fields.length);
  };

  const removeTranslationTab = (index: number) => {
    remove(index);
    // Update original contents mapping
    const newContents: Record<number, string> = {};
    Object.entries(originalTranslationContents).forEach(([key, value]) => {
      const keyNum = parseInt(key);
      if (keyNum < index) {
        newContents[keyNum] = value;
      } else if (keyNum > index) {
        newContents[keyNum - 1] = value;
      }
    });
    setOriginalTranslationContents(newContents);

    if (activeTranslationTab >= fields.length - 1) {
      setActiveTranslationTab(Math.max(0, fields.length - 2));
    }
  };

  const isAddTranslationDisabled = () => {
    const usedLanguages = translations?.map((t) => t.languageCode) || [];
    const allUsed = AVAILABLE_LANGUAGES.every((lang) => usedLanguages.includes(lang.code));
    const maxReached = fields.length >= AVAILABLE_LANGUAGES.length;
    return allUsed || maxReached;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
      {/* Basic Information */}
      <div className="card bg-base-100 shadow-lg border-t-4 border-t-primary hover:shadow-xl transition-shadow duration-300">
        <div className="card-body">
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-xl">
              <Info className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="card-title text-lg">Basic Information</h2>
              <p className="text-sm text-base-content/60">
                Set the title, category, and publication status for your blog post
              </p>
            </div>
          </div>

          <div className="divider my-2"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="form-control w-full md:col-span-2">
              <div className="label">
                <span className="label-text font-medium">Title</span>
              </div>
              <input
                type="text"
                {...register('title')}
                className={`input input-bordered w-full focus:input-primary ${errors.title ? 'input-error' : ''}`}
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
                className={`select select-bordered w-full focus:select-primary ${errors.categoryId ? 'select-error' : ''}`}
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
                  <div
                    className={`flex items-center gap-3 border-2 rounded-xl px-4 h-12 transition-all duration-200 ${
                      field.value ? 'border-success bg-success/5' : 'border-base-300 bg-base-100'
                    }`}
                  >
                    <input
                      type="checkbox"
                      className={`toggle ${field.value ? 'toggle-success' : ''}`}
                      checked={field.value}
                      onChange={field.onChange}
                      disabled={isLoading}
                    />
                    <span
                      className={`font-medium ${field.value ? 'text-success' : 'text-base-content/60'}`}
                    >
                      {field.value ? 'Published' : 'Draft'}
                    </span>
                    {field.value && <Sparkles className="w-4 h-4 text-success ml-auto" />}
                  </div>
                )}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Thumbnails */}
      <div className="card bg-base-100 shadow-lg border-t-4 border-t-secondary hover:shadow-xl transition-shadow duration-300">
        <div className="card-body">
          <div className="flex items-start gap-4">
            <div className="bg-secondary/10 p-3 rounded-xl">
              <ImagePlus className="w-6 h-6 text-secondary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h2 className="card-title text-lg">Thumbnails</h2>
                <span className="badge badge-secondary badge-outline">Optional</span>
              </div>
              <p className="text-sm text-base-content/60">Upload images for your blog post</p>
            </div>
          </div>

          <div className="divider my-2"></div>

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
      <div className="card bg-base-100 shadow-lg border-t-4 border-t-accent hover:shadow-xl transition-shadow duration-300">
        <div className="card-body">
          <div className="flex items-start gap-4">
            <div className="bg-accent/10 p-3 rounded-xl">
              <Tag className="w-6 h-6 text-accent" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h2 className="card-title text-lg">Tags</h2>
                <span className="badge badge-accent badge-outline">Optional</span>
              </div>
              <p className="text-sm text-base-content/60">Add tags to categorize your content</p>
            </div>
          </div>

          <div className="divider my-2"></div>

          <label className="form-control w-full">
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
                  className="flex flex-wrap border-2 border-base-300 rounded-xl p-3 min-h-[52px] bg-base-100 focus-within:border-accent transition-colors"
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
      <div className="card bg-base-100 shadow-lg border-t-4 border-t-info hover:shadow-xl transition-shadow duration-300">
        <div className="card-body">
          <div className="flex items-start gap-4">
            <div className="bg-info/10 p-3 rounded-xl">
              <BookOpen className="w-6 h-6 text-info" />
            </div>
            <div className="flex-1">
              <h2 className="card-title text-lg">Preview Content</h2>
              <p className="text-sm text-base-content/60">
                Write a short summary that will appear in blog listings
              </p>
            </div>
          </div>

          <div className="divider my-2"></div>

          <label className="form-control w-full">
            <textarea
              {...register('previewContent')}
              className={`textarea textarea-bordered w-full min-h-28 focus:textarea-info ${errors.previewContent ? 'textarea-error' : ''}`}
              placeholder="Enter a brief preview of your blog post..."
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
      <div className="card bg-base-100 shadow-lg border-t-4 border-t-warning hover:shadow-xl transition-shadow duration-300">
        <div className="card-body">
          <div className="flex items-start gap-4">
            <div className="bg-warning/10 p-3 rounded-xl">
              <FileText className="w-6 h-6 text-warning" />
            </div>
            <div className="flex-1">
              <h2 className="card-title text-lg">Full Article Content</h2>
              <p className="text-sm text-base-content/60">Write your full article content</p>
            </div>
          </div>

          <div className="divider my-2"></div>

          <div
            className="form-control w-full bg-base-100 rounded-xl border-2 border-base-300 overflow-hidden"
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

      {/* Translations */}
      <div className="card bg-base-100 shadow-lg border-t-4 border-t-neutral hover:shadow-xl transition-shadow duration-300">
        <div className="card-body">
          <div className="flex items-start gap-4">
            <div className="bg-neutral/10 p-3 rounded-xl">
              <Globe className="w-6 h-6 text-neutral" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="card-title text-lg">Translations</h2>
                  <p className="text-sm text-base-content/60">
                    Add translations for different languages
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-sm btn-neutral btn-outline gap-1"
                  onClick={addTranslationTab}
                  disabled={isAddTranslationDisabled() || isLoading}
                >
                  <Plus className="w-4 h-4" />
                  Add Language
                </button>
              </div>
            </div>
          </div>

          <div className="divider my-2"></div>

          {fields.length === 0 ? (
            <div className="text-center py-10 border-2 border-dashed border-base-300 rounded-xl bg-base-200/30">
              <div className="bg-neutral/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <Languages className="w-8 h-8 text-neutral/50" />
              </div>
              <p className="text-base-content/50 text-sm mb-3">No translations added yet</p>
              <button
                type="button"
                className="btn btn-sm btn-ghost text-neutral"
                onClick={addTranslationTab}
                disabled={isAddTranslationDisabled() || isLoading}
              >
                <Plus className="w-4 h-4" />
                Add first translation
              </button>
            </div>
          ) : (
            <>
              {/* Translation Tabs */}
              <div className="tabs tabs-boxed bg-base-200 p-1 rounded-xl mb-4">
                {fields.map((field, index) => (
                  <button
                    key={field.id}
                    type="button"
                    className={`tab gap-2 transition-all ${
                      activeTranslationTab === index
                        ? 'tab-active bg-neutral text-neutral-content'
                        : ''
                    }`}
                    onClick={() => setActiveTranslationTab(index)}
                  >
                    <Globe className="w-3 h-3" />
                    {translations[index]?.languageCode?.toUpperCase() || 'New'}
                  </button>
                ))}
              </div>

              {/* Translation Content */}
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className={`space-y-4 p-4 bg-base-200/30 rounded-xl ${
                    activeTranslationTab === index ? '' : 'hidden'
                  }`}
                >
                  <div className="flex items-center justify-between pb-2 border-b border-base-300">
                    <span className="text-sm font-medium text-base-content/70 flex items-center gap-2">
                      <Languages className="w-4 h-4" />
                      Translation #{index + 1}
                    </span>
                    <button
                      type="button"
                      className="btn btn-sm btn-ghost text-error hover:bg-error/10 gap-1"
                      onClick={() => removeTranslationTab(index)}
                      disabled={isLoading}
                    >
                      <X className="w-4 h-4" />
                      Remove
                    </button>
                  </div>

                  {/* Language Selection */}
                  <label className="form-control w-full">
                    <div className="label">
                      <span className="label-text font-medium">Language</span>
                    </div>
                    <select
                      {...register(`translations.${index}.languageCode`)}
                      className={`select select-bordered w-full focus:select-neutral ${
                        errors.translations?.[index]?.languageCode ? 'select-error' : ''
                      }`}
                      disabled={isLoading}
                    >
                      <option value="">Select Language</option>
                      {AVAILABLE_LANGUAGES.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                          {lang.displayName}
                        </option>
                      ))}
                    </select>
                    {errors.translations?.[index]?.languageCode && (
                      <div className="label">
                        <span className="label-text-alt text-error">
                          {errors.translations[index]?.languageCode?.message}
                        </span>
                      </div>
                    )}
                  </label>

                  {/* Translated Title */}
                  <label className="form-control w-full">
                    <div className="label">
                      <span className="label-text font-medium">Translated Title</span>
                    </div>
                    <input
                      type="text"
                      {...register(`translations.${index}.title`)}
                      className={`input input-bordered w-full focus:input-neutral ${
                        errors.translations?.[index]?.title ? 'input-error' : ''
                      }`}
                      placeholder="Enter translated title"
                      disabled={isLoading}
                    />
                    {errors.translations?.[index]?.title && (
                      <div className="label">
                        <span className="label-text-alt text-error">
                          {errors.translations[index]?.title?.message}
                        </span>
                      </div>
                    )}
                  </label>

                  {/* Translated Preview Content */}
                  <label className="form-control w-full">
                    <div className="label">
                      <span className="label-text font-medium">Translated Preview</span>
                    </div>
                    <textarea
                      {...register(`translations.${index}.previewContent`)}
                      className={`textarea textarea-bordered w-full min-h-24 focus:textarea-neutral ${
                        errors.translations?.[index]?.previewContent ? 'textarea-error' : ''
                      }`}
                      placeholder="Enter translated preview content"
                      disabled={isLoading}
                    />
                    {errors.translations?.[index]?.previewContent && (
                      <div className="label">
                        <span className="label-text-alt text-error">
                          {errors.translations[index]?.previewContent?.message}
                        </span>
                      </div>
                    )}
                  </label>

                  {/* Translated Full Content */}
                  <div className="form-control w-full">
                    <div className="label">
                      <span className="label-text font-medium">Translated Full Content</span>
                    </div>
                    <div className="bg-base-100 rounded-xl border-2 border-base-300 overflow-hidden">
                      <Controller
                        name={`translations.${index}.content`}
                        control={control}
                        render={({ field: contentField }) => (
                          <RichTextEditor
                            key={`translation-editor-${index}-${id}`}
                            id={`translation-content-editor-${index}`}
                            defaultValue={originalTranslationContents[index] || ''}
                            onTextChange={(value: string) => {
                              contentField.onChange(value);
                            }}
                            onSelectionChange={() => {}}
                            readOnly={false}
                          />
                        )}
                      />
                    </div>
                    {errors.translations?.[index]?.content && (
                      <div className="label">
                        <span className="label-text-alt text-error">
                          {errors.translations[index]?.content?.message}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
        <button
          type="button"
          className="btn btn-ghost gap-2 hover:bg-base-200"
          onClick={() => navigate('/admin/blogs')}
          disabled={isLoading}
        >
          <ArrowLeft className="w-4 h-4" />
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary flex-1 gap-2 shadow-lg hover:shadow-primary/25"
          disabled={isLoading}
        >
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
