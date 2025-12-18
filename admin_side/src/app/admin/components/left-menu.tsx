import MenuItem from './menu-item';
import { UserCircle } from 'lucide-react';

export default function LeftMenu() {
  // TODO: Replace with actual authentication in Phase 8
  const session = null;
  const avatar = undefined;
  const userName = 'Admin User';
  const userEmail = 'admin@example.com';

  return (
    <aside className="w-64 bg-base-200 shadow-lg min-h-screen p-4 flex flex-col">
      <div className="flex items-center space-x-3 py-4 px-2 bg-base-100 rounded-box shadow-md">
        {avatar ? (
          <img src={avatar} alt="User Avatar" className="w-16 h-16 rounded-full border" />
        ) : (
          <UserCircle className="w-16 h-16 text-gray-500" />
        )}
        <div>
          <h2 className="text-lg font-bold">{userName}</h2>
          <p className="text-sm text-gray-500 truncate w-40">{userEmail}</p>
        </div>
      </div>
      <ul className="menu rounded-box flex-1 mt-4 w-full">
        <li>
          <MenuItem displayName="Dashboard" slug="/admin" />
        </li>
        <li>
          <details open>
            <summary>Resources</summary>
            <ul>
              <li>
                <MenuItem displayName="Categories" slug="/admin/categories" />
              </li>
              <li>
                <MenuItem displayName="Blogs" slug="/admin/blogs" />
              </li>
            </ul>
          </details>
        </li>
      </ul>
      <div className="">
        {session ? (
          <button className="btn btn-error w-full" onClick={() => {
            // TODO: Implement logout in Phase 8
            console.log('Logout clicked');
          }}>
            Logout
          </button>
        ) : (
          <button className="btn btn-primary w-full" onClick={() => {
            // TODO: Implement login in Phase 8
            console.log('Login clicked');
          }}>
            Login
          </button>
        )}
      </div>
    </aside>
  );
}
