import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MultiChipInput, {
  getRandomColor,
} from '../components/inputs/multi-chip-input';
import type { UpdateCategoryModel } from '@/models/UpdateCategoryModel';
import type { CreateCategoryModel } from '@/models/CreateCategoryModel';
import { CategoryTypeEnum, type CategoryModel } from '@/domains/category';
import type { TagModel } from '@/domains/tag';
import { getApiUrl, authenticatedFetch } from '@/config/api.config';
import { useAuth } from '@/auth/AuthContext';

const AVAILABLE_LANGUAGES = [{ code: 'vi', displayName: 'Vietnamese (vi)' }];

export default function CategoryForm({ id }: { id?: string }) {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [categoryType, setCategoryType] = useState(CategoryTypeEnum.Blog);
  const [categoryTags, setCategoryTags] = useState<
    { label: string; color: string }[]
  >([]);
  const [rowVersion, setRowVersion] = useState(0);
  const [loading, setLoading] = useState(false);
  const [categoryTranslations, setCategoryTranslations] = useState<
    { id: string; languageCode: string; displayName: string }[]
  >([]);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (id) {
      const fetchCategories = async () => {
        try {
          const response = await authenticatedFetch(
            getApiUrl(`/categories/${id}`),
            token,
            { cache: 'no-store' },
          );
          if (response && response.ok) {
            const data: CategoryModel = await response.json();
            setDisplayName(data.displayName);
            setCategoryType(data.categoryType);
            setCategoryTags(
              data.categoryTags.map((tag: TagModel) => ({
                label: tag.name,
                color: getRandomColor(),
              })),
            );
            setCategoryTranslations(
              data.categoryTranslations.map((ct) => ({
                ...ct,
              })),
            );
            setRowVersion(data.rowVersion);
          }
        } catch (error) {
          console.error('Failed to load category:', error);
        } finally {
          setLoading(false);
        }
      };

      setLoading(true);
      fetchCategories();
    } else {
      setDisplayName('');
      setCategoryType(CategoryTypeEnum.Blog);
      setCategoryTags([]);
      setCategoryTranslations([]);
      setRowVersion(0);
    }
  }, [id]);

  const submitHandler = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      if (id) {
        const categoryData: UpdateCategoryModel = {
          id,
          displayName,
          categoryType,
          tagNames: categoryTags.map((tag) => tag.label),
          rowVersion,
          translations: categoryTranslations.map((translation) => ({
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
          navigate('/admin/categories');
        } else {
          console.error(await updateResponse.json(), updateResponse.status);
        }
      } else {
        console.info('Creating category');
        const categoryData: CreateCategoryModel = {
          displayName,
          categoryType,
          tagNames: categoryTags.map((tag) => tag.label),
          translations: categoryTranslations.map((translation) => ({
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
          navigate('/admin/categories');
        } else {
          console.error(await createResponse.json(), createResponse.status);
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTranslationTab = () => {
    setCategoryTranslations([
      ...categoryTranslations,
      { id: '', languageCode: '', displayName: '' },
    ]);
  };

  const isAddTabDisabled = () => {
    const usedLanguages = categoryTranslations.map((t) => t.languageCode);
    const conditionEveryLanguageCodesUsed = AVAILABLE_LANGUAGES.every((lang) =>
      usedLanguages.includes(lang.code),
    );
    const conditionMaxTabs =
      categoryTranslations.length >= AVAILABLE_LANGUAGES.length;
    return conditionEveryLanguageCodesUsed || conditionMaxTabs;
  };

  const updateTranslation = (
    index: number,
    field: 'languageCode' | 'displayName',
    value: string,
  ) => {
    const updatedTranslations = [...categoryTranslations];
    updatedTranslations[index][field] = value;
    setCategoryTranslations(updatedTranslations);
  };

  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  return (
    <form
      onSubmit={submitHandler}
      className="flex flex-col space-y-4 w-full max-w-md"
    >
      <label className="form-control w-full">
        <span className="label-text">Display Name</span>
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="input input-bordered w-full"
          placeholder="Enter display name"
          required
          name="displayName"
          disabled={loading}
        />
      </label>
      <label className="form-control w-full">
        <span className="label-text">Category Type</span>
        <select
          name="categoryType"
          value={categoryType}
          onChange={(e) => {
            setCategoryType(e.target.value as CategoryTypeEnum);
          }}
          className="select select-bordered w-full"
          disabled={loading}
        >
          <option value={CategoryTypeEnum.Blog}>Blog</option>
          <option value={CategoryTypeEnum.Other}>Other</option>
        </select>
      </label>
      <label className="form-control w-full">
        <span className="label-text">Tags</span>
        <MultiChipInput
          chips={categoryTags}
          setChips={(chips: { label: string; color: string }[]) => {
            setCategoryTags(
              chips.map((chip) => ({
                label: chip.label.toLowerCase(),
                color: chip.color,
              })),
            );
          }}
          className="flex flex-wrap border border-base-300 rounded-md p-2"
          loading={loading}
          formControlName="categoryTags"
        />
      </label>
      <div className="form-control w-full">
        <span className="label-text">Category Translations</span>
        <div className="tabs">
          <div className="tabs-box">
            {categoryTranslations?.map((translation, index) => (
              <button
                key={index}
                className={`tab ${activeTab === index ? 'tab-active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleTabClick(index);
                }}
              >
                {translation.languageCode || `Tab ${index + 1}`}
              </button>
            ))}
            <button
              type="button"
              className="btn btn-sm btn-outline ml-2"
              onClick={addTranslationTab}
              disabled={isAddTabDisabled()}
            >
              + Add Tab
            </button>
          </div>
          <div className="mt-2">
            {categoryTranslations?.map((translation, index) => (
              <div
                key={index}
                className={`p-4 border border-base-300 rounded-md ${
                  activeTab === index ? '' : 'hidden'
                }`}
              >
                <label className="form-control w-full">
                  <span className="label-text">Language Code</span>
                  <select
                    value={translation.languageCode}
                    onChange={(e) => {
                      updateTranslation(index, 'languageCode', e.target.value);
                      if (activeTab === index) {
                        handleTabClick(index); // Ensure tab name updates dynamically
                      }
                    }}
                    className="select select-bordered w-full"
                    required
                    disabled={loading}
                  >
                    <option value="">Select Language</option>
                    {AVAILABLE_LANGUAGES.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.displayName}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="form-control w-full mt-4">
                  <span className="label-text">Display Name</span>
                  <input
                    type="text"
                    value={translation.displayName}
                    onChange={(e) =>
                      updateTranslation(index, 'displayName', e.target.value)
                    }
                    className="input input-bordered w-full"
                    placeholder="Enter translated display name"
                    required
                    disabled={loading}
                  />
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
      <input
        type="hidden"
        name="categoryTranslations"
        value={JSON.stringify(categoryTranslations)}
      />
      <input type="hidden" name="rowVersion" value={rowVersion} />
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? 'Saving...' : id ? 'Update' : 'Create'}
      </button>
    </form>
  );
}
