
import React, { useState } from 'react';

function Account() {
    // Simulate user login state with localStorage
    const [user, setUser] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('user') || 'null');
        } catch {
            return null;
        }
    });
    const [username, setUsername] = useState('');

    const login = (e) => {
        e.preventDefault();
        if (username.trim()) {
            const userObj = { name: username.trim() };
            setUser(userObj);
            localStorage.setItem('user', JSON.stringify(userObj));
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <section id="view-account" className="view">
            <h1>Mi Cuenta</h1>
            {user ? (
                <div style={{ marginTop: 24 }}>
                    <div style={{ fontSize: 18, marginBottom: 12 }}>Bienvenido, <b>{user.name}</b></div>
                    <button onClick={logout} style={{ background: '#c00', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', cursor: 'pointer' }}>Cerrar sesión</button>
                </div>
            ) : (
                <form onSubmit={login} style={{ marginTop: 24 }}>
                    <label htmlFor="username">Nombre de usuario:</label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        style={{ marginLeft: 8, padding: 6, borderRadius: 4, border: '1px solid #ccc' }}
                    />
                    <button type="submit" style={{ marginLeft: 12, background: '#c7a16a', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 14px', cursor: 'pointer' }}>Iniciar sesión</button>
                </form>
            )}
        </section>
    );
}

export default Account;
