const API_BASE = 'http://localhost:3000'; // адрес бэкенда

/**
 * Отправка запроса на регистрацию пользователя
 */
export async function register(username, password) {
    const res = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        credentials: 'include', // Важно: сохраняет куки между запросами
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });
    return await res.json(); // возвращаем ответ сервера
}

/**
 * Отправка запроса на вход
 */
export async function login(username, password) {
    const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });
    return await res.json();
}

/**
 * Выход из системы (удаление сессии)
 */
export async function logout() {
    const res = await fetch(`${API_BASE}/logout`, {
        method: 'POST',
        credentials: 'include'
    });
    return await res.json();
}

/**
 * Получение информации о текущем пользователе (если есть сессия)
 */
export async function fetchProfile() {
    const res = await fetch(`${API_BASE}/profile`, {
        method: 'GET',
        credentials: 'include'
    });
    return await res.json();
}


/** 
* Проверка текущей сессии (авторизован ли пользователь) 
*/ 
export async function checkAuth() { 
    const res = await fetch(`${API_BASE}/profile`, { 
    method: 'GET', 
    credentials: 'include' 
    }); 
    return await res.json(); 
    }