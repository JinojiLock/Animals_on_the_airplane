import React, { useState } from 'react';
import ContactForm from './ContactForm';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [showContactForm, setShowContactForm] = useState(false);

  return (
    <footer className="bg-gray-800 text-white mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* О проекте */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <span className="mr-2">🐾</span>
              О проекте
            </h3>
            <p className="text-gray-300 text-sm">
              Справочник по перевозке животных авиакомпаниями. 
              Вся информация собрана для удобства путешественников с питомцами.
            </p>
          </div>

          {/* Полезные ссылки */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Полезная информация</h3>
            <ul className="text-gray-300 text-sm space-y-2">
              <li>
                <span className="hover:text-blue-400 transition-colors cursor-pointer">
                  • Как подготовить питомца к полету
                </span>
              </li>
              <li>
                <span className="hover:text-blue-400 transition-colors cursor-pointer">
                  • Необходимые документы
                </span>
              </li>
              <li>
                <span className="hover:text-blue-400 transition-colors cursor-pointer">
                  • Выбор переноски
                </span>
              </li>
            </ul>
          </div>

          {/* Контакты */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Контакты</h3>
            <p className="text-gray-300 text-sm mb-3">
              Нашли ошибку или хотите дополнить информацию?
            </p>
            <button
              onClick={() => setShowContactForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              📧 Написать нам
            </button>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400 text-sm">
          <p>© {currentYear} Pet Airlines Directory. Все права защищены.</p>
          <p className="mt-2 text-xs">
            Информация носит справочный характер. Перед полетом уточняйте актуальные правила на сайте авиакомпании.
          </p>
        </div>
      </div>

      {showContactForm && <ContactForm onClose={() => setShowContactForm(false)} />}
    </footer>
  );
};

export default Footer;
