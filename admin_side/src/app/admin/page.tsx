export default function AdminDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Total Categories</div>
            <div className="stat-value">0</div>
            <div className="stat-desc">All blog categories</div>
          </div>
        </div>
        
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Total Blogs</div>
            <div className="stat-value">0</div>
            <div className="stat-desc">All blog posts</div>
          </div>
        </div>
        
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Published</div>
            <div className="stat-value">0</div>
            <div className="stat-desc">Published posts</div>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
        <div className="flex gap-4">
          <a href="/admin/categories" className="btn btn-primary">
            Manage Categories
          </a>
          <a href="/admin/blogs" className="btn btn-secondary">
            Manage Blogs
          </a>
        </div>
      </div>
      
      <div className="mt-8 alert alert-info">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <span>Welcome to the admin panel. Use the left menu to navigate to different sections.</span>
      </div>
    </div>
  );
}
