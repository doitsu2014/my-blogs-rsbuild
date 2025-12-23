import React from 'react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  logo?: string;
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  logo,
  className = '',
}) => {
  return (
    <header className={`bg-white shadow-sm border-b border-gray-200 ${className}`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {logo && (
              <img src={logo} alt="Logo" className="h-10 w-10 object-contain" />
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              {subtitle && (
                <p className="text-sm text-gray-600">{subtitle}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
