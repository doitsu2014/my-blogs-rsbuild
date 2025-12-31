import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { categoryFormSchema, type CategoryFormData } from '@/schemas/category.schema';
import MultiChipInput, {
  getRandomColor,
} from '../components/inputs/multi-chip-input';
import type { UpdateCategoryModel } from '@/models/UpdateCategoryModel';
import type { CreateCategoryModel } from '@/models/CreateCategoryModel';
import { CategoryTypeEnum, type CategoryModel } from '@/domains/category';
import type { TagModel } from '@/domains/tag';
import { getApiUrl, authenticatedFetch } from '@/config/api.config';
import { useAuth } from '@/auth/AuthContext';
import { Plus, Save, ArrowLeft, Languages, X } from 'lucide-react';

const AVAILABLE_LANGUAGES = [{ code: 'vi', displayName: 'Vietnamese (vi)' }];

export default function CategoryForm({ id }: { id?: string }) {
  const navigate = useNavigate();
  const { token, keycloak } = useAuth();
  const [fetchingData, setFetchingData] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      displayName: '',
      categoryType: CategoryTypeEnum.Blog,
      tagNames: [],
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
      const fetchCategory = async () => {
        setFetchingData(true);
        try {
          const response = await authenticatedFetch(
            getApiUrl(`/categories/${id}`),
            token,
            { cache: 'no-store' },
            keycloak || undefined,
          );
          if (response && response.ok) {
            const res: { data: CategoryModel } = await response.json();
            reset({
              displayName: res.data.displayName,
              categoryType:  res.data.categoryType,
              tagNames: res.data.tags?.map((tag: TagModel) => tag.name),
              translations: res.data.translations?.map((ct) => ({
                id: ct.id,
                languageCode: ct.languageCode,
                displayName: ct.displayName,
              })),
              rowVersion: res.data.rowVersion,
            });
          } else {
            toast.error('Failed to load category');
          }
        } catch (error) {
          console.error('Failed to load category:', error);
          toast.error('Error loading category');
        } finally {
          setFetchingData(false);
        }
      };

      fetchCategory();
    } else {
      reset({
        displayName: '',
        categoryType: CategoryTypeEnum.Blog,
        tagNames: [],
        translations: [],
        rowVersion: 0,
      });
    }
  }, [id, reset, token]);

  const onSubmit = async (data: CategoryFormData) => {
    try {
      if (id) {
        const categoryData: UpdateCategoryModel = {
          id,
          displayName: data.displayName,
          categoryType: data.categoryType,
          tagNames: data.tagNames,
          rowVersion: data.rowVersion,
          translations: data.translations?.map((translation) => ({
            displayName: translation.displayName,
            id: translation.id || undefined,
            languageCode: translation.languageCode,
          })),
        };

        const updateResponse = await authenticatedFetch(
          getApiUrl('/categories'),
          token,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(categoryData),
          },
          keycloak || undefined,
        );

        if (updateResponse.ok) {
          toast.success('Category updated successfully');
          navigate('/admin/categories');
        } else {
          const errorData = await updateResponse.json();
          console.error(errorData, updateResponse.status);
          toast.error(errorData.message || 'Failed to update category');
        }
      } else {
        const categoryData: CreateCategoryModel = {
          displayName: data.displayName,
          categoryType: data.categoryType,
          tagNames: data.tagNames,
          translations: data.translations?.map((translation) => ({
            displayName: translation.displayName,
            languageCode: translation.languageCode,
          })),
        };

        const createResponse = await authenticatedFetch(
          getApiUrl('/categories'),
          token,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(categoryData),
          },
          keycloak || undefined,
        );

        if (createResponse.ok) {
          toast.success('Category created successfully');
          navigate('/admin/categories');
        } else {
          const errorData = await createResponse.json();
          console.error(errorData, createResponse.status);
          toast.error(errorData.message || 'Failed to create category');
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Network error. Please try again.');
    }
  };

  const addTranslationTab = () => {
    append({ id: '', languageCode: '', displayName: '' });
    setActiveTab(fields.length);
  };

  const removeTranslationTab = (index: number) => {
    remove(index);
    if (activeTab >= fields.length - 1) {
      setActiveTab(Math.max(0, fields.length - 2));
    }
  };

  const isAddTabDisabled = () => {
    const usedLanguages = translations?.map((t) => t.languageCode) || [];
    const conditionEveryLanguageCodesUsed = AVAILABLE_LANGUAGES.every((lang) =>
      usedLanguages.includes(lang.code),
    );
    const conditionMaxTabs = fields.length >= AVAILABLE_LANGUAGES.length;
    return conditionEveryLanguageCodesUsed || conditionMaxTabs;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full max-w-2xl">
      {/* Basic Information Card */}
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body">
          <h2 className="card-title text-lg">Basic Information</h2>
          <p className="text-sm text-base-content/60 mb-4">
            Set the display name and type for this category
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text font-medium">Display Name</span>
              </div>
              <input
                type="text"
                {...register('displayName')}
                className={`input input-bordered w-full ${errors.displayName ? 'input-error' : ''}`}
                placeholder="e.g., Technology"
                disabled={isLoading}
              />
              {errors.displayName && (
                <div className="label">
                  <span className="label-text-alt text-error">{errors.displayName.message}</span>
                </div>
              )}
            </label>

            <label className="form-control w-full">
              <div className="label">
                <span className="label-text font-medium">Category Type</span>
              </div>
              <select
                {...register('categoryType')}
                className={`select select-bordered w-full ${errors.categoryType ? 'select-error' : ''}`}
                disabled={isLoading}
              >
                <option value={CategoryTypeEnum.Blog}>Blog</option>
                <option value={CategoryTypeEnum.Other}>Other</option>
              </select>
              {errors.categoryType && (
                <div className="label">
                  <span className="label-text-alt text-error">{errors.categoryType.message}</span>
                </div>
              )}
            </label>
          </div>

          <label className="form-control w-full mt-2">
            <div className="label">
              <span className="label-text font-medium">Tags</span>
              <span className="label-text-alt text-base-content/50">Optional</span>
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
                  className="flex flex-wrap border border-base-300 rounded-lg p-3 min-h-[48px] bg-base-100"
                  loading={isLoading}
                  formControlName="tags"
                />
              )}
            />
            <div className="label">
              <span className="label-text-alt text-base-content/50">
                Press Enter to add a tag
              </span>
            </div>
          </label>
        </div>
      </div>

      {/* Translations Card */}
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="card-title text-lg flex items-center gap-2">
                <Languages className="w-5 h-5" />
                Translations
              </h2>
              <p className="text-sm text-base-content/60">
                Add translations for different languages
              </p>
            </div>
            <button
              type="button"
              className="btn btn-sm btn-outline btn-primary gap-1"
              onClick={addTranslationTab}
              disabled={isAddTabDisabled() || isLoading}
            >
              <Plus className="w-4 h-4" />
              Add Language
            </button>
          </div>

          {fields.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-base-300 rounded-lg">
              <Languages className="w-10 h-10 mx-auto text-base-content/30 mb-2" />
              <p className="text-base-content/50 text-sm">No translations added yet</p>
              <button
                type="button"
                className="btn btn-sm btn-ghost mt-2"
                onClick={addTranslationTab}
                disabled={isAddTabDisabled() || isLoading}
              >
                Add first translation
              </button>
            </div>
          ) : (
            <>
              {/* Translation Tabs */}
              <div className="tabs tabs-boxed bg-base-200 p-1 rounded-lg mb-4">
                {fields.map((field, index) => (
                  <button
                    key={field.id}
                    type="button"
                    className={`tab gap-2 ${activeTab === index ? 'tab-active' : ''}`}
                    onClick={() => setActiveTab(index)}
                  >
                    {translations[index]?.languageCode?.toUpperCase() || `New`}
                  </button>
                ))}
              </div>

              {/* Translation Content */}
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className={`space-y-4 ${activeTab === index ? '' : 'hidden'}`}
                >
                  <div className="flex items-center justify-between pb-2 border-b border-base-200">
                    <span className="text-sm font-medium text-base-content/70">
                      Translation #{index + 1}
                    </span>
                    <button
                      type="button"
                      className="btn btn-sm btn-ghost text-error gap-1"
                      onClick={() => removeTranslationTab(index)}
                      disabled={isLoading}
                    >
                      <X className="w-4 h-4" />
                      Remove
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="form-control w-full">
                      <div className="label">
                        <span className="label-text">Language</span>
                      </div>
                      <select
                        {...register(`translations.${index}.languageCode`)}
                        className={`select select-bordered w-full ${
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

                    <label className="form-control w-full">
                      <div className="label">
                        <span className="label-text">Translated Name</span>
                      </div>
                      <input
                        type="text"
                        {...register(`translations.${index}.displayName`)}
                        className={`input input-bordered w-full ${
                          errors.translations?.[index]?.displayName ? 'input-error' : ''
                        }`}
                        placeholder="Enter translated name"
                        disabled={isLoading}
                      />
                      {errors.translations?.[index]?.displayName && (
                        <div className="label">
                          <span className="label-text-alt text-error">
                            {errors.translations[index]?.displayName?.message}
                          </span>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
        <button
          type="button"
          className="btn btn-ghost gap-2"
          onClick={() => navigate('/admin/categories')}
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
              {id ? 'Update Category' : 'Create Category'}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
