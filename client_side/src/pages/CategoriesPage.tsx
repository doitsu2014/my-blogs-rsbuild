import { Link } from 'react-router-dom';

const CategoriesPage = () => {
  // Sample categories data
  const categories = [
    {
      id: 1,
      name: 'Web Development',
      description: 'Articles about modern web development technologies and practices',
      postCount: 12,
      color: 'primary',
    },
    {
      id: 2,
      name: 'React & Frontend',
      description: 'Deep dives into React, state management, and frontend architecture',
      postCount: 8,
      color: 'secondary',
    },
    {
      id: 3,
      name: 'DevOps & Cloud',
      description: 'Deployment, CI/CD, cloud services, and infrastructure topics',
      postCount: 6,
      color: 'accent',
    },
    {
      id: 4,
      name: 'Design & UI/UX',
      description: 'User interface design, user experience, and visual design principles',
      postCount: 10,
      color: 'info',
    },
    {
      id: 5,
      name: 'Backend Development',
      description: 'Server-side programming, APIs, databases, and microservices',
      postCount: 15,
      color: 'success',
    },
    {
      id: 6,
      name: 'Mobile Development',
      description: 'iOS, Android, React Native, and cross-platform mobile apps',
      postCount: 7,
      color: 'warning',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold">Browse Categories</h1>
        <p className="text-xl opacity-70">
          Explore articles organized by topics and themes
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {categories.map((category) => (
          <div
            key={category.id}
            className={`card bg-base-200 shadow-xl hover:shadow-2xl transition-shadow`}
          >
            <div className="card-body">
              <div className={`badge badge-${category.color} mb-2`}>
                {category.postCount} {category.postCount === 1 ? 'Post' : 'Posts'}
              </div>
              <h2 className="card-title">{category.name}</h2>
              <p className="opacity-80">{category.description}</p>
              <div className="card-actions justify-end mt-4">
                <Link
                  to={`/categories/${category.id}`}
                  className="btn btn-primary btn-sm"
                >
                  View Posts
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Category Stats */}
      <div className="stats stats-vertical lg:stats-horizontal shadow w-full mt-12">
        <div className="stat">
          <div className="stat-title">Total Categories</div>
          <div className="stat-value">{categories.length}</div>
          <div className="stat-desc">Organized topics</div>
        </div>

        <div className="stat">
          <div className="stat-title">Total Posts</div>
          <div className="stat-value">
            {categories.reduce((sum, cat) => sum + cat.postCount, 0)}
          </div>
          <div className="stat-desc">Across all categories</div>
        </div>

        <div className="stat">
          <div className="stat-title">Most Popular</div>
          <div className="stat-value text-primary">
            {categories.reduce((max, cat) =>
              cat.postCount > max.postCount ? cat : max
            ).name.split(' ')[0]}
          </div>
          <div className="stat-desc">Category with most posts</div>
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
