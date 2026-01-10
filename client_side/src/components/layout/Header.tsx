import { Link } from 'react-router-dom';

const AVATAR_URL = 'https://my-cms-api.ducth.dev/media/wwlkmlklf2-duc-tran-png.png';

const Header = () => {
  return (
    <header className="bg-base-200 shadow-lg">
      <div className="container mx-auto flex justify-between items-center py-2 px-4">
        <Link to="/" className="btn btn-ghost btn-circle avatar">
          <div className="w-10 rounded-full">
            <img src={AVATAR_URL} alt="Duc Tran's Blog" />
          </div>
        </Link>
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/categories">Categories</Link>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
