import React from 'react';

interface FooterProps {
  copyrightText?: string;
  links?: Array<{ label: string; href: string }>;
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({
  copyrightText = '© 2024 My Blogs. All rights reserved.',
  links = [],
  className = '',
}) => {
  return (
    <footer className={`bg-gray-800 text-white py-6 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm">{copyrightText}</p>
          {links.length > 0 && (
            <nav className="flex space-x-6">
              {links.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="text-sm hover:text-gray-300 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
