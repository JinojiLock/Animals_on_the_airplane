import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <span className="text-4xl">🐾</span>
            <div>
              <h1 className="text-3xl font-bold">
                Авиакомпании для путешествий с животными
              </h1>
              <p className="text-blue-100 text-sm mt-1">
                Найдите подходящую авиакомпанию для перевозки вашего питомца
              </p>
            </div>
          </Link>

          {!isAdminPage && (
            <Link
              to="/admin"
              className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-md transition-colors flex items-center gap-2"
            >
              <span>🛠</span>
              <span className="hidden md:inline">Админ</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
