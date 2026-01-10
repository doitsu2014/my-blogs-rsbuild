import { Link } from 'react-router-dom';

const AVATAR_URL = 'https://my-cms-api.ducth.dev/media/wwlkmlklf2-duc-tran-png.png';

const Header = () => {
  return (
    <header className="navbar bg-base-200 shadow-lg">
      <div className="container mx-auto">
        <div className="flex-1">
          <Link to="/" className="btn btn-ghost text-xl gap-2">
            <div className="avatar">
              <div className="w-10 rounded-full">
                <img src={AVATAR_URL} alt="Duc Tran" />
              </div>
            </div>
            <span>Duc Tran's Blog</span>
          </Link>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/categories">Categories</Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
