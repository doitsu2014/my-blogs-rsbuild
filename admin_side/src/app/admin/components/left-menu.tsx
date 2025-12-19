import MenuItem from './menu-item';
import { UserCircle } from 'lucide-react';
import { useAuth } from '@/auth/AuthContext';

export default function LeftMenu() {
  const { userInfo, logout } = useAuth();
  
  const userName = userInfo?.name || userInfo?.username || 'Admin User';
  const userEmail = userInfo?.email || 'admin@example.com';

  return (
    <aside className="w-64 bg-base-200 shadow-lg min-h-screen p-4 flex flex-col">
      <div className="flex items-center space-x-3 py-4 px-2 bg-base-100 rounded-box shadow-md">
        <UserCircle className="w-16 h-16 text-gray-500" />
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
          <button className="btn btn-error w-full" onClick={logout}>
            Logout
          </button>
        )}
      </div>
    </aside>
  );
}
