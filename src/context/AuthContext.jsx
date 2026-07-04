import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

async function hashPassword(password) {
  const encoded = new TextEncoder().encode(password);
  const buffer = await crypto.subtle.digest('SHA-256', encoded);
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/** Build a session-safe user object containing only non-sensitive fields. */
const toSessionUser = (record) => ({
  id: record.id,
  name: record.name,
  email: record.email,
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = sessionStorage.getItem('marine_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (email, password) => {
    const users = JSON.parse(localStorage.getItem('marine_users') || '[]');
    const hash = await hashPassword(password);
    const found = users.find((u) => u.email === email && u.passwordHash === hash);
    if (!found) throw new Error('Invalid email or password.');
    const sessionUser = toSessionUser(found);
    setUser(sessionUser);
    sessionStorage.setItem('marine_user', JSON.stringify(sessionUser));
    return sessionUser;
  };

  const register = async (name, email, password) => {
    const users = JSON.parse(localStorage.getItem('marine_users') || '[]');
    if (users.find((u) => u.email === email)) {
      throw new Error('An account with this email already exists.');
    }
    const passwordHash = await hashPassword(password);
    const newUser = { id: Date.now(), name, email, passwordHash };
    users.push(newUser);
    localStorage.setItem('marine_users', JSON.stringify(users));
    const sessionUser = toSessionUser(newUser);
    setUser(sessionUser);
    sessionStorage.setItem('marine_user', JSON.stringify(sessionUser));
    return sessionUser;
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('marine_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}
