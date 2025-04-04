import React, { useState } from 'react';
import { login, register } from '../api/auth'; // Импорт функций для API запросов

/**
 * Модальное окно для входа и регистрации пользователей.
 * @param {function} onClose — вызывается при закрытии модального окна
 * @param {function} onSuccess — вызывается после успешного входа
 */
const AuthModal = ({ onClose, onSuccess }) => {
    // Состояние режима — "login" или "register"
    const [mode, setMode] = useState('login');
    
    // Состояния для хранения значений полей формы
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    
    // Сообщение об ошибке или успехе
    const [message, setMessage] = useState('');

    /**
     * Обработчик отправки формы
     */
    const handleSubmit = async (e) => {
        e.preventDefault(); // Предотвращаем перезагрузку страницы
        
        try {
            // Выбираем функцию — login или register
            const action = mode === 'login' ? login : register;
            
            // Выполняем запрос на сервер
            const result = await action(username, password);
            
            // Если сервер вернул сообщение — сохраняем его
            if (result.message) {
                setMessage(result.message);
            }
            
            // Если вход выполнен успешно — вызываем onSuccess и закрываем модалку
            if (mode === 'login' && result.message === 'Вход выполнен успешно') {
                onSuccess(); // Родитель узнаёт, что пользователь авторизован
                onClose();   // Закрываем модалку
            }
        } catch (err) {
            console.error('Ошибка аутентификации:', err);
            setMessage('Произошла ошибка при соединении с сервером.');
        }
    };

    return (
        <div className="modal-backdrop">
            <div className="modal">
                <h2>{mode === 'login' ? 'Вход' : 'Регистрация'}</h2>

                {/* Форма входа или регистрации */}
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Имя пользователя"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />

                    <input
                        type="password"
                        placeholder="Пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button type="submit">
                        {mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
                    </button>
                </form>

                {/* Сообщение об ошибке или успехе */}
                {message && <p className="message">{message}</p>}

                {/* Кнопка переключения между режимами */}
                <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
                    {mode === 'login' 
                        ? 'Нет аккаунта? Зарегистрируйтесь' 
                        : 'Уже есть аккаунт? Войти'}
                </button>

                {/* Кнопка закрытия */}
                <button onClick={onClose}>Закрыть</button>
            </div>
        </div>
    );
};

export default AuthModal;