import { useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { GET_BLOG_POSTS } from '../infrastructure/graphql/queries';

const AVATAR_URL = 'https://my-cms-api.ducth.dev/media/wwlkmlklf2-duc-tran-png.png';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  contentMarkdown: string;
  createdAt: string;
  thumbnailUrl?: string;
  translations?: {
    nodes: Array<{
      id: string;
      languageCode: string;
      title: string;
    }>;
  };
  category?: {
    displayName: string;
  };
}

const HomePage = () => {
  const { t } = useTranslation();
  const { lang } = useParams<{ lang: string }>();
  const currentLang = lang || 'en';

  // Fetch blog posts
  const { loading, error, data } = useQuery(GET_BLOG_POSTS, {
    variables: { limit: 6, offset: 0 },
  });

  // Helper to get translated title
  const getTranslatedTitle = (post: BlogPost) => {
    if (currentLang !== 'en' && post.translations?.nodes) {
      const translation = post.translations.nodes.find(
        (t) => t.languageCode === currentLang
      );
      if (translation?.title) return translation.title;
    }
    return post.title;
  };

  // Helper to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      currentLang === 'vi' ? 'vi-VN' : 'en-US',
      { year: 'numeric', month: 'long', day: 'numeric' }
    );
  };

  const featuredPosts = data?.blogs?.nodes?.slice(0, 3) || [];
  const recentPosts = data?.blogs?.nodes?.slice(3, 6) || [];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="hero min-h-[60vh] bg-base-200 rounded-lg">
        <div className="hero-content text-center">
          <div className="max-w-2xl">
            <div className="avatar mb-6">
              <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img src={AVATAR_URL} alt="Duc Tran" />
              </div>
            </div>
            <h1 className="text-5xl font-bold">{t('welcome')}</h1>
            <p className="py-6 text-lg">{t('description')}</p>
            <button className="btn btn-primary">{t('exploreArticles')}</button>
          </div>
        </div>
      </div>

      {/* Featured Posts Section */}
      <section>
        <h2 className="text-3xl font-bold mb-6">{t('featuredPosts')}</h2>
        {loading && (
          <div className="flex justify-center">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        )}
        {error && (
          <div className="alert alert-error">
            <span>{t('error')}: {error.message}</span>
          </div>
        )}
        {!loading && !error && featuredPosts.length === 0 && (
          <div className="alert alert-info">
            <span>{t('noDataAvailable')}</span>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredPosts.map((post: BlogPost) => (
            <div key={post.id} className="card bg-base-200 shadow-xl">
              {post.thumbnailUrl && (
                <figure>
                  <img
                    src={post.thumbnailUrl}
                    alt={getTranslatedTitle(post)}
                    className="h-48 w-full object-cover"
                  />
                </figure>
              )}
              <div className="card-body">
                <h3 className="card-title">{getTranslatedTitle(post)}</h3>
                {post.category && (
                  <div className="badge badge-primary">{post.category.displayName}</div>
                )}
                <p>
                  {post.contentMarkdown.substring(0, 100)}...
                </p>
                <div className="card-actions justify-end">
                  <button className="btn btn-primary btn-sm">{t('readMore')}</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Posts Section */}
      <section>
        <h2 className="text-3xl font-bold mb-6">{t('recentPosts')}</h2>
        <div className="space-y-4">
          {recentPosts.map((post: BlogPost) => (
            <div key={post.id} className="card bg-base-200 shadow-md">
              <div className="card-body">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="card-title">{getTranslatedTitle(post)}</h3>
                    <p className="text-sm opacity-70 mt-2">
                      {t('postedOn')} {formatDate(post.createdAt)}
                    </p>
                    <p className="mt-2">
                      {post.contentMarkdown.substring(0, 150)}...
                    </p>
                  </div>
                  <button className="btn btn-primary btn-sm ml-4">{t('read')}</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
