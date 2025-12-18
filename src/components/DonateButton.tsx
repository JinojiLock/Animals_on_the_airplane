import React, { useState } from 'react';

const DonateButton: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2 z-40"
      >
        <span className="text-xl">❤️</span>
        <span className="font-semibold">Поддержать проект</span>
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center">
              <span className="text-6xl mb-4 block">❤️</span>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Поддержать проект
              </h2>
              <p className="text-gray-600 mb-6">
                Ваша поддержка помогает развивать проект и добавлять новые авиакомпании
              </p>

              {/* Здесь будет интеграция с платежной системой */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-4">
                <p className="text-gray-700 mb-4">
                  💳 Скоро здесь появятся способы поддержки:
                </p>
                <div className="space-y-2 text-left text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <span>💰</span>
                    <span>YooMoney / ЮMoney</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>💳</span>
                    <span>Банковская карта</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>₿</span>
                    <span>Криптовалюта</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>☕</span>
                    <span>Buy Me a Coffee</span>
                  </div>
                </div>
              </div>

              {/* Временный блок */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  🚧 Платежная система в разработке.
                  <br />
                  Пока можете поддержать звездочкой на GitHub! ⭐
                </p>
              </div>

              {/* 
                ЗАГОТОВКА ДЛЯ БУДУЩЕЙ ИНТЕГРАЦИИ:
                
                YooMoney:
                <iframe src="https://yoomoney.ru/quickpay/button-widget?..." />
                
                Stripe:
                <script src="https://js.stripe.com/v3/"></script>
                
                PayPal:
                <div id="paypal-button-container"></div>
                
                Crypto (TON):
                <ton-connect-button />
                
                Boosty / Patreon:
                <a href="https://boosty.to/..." />
              */}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DonateButton;
