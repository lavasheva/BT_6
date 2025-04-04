import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AuthModal from './components/AuthModal';
import { logout, checkAuth } from './api/auth';
import { toggleTheme } from './features/themeSlice';

/**
 * Основной компонент приложения
 */
const App = () => {
    // Состояния компонента
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [data, setData] = useState(null);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // Redux состояния
    const theme = useSelector((state) => state.theme.value);
    const dispatch = useDispatch();

    // Проверка авторизации при монтировании
    useEffect(() => {
        const verifyAuth = async () => {
            try {
                const res = await checkAuth();
                setIsAuthenticated(!!res?.user);
                setShowModal(!res?.user);
            } catch (error) {
                console.error('Auth check failed:', error);
                setShowModal(true);
            } finally {
                setIsLoading(false);
            }
        };

        verifyAuth();
    }, []);

    // Обработка выхода из системы
    const handleLogout = async () => {
        try {
            await logout();
            setIsAuthenticated(false);
            setShowModal(true);
            setData(null);
            setMessage('Вы успешно вышли из системы');
        } catch (error) {
            console.error('Logout failed:', error);
            setMessage('Ошибка при выходе из системы');
        }
    };

    // Получение данных с сервера
    const fetchData = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('http://localhost:3000/data', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

            const result = await res.json();
            setData(result.data);
            setMessage(`Источник: ${result.source}`);
        } catch (error) {
            console.error('Fetch data error:', error);
            setMessage('Ошибка при получении данных');
            setData(null);
        } finally {
            setIsLoading(false);
        }
    };

    // Обработка переключения темы
    const handleToggleTheme = () => {
        dispatch(toggleTheme());
    };

    if (isLoading) {
        return <div className={theme}>Загрузка...</div>;
    }

    return (
        <div className={`app ${theme}`}>
            <header className="app-header">
                <h1>Личный кабинет</h1>
                <div className="controls">
                    <button 
                        className="theme-toggle"
                        onClick={handleToggleTheme}
                    >
                        Переключить тему
                    </button>
                    {isAuthenticated && (
                        <button 
                            className="logout-btn"
                            onClick={handleLogout}
                        >
                            Выйти
                        </button>
                    )}
                </div>
            </header>

            <main className="app-content">
                {isAuthenticated ? (
                    <>
                        <section className="welcome-section">
                            <p>Добро пожаловать!</p>
                            <button 
                                className="fetch-btn"
                                onClick={fetchData}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Загрузка...' : 'Получить данные'}
                            </button>
                        </section>

                        {message && <p className="message">{message}</p>}
                        
                        {data && (
                            <pre className="data-display">
                                {JSON.stringify(data, null, 2)}
                            </pre>
                        )}
                    </>
                ) : (
                    <p className="auth-prompt">Пожалуйста, авторизуйтесь</p>
                )}
            </main>

            {showModal && (
                <AuthModal
                    onClose={() => setShowModal(false)}
                    onSuccess={() => {
                        setIsAuthenticated(true);
                        setShowModal(false);
                    }}
                />
            )}
        </div>
    );
};

export default App;