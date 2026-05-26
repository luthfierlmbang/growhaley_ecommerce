import React, { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

const CREDENTIALS = { email: 'admin@lux.com', password: 'lux2025', name: 'Admin Lux' }

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    const login = (email, password) => {
        if (email === CREDENTIALS.email && password === CREDENTIALS.password) {
            const userData = { email: CREDENTIALS.email, name: CREDENTIALS.name }
            setUser(userData)
            setIsLoggedIn(true)
            return { success: true, user: userData }
        }
        return { success: false, error: 'Invalid email or password.' }
    }

    const logout = () => {
        setUser(null)
        setIsLoggedIn(false)
    }

    return (
        <AuthContext.Provider value={{ user, isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used within AuthProvider')
    return ctx
}

export default AuthContext
