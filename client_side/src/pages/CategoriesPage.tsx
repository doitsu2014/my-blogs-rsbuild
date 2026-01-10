import { useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { useParams, Link } from 'react-router-dom';
import { GET_CATEGORIES } from '../infrastructure/graphql/queries';

interface Category {
  id: string;
  displayName: string;
  slug: string;
  categoryType: string;
  translations?: {
    nodes: Array<{
      id: string;
      languageCode: string;
      displayName: string;
    }>;
  };
  tags?: {
    nodes: Array<{
      tags: {
        id: string;
        name: string;
      };
    }>;
  };
}

const CategoriesPage = () => {
  const { t } = useTranslation();
  const { lang } = useParams<{ lang: string }>();
  const currentLang = lang || 'en';

  // Fetch categories
  const { loading, error, data } = useQuery(GET_CATEGORIES);

  // Helper to get translated name
  const getTranslatedName = (category: Category) => {
    if (currentLang !== 'en' && category.translations?.nodes) {
      const translation = category.translations.nodes.find(
        (t) => t.languageCode === currentLang
      );
      if (translation?.displayName) return translation.displayName;
    }
    return category.displayName;
  };

  // Get blog categories only
  const categories = (data?.categories?.nodes || []).filter(
    (cat: Category) => cat.categoryType === 'Blog'
  );

  // Color palette for categories
  const colors = ['primary', 'secondary', 'accent', 'info', 'success', 'warning'];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold">{t('browseCategories')}</h1>
        <p className="text-xl opacity-70">{t('categoriesDescription')}</p>
      </div>

      {loading && (
        <div className="flex justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      )}

      {error && (
        <div className="alert alert-error">
          <span>
            {t('error')}: {error.message}
          </span>
        </div>
      )}

      {!loading && !error && categories.length === 0 && (
        <div className="alert alert-info">
          <span>{t('noDataAvailable')}</span>
        </div>
      )}

      {/* Categories Grid */}
      {!loading && !error && categories.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {categories.map((category: Category, index: number) => {
              const postCount = category.tags?.nodes?.length || 0;
              const colorClass = colors[index % colors.length];

              return (
                <div
                  key={category.id}
                  className="card bg-base-200 shadow-xl hover:shadow-2xl transition-shadow"
                >
                  <div className="card-body">
                    <div className={`badge badge-${colorClass} mb-2`}>
                      {postCount} {t('posts')}
                    </div>
                    <h2 className="card-title">{getTranslatedName(category)}</h2>
                    <p className="opacity-80">
                      {category.slug.replace(/-/g, ' ')}
                    </p>
                    <div className="card-actions justify-end mt-4">
                      <Link
                        to={`/${currentLang}/categories/${category.slug}`}
                        className="btn btn-primary btn-sm"
                      >
                        {t('viewPosts')}
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Category Stats */}
          <div className="stats stats-vertical lg:stats-horizontal shadow w-full mt-12">
            <div className="stat">
              <div className="stat-title">{t('totalCategories')}</div>
              <div className="stat-value">{categories.length}</div>
              <div className="stat-desc">{t('organizedTopics')}</div>
            </div>

            <div className="stat">
              <div className="stat-title">{t('totalPosts')}</div>
              <div className="stat-value">
                {categories.reduce(
                  (sum: number, cat: Category) =>
                    sum + (cat.tags?.nodes?.length || 0),
                  0
                )}
              </div>
              <div className="stat-desc">{t('acrossAllCategories')}</div>
            </div>

            <div className="stat">
              <div className="stat-title">{t('mostPopular')}</div>
              <div className="stat-value text-primary">
                {categories.length > 0
                  ? getTranslatedName(
                      categories.reduce((max: Category, cat: Category) =>
                        (cat.tags?.nodes?.length || 0) >
                        (max.tags?.nodes?.length || 0)
                          ? cat
                          : max
                      )
                    ).split(' ')[0]
                  : '-'}
              </div>
              <div className="stat-desc">{t('categoryWithMostPosts')}</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CategoriesPage;
