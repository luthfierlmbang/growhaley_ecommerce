import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAdmin } from '../context/AdminContext'

/**
 * Protects admin routes — redirects to /admin/login if not authenticated.
 */
const AdminGuard = ({ children }) => {
    const { isAdminLoggedIn } = useAdmin()
    if (!isAdminLoggedIn) return <Navigate to="/admin/login" replace />
    return children
}

export default AdminGuard
