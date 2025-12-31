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
import { Plus, Trash2, Save } from 'lucide-react';

const AVAILABLE_LANGUAGES = [{ code: 'vi', displayName: 'Vietnamese (vi)' }];

export default function CategoryForm({ id }: { id?: string }) {
  const navigate = useNavigate();
  const { token } = useAuth();
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
          );
          if (response && response.ok) {
            const data: CategoryModel = await response.json();
            reset({
              displayName: data.displayName,
              categoryType: data.categoryType,
              tagNames: data.categoryTags.map((tag: TagModel) => tag.name),
              translations: data.categoryTranslations.map((ct) => ({
                id: ct.id,
                languageCode: ct.languageCode,
                displayName: ct.displayName,
              })),
              rowVersion: data.rowVersion,
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
          translations: data.translations.map((translation) => ({
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
          translations: data.translations.map((translation) => ({
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
    const usedLanguages = translations.map((t) => t.languageCode);
    const conditionEveryLanguageCodesUsed = AVAILABLE_LANGUAGES.every((lang) =>
      usedLanguages.includes(lang.code),
    );
    const conditionMaxTabs = fields.length >= AVAILABLE_LANGUAGES.length;
    return conditionEveryLanguageCodesUsed || conditionMaxTabs;
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col space-y-4 w-full max-w-md"
    >
      <label className="form-control w-full">
        <div className="label">
          <span className="label-text font-medium">Display Name</span>
        </div>
        <input
          type="text"
          {...register('displayName')}
          className={`input input-bordered w-full ${errors.displayName ? 'input-error' : ''}`}
          placeholder="Enter display name"
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

      <label className="form-control w-full">
        <div className="label">
          <span className="label-text font-medium">Tags</span>
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
              className="flex flex-wrap border border-base-300 rounded-md p-2"
              loading={isLoading}
              formControlName="categoryTags"
            />
          )}
        />
      </label>

      <div className="form-control w-full">
        <div className="label">
          <span className="label-text font-medium">Category Translations</span>
        </div>
        <div className="tabs tabs-box">
          {fields.map((field, index) => (
            <button
              key={field.id}
              type="button"
              className={`tab ${activeTab === index ? 'tab-active' : ''}`}
              onClick={() => setActiveTab(index)}
            >
              {translations[index]?.languageCode || `Tab ${index + 1}`}
            </button>
          ))}
          <button
            type="button"
            className="btn btn-sm btn-outline ml-2"
            onClick={addTranslationTab}
            disabled={isAddTabDisabled()}
          >
            <Plus size={16} />
            Add
          </button>
        </div>

        <div className="mt-2">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className={`p-4 border border-base-300 rounded-md ${
                activeTab === index ? '' : 'hidden'
              }`}
            >
              <div className="flex justify-end mb-2">
                <button
                  type="button"
                  className="btn btn-sm btn-ghost text-error"
                  onClick={() => removeTranslationTab(index)}
                  disabled={isLoading}
                >
                  <Trash2 size={16} />
                  Remove
                </button>
              </div>

              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text">Language Code</span>
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

              <label className="form-control w-full mt-4">
                <div className="label">
                  <span className="label-text">Display Name</span>
                </div>
                <input
                  type="text"
                  {...register(`translations.${index}.displayName`)}
                  className={`input input-bordered w-full ${
                    errors.translations?.[index]?.displayName ? 'input-error' : ''
                  }`}
                  placeholder="Enter translated display name"
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
          ))}
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => navigate('/admin/categories')}
          disabled={isLoading}
        >
          Cancel
        </button>
        <button type="submit" className="btn btn-primary flex-1" disabled={isLoading}>
          {isSubmitting ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Saving...
            </>
          ) : (
            <>
              <Save size={18} />
              {id ? 'Update' : 'Create'}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
