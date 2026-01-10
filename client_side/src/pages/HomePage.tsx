const HomePage = () => {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="hero min-h-[60vh] bg-base-200 rounded-lg">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Welcome to My Blog</h1>
            <p className="py-6 text-lg">
              Discover amazing articles, tutorials, and insights about web
              development, technology, and more.
            </p>
            <button className="btn btn-primary">Explore Articles</button>
          </div>
        </div>
      </div>

      {/* Featured Posts Section */}
      <section>
        <h2 className="text-3xl font-bold mb-6">Featured Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Sample Post Card 1 */}
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h3 className="card-title">Getting Started with RSBuild</h3>
              <p>
                Learn how to set up and configure RSBuild for your next React
                project.
              </p>
              <div className="card-actions justify-end">
                <button className="btn btn-primary btn-sm">Read More</button>
              </div>
            </div>
          </div>

          {/* Sample Post Card 2 */}
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h3 className="card-title">DaisyUI Components Guide</h3>
              <p>
                Explore the beautiful components that DaisyUI offers for your
                Tailwind CSS projects.
              </p>
              <div className="card-actions justify-end">
                <button className="btn btn-primary btn-sm">Read More</button>
              </div>
            </div>
          </div>

          {/* Sample Post Card 3 */}
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h3 className="card-title">Server-Side Rendering with React</h3>
              <p>
                Understand the benefits and implementation of SSR in modern web
                applications.
              </p>
              <div className="card-actions justify-end">
                <button className="btn btn-primary btn-sm">Read More</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Posts Section */}
      <section>
        <h2 className="text-3xl font-bold mb-6">Recent Posts</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="card bg-base-200 shadow-md">
              <div className="card-body">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="card-title">Blog Post Title {item}</h3>
                    <p className="text-sm opacity-70 mt-2">
                      Posted on January {item}, 2026
                    </p>
                    <p className="mt-2">
                      This is a brief excerpt of the blog post that gives
                      readers a preview of the content...
                    </p>
                  </div>
                  <button className="btn btn-primary btn-sm ml-4">Read</button>
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
