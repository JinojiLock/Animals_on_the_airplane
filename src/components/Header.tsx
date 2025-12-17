import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center space-x-3">
          <span className="text-4xl">🐾</span>
          <h1 className="text-3xl font-bold">
            Авиакомпании для путешествий с животными
          </h1>
        </div>
        <p className="text-center mt-2 text-blue-100">
          Найдите подходящую авиакомпанию для перевозки вашего питомца
        </p>
      </div>
    </header>
  );
};

export default Header;
