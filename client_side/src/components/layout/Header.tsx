import { Link, useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

const AVATAR_URL = 'https://my-cms-api.ducth.dev/media/wwlkmlklf2-duc-tran-png.png';

const Header = () => {
  const { lang } = useParams<{ lang: string }>();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const currentLang = lang || 'en';

  // Sync i18n with URL language parameter
  useEffect(() => {
    if (i18n.language !== currentLang) {
      i18n.changeLanguage(currentLang);
    }
  }, [currentLang, i18n]);

  const handleLanguageChange = (newLang: string) => {
    const currentPath = window.location.pathname;
    const pathWithoutLang = currentPath.replace(`/${currentLang}`, '');
    navigate(`/${newLang}${pathWithoutLang || ''}`);
  };

  return (
    <header className="bg-base-200 shadow-lg">
      <div className="container mx-auto flex justify-between items-center py-2 px-4">
        <Link to={`/${currentLang}`} className="btn btn-ghost btn-circle avatar">
          <div className="w-10 rounded-full">
            <img src={AVATAR_URL} alt="Duc Tran's Blog" />
          </div>
        </Link>
        <div className="flex items-center gap-4">
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link to={`/${currentLang}`}>{t('home')}</Link>
            </li>
            <li>
              <Link to={`/${currentLang}/categories`}>{t('categories')}</Link>
            </li>
          </ul>
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-sm btn-ghost">
              {currentLang.toUpperCase()}
            </label>
            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-32">
              <li>
                <button onClick={() => handleLanguageChange('en')} className={currentLang === 'en' ? 'active' : ''}>
                  English
                </button>
              </li>
              <li>
                <button onClick={() => handleLanguageChange('vi')} className={currentLang === 'vi' ? 'active' : ''}>
                  Tiếng Việt
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
