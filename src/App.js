import './App.css';
import React, { useState, useEffect } from 'react';
import { useTelegram } from './hooks/useTelegram';



const App = () => {

  const { tg } = useTelegram()


  useEffect(() =>{
    tg.ready()
  }, [])

  const [menuVisible, setMenuVisible] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [confirmationModalVisible, setConfirmationModalVisible] = useState(false);
  const [orderCreatedModalVisible, setOrderCreatedModalVisible] = useState(false);
  const [rubValue, setRubValue] = useState('');
  const [lztValue, setLztValue] = useState('');
  const conversionRate = 1.2;

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const handleRubInput = (event) => {
    const value = parseFloat(event.target.value) || null;
    setRubValue(value);
    setLztValue((value * conversionRate).toFixed(2));
  };

  const handleLztInput = (event) => {
    const value = parseFloat(event.target.value) || 0;
    setLztValue(value);
    setRubValue((value / conversionRate).toFixed(2));
  };

  const updateButtonState = () => {
    return parseFloat(rubValue) > 0 || parseFloat(lztValue) > 0;
  };

  const closeModal = () => {
    setModalContent(null);
  };

  const ask = () => {
    setModalContent({
      title: 'Информация',
      message: 'Каждый продавец выставляет свой курс по отношению к выбранной валюте. Учитывайте, что он может быть разным у каждого продавца. Воспользуйтесь калькулятором, чтобы понимать сколько средств вы получите в итоге',
    });
  };

  const report = () => {
    setModalContent({
      title: 'Жалоба подана',
      message: 'Администрация примет меры в ближайшее время.',
    });
  };

  const confirmSwap = () => {
    setConfirmationModalVisible(true);
  };

  const proceedSwap = () => {
    setConfirmationModalVisible(false);
    setOrderCreatedModalVisible(true);
    setTimeout(() => {
      if (typeof Telegram !== 'undefined' && Telegram.WebApp) {
        Telegram.WebApp.close();
      } else {
        console.error('Telegram WebApp API не доступен');
      }
    }, 5000);
  };

  const goToBot = () => {
    window.location.href = "https://t.me/p2plolz_bot";
  };

  const closeConfirmation = () => {
    setConfirmationModalVisible(false);
  };

  return (
    <div className="App">
      <div className="top-bar">
        <div className="user-info">
          <div className="avatar">F</div>
          <div>
            <div className="username">Fantep</div>
            <div className="user-rating">Рейтинг: 65%</div>
          </div>
        </div>
        <div className="menu-icon" onClick={toggleMenu}>⋮</div>
        {menuVisible && (
          <div className="menu-dropdown" id="menu-dropdown">
            <button onClick={ask}>Информация</button>
            <button onClick={report}>Пожаловаться</button>
          </div>
        )}
      </div>

      {modalContent && (
        <div className="modal-overlay" id="modal-overlay">
          <div className="modal">
            <h2>{modalContent.title}</h2>
            <p>{modalContent.message}</p>
            <button className="close-button" onClick={closeModal}>×</button>
          </div>
        </div>
      )}

      <div className="content">
        <div className="info-box">
          <h2>Условия сделки</h2>
          <p>Метод оплаты: СберБанк</p>
          <p>Доступная сумма: 100000 руб</p>
          <p>Минимальная сумма: 1000 руб</p>
          <div className="highlight-text">Курс: 1 LZT RUB = 1.2 руб</div>
        </div>

        {orderCreatedModalVisible && (
          <div className="modal-overlay" id="order-created-modal">
            <div className="modal">
              <h2>Ордер создан</h2>
              <p>Теперь перейдите в бота для дальнейших инструкций.</p>
              <button className="modal-button-bot" onClick={goToBot}>Перейти в бота</button>
            </div>
          </div>
        )}

        <div className="swap-container">
          <div className="swap-input-container">
            <label className="swap-input-label" htmlFor="rub-input">Я отдам:</label>
            <div className="swap-input-wrapper">
              <input
                type="tel"
                inputMode='numeric'
                id="rub-input"
                className="swap-input"
                value={rubValue}
                onChange={handleRubInput}
                placeholder="Введите сумму в RUB"
              />
              <div className="currency-container">
                <img src="ruble.png" alt="RUB" className="currency-image" />
              </div>
            </div>
          </div>

          <div className="swap-input-container">
            <label className="swap-input-label" htmlFor="lzt-input">Я получу:</label>
            <div className="swap-input-wrapper">
              <input
                type="tel"
                inputMode='numeric'
                id="lzt-input"
                className="swap-input"
                value={lztValue}
                onChange={handleLztInput}
                placeholder="Введите сумму в LZT RUB"
              />
              <div className="currency-container">
                <img src="lztrub.png" alt="LZT RUB" className="currency-image" />
              </div>
            </div>
          </div>

          <div className="swap-result" id="swap-result">Вы получите на баланс: {lztValue} LZT RUB</div>

          <button className="swap-button" id="confirm-button" onClick={confirmSwap} disabled={!updateButtonState()}>
            Подтвердить
          </button>
        </div>

        {confirmationModalVisible && (
          <div className="modal-overlay" id="confirmation-modal">
            <div className="modal">
              <h2>Подтверждение обмена</h2>
              <div className="amount-container">
                <p>Вы отдаёте</p>
                <div className="amount-box">
                  <span id="confirm-give-amount">{rubValue} RUB</span>
                  <img src="ruble.png" alt="RUB" className="currency-icon" />
                </div>
              </div>

              <div className="amount-container">
                <p>Вы получаете</p>
                <div className="amount-box">
                  <span id="confirm-receive-amount">{lztValue} LZT RUB</span>
                  <img src="lztrub.png" alt="LZT RUB" className="currency-icon" />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                <button className="button confirm" onClick={proceedSwap}>Перейти</button>
                <button className="button cancel" onClick={closeConfirmation}>Отмена</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


export default App;
