import MenuItem from './menu-item';
import { UserCircle } from 'lucide-react';
import { useAuth } from '@/auth/AuthContext';

export default function LeftMenu() {
  const { userInfo, logout, login, authenticated, token, keycloak } = useAuth();
  
  const userName = userInfo?.name || userInfo?.username || 'Admin User';
  const userEmail = userInfo?.email || 'admin@example.com';

  // Keycloak test actions
  const handleCheckAuth = () => {
    console.log('=== Authentication Status ===');
    console.log('Authenticated:', authenticated);
    console.log('Keycloak authenticated:', keycloak?.authenticated);
    alert(`Authenticated: ${authenticated}`);
  };

  const handleShowToken = () => {
    console.log('=== Token Information ===');
    console.log('Token:', token);
    console.log('Token parsed:', keycloak?.tokenParsed);
    console.log('Token expires in (seconds):', keycloak?.tokenParsed?.exp ? keycloak.tokenParsed.exp - Math.floor(Date.now() / 1000) : 'N/A');
    console.log('Refresh token available:', keycloak?.refreshToken ? 'YES' : 'NO');
    console.log('Refresh token:', keycloak?.refreshToken);
    console.log('Refresh token parsed:', keycloak?.refreshTokenParsed);

    const hasRefreshToken = keycloak?.refreshToken ? 'YES ✓' : 'NO ✗';
    alert(token ? `Token: ${token.substring(0, 50)}...\n\nRefresh Token Available: ${hasRefreshToken}\n\nCheck console for full details` : 'No token available');
  };

  const handleRefreshToken = async () => {
    try {
      console.log('=== Refreshing Token ===');
      const refreshed = await keycloak?.updateToken(70);
      console.log('Token refreshed:', refreshed);
      console.log('New token:', keycloak?.token);
      alert(`Token refresh ${refreshed ? 'successful' : 'not needed (token still valid)'}`);
    } catch (error) {
      console.error('Token refresh failed:', error);
      alert('Token refresh failed! Check console for details.');
    }
  };

  const handleShowUserInfo = () => {
    console.log('=== User Information ===');
    console.log('User Info:', userInfo);
    console.log('Keycloak subject:', keycloak?.subject);
    console.log('Keycloak realm access:', keycloak?.realmAccess);
    console.log('Keycloak resource access:', keycloak?.resourceAccess);
    alert(`User: ${userName}\nEmail: ${userEmail}\nCheck console for full details`);
  };

  const handleCheckTokenValidity = () => {
    const isExpired = keycloak?.isTokenExpired();
    const timeSkew = keycloak?.timeSkew;
    console.log('=== Token Validity ===');
    console.log('Is token expired:', isExpired);
    console.log('Time skew:', timeSkew);
    console.log('Token parsed:', keycloak?.tokenParsed);
    alert(`Token expired: ${isExpired}\nTime skew: ${timeSkew} seconds`);
  };

  const handleShowAllKeycloakInfo = () => {
    console.log('=== Complete Keycloak State ===');
    console.log('Keycloak instance:', keycloak);
    console.log('Authenticated:', authenticated);
    console.log('Token:', token);
    console.log('User Info:', userInfo);
    console.log('Token Parsed:', keycloak?.tokenParsed);
    console.log('Refresh Token:', keycloak?.refreshToken);
    console.log('ID Token:', keycloak?.idToken);
    console.log('ID Token Parsed:', keycloak?.idTokenParsed);
    alert('Complete Keycloak state logged to console. Open DevTools to view.');
  };

  const handleLoadUserProfile = async () => {
    try {
      console.log('=== Loading User Profile ===');
      const profile = await keycloak?.loadUserProfile();
      console.log('User profile:', profile);
      alert(`Profile loaded!\nUsername: ${profile?.username}\nEmail: ${profile?.email}\nCheck console for full profile`);
    } catch (error) {
      console.error('Failed to load user profile:', error);
      alert('Failed to load user profile! Check console for details.');
    }
  };

  return (
    <aside className="bg-base-200 min-h-full w-64 p-4 flex flex-col">
      {/* User Profile Card */}
      <div className="card bg-base-100 shadow-md mb-4">
        <div className="card-body p-4">
          <div className="flex items-center gap-3">
            <div className="avatar placeholder">
              <div className="bg-neutral text-neutral-content rounded-full w-12">
                <UserCircle className="w-8 h-8" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-bold text-sm truncate">{userName}</h2>
              <p className="text-xs opacity-70 truncate">{userEmail}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <ul className="menu bg-base-200 rounded-box flex-1 w-full">
        <li>
          <MenuItem displayName="Dashboard" slug="/admin" />
        </li>
        <li>
          <details open>
            <summary className="font-semibold">Resources</summary>
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
        <li>
          <details>
            <summary className="text-primary font-semibold">
              <span className="mr-2">🔐</span>Keycloak Test
            </summary>
            <ul className="p-2 space-y-1">
              <li>
                <button
                  className="btn btn-xs btn-outline w-full justify-start"
                  onClick={handleCheckAuth}
                >
                  Check Auth
                </button>
              </li>
              <li>
                <button
                  className="btn btn-xs btn-outline w-full justify-start"
                  onClick={handleShowToken}
                >
                  Show Token
                </button>
              </li>
              <li>
                <button
                  className="btn btn-xs btn-outline w-full justify-start"
                  onClick={handleRefreshToken}
                >
                  Refresh Token
                </button>
              </li>
              <li>
                <button
                  className="btn btn-xs btn-outline w-full justify-start"
                  onClick={handleShowUserInfo}
                >
                  Show User Info
                </button>
              </li>
              <li>
                <button
                  className="btn btn-xs btn-outline w-full justify-start"
                  onClick={handleCheckTokenValidity}
                >
                  Check Token Valid
                </button>
              </li>
              <li>
                <button
                  className="btn btn-xs btn-outline w-full justify-start"
                  onClick={handleLoadUserProfile}
                >
                  Load User Profile
                </button>
              </li>
              <li>
                <button
                  className="btn btn-xs btn-accent w-full justify-start"
                  onClick={handleShowAllKeycloakInfo}
                >
                  Show All Info
                </button>
              </li>
            </ul>
          </details>
        </li>
      </ul>

      {/* Auth Button */}
      <div className="mt-4">
        {authenticated ? (
          <button className="btn btn-error btn-block" onClick={logout}>
            Logout
          </button>
        ) : (
          <button className="btn btn-primary btn-block" onClick={login}>
            Login
          </button>
        )}
      </div>
    </aside>
  );
}
