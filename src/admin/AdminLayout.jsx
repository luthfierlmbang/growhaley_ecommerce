import React, { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAdmin } from '../context/AdminContext'

const NAV = [
    {
        to: '/admin',
        label: 'Dashboard',
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8" />
                <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8" />
                <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8" />
                <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8" />
            </svg>
        ),
    },
    {
        to: '/admin/orders',
        label: 'Orders',
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M9 12h6M9 16h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
        ),
    },
    {
        to: '/admin/inventory',
        label: 'Inventory',
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M12 12v4M10 14h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
        ),
    },
    {
        to: '/admin/customers',
        label: 'Customers',
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.8" />
                <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
        ),
    },
    {
        to: '/admin/blogs',
        label: 'Blog Posts',
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
        ),
    },
]

const AdminLayout = () => {
    const { adminUser, adminLogout } = useAdmin()
    const navigate = useNavigate()
    const [sidebarOpen, setSidebarOpen] = useState(true)

    const handleLogout = () => {
        adminLogout()
        navigate('/admin')
    }

    return (
        <div className="min-h-screen bg-[#F8F8F8] flex">
            {/* ── Sidebar ── */}
            <aside className={`${sidebarOpen ? 'w-[240px]' : 'w-[64px]'} bg-[#171717] flex flex-col transition-all duration-300 flex-shrink-0 min-h-screen`}>
                {/* Logo */}
                <div className="flex items-center gap-3 px-4 py-5 border-b border-solid border-[#2a2a2a]">
                    <div className="w-[36px] h-[36px] rounded-[8px] bg-orange flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-[14px]">L</span>
                    </div>
                    {sidebarOpen && (
                        <div>
                            <p className="text-white font-Helvetica font-normal text-[16px] leading-tight">Lux Admin</p>
                            <p className="text-[#A3A3A3] text-[11px]">Dashboard</p>
                        </div>
                    )}
                </div>

                {/* Nav */}
                <nav className="flex-1 py-4 overflow-y-auto">
                    {NAV.map(item => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.to === '/admin'}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 mx-2 rounded-[8px] mb-1 transition-colors text-[14px] font-medium ` +
                                (isActive
                                    ? 'bg-orange text-white'
                                    : 'text-[#A3A3A3] hover:bg-[#2a2a2a] hover:text-white')
                            }
                        >
                            <span className="flex-shrink-0">{item.icon}</span>
                            {sidebarOpen && <span>{item.label}</span>}
                        </NavLink>
                    ))}
                </nav>

                {/* User */}
                <div className="border-t border-solid border-[#2a2a2a] p-4">
                    {sidebarOpen ? (
                        <div className="flex items-center gap-3">
                            <div className="w-[36px] h-[36px] rounded-full bg-orange flex items-center justify-center flex-shrink-0">
                                <span className="text-white font-medium text-[14px]">
                                    {adminUser?.name?.charAt(0) || 'A'}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-white text-[13px] font-medium truncate">{adminUser?.name}</p>
                                <p className="text-[#A3A3A3] text-[11px] truncate">{adminUser?.email}</p>
                            </div>
                            <button onClick={handleLogout} className="text-[#A3A3A3] hover:text-white transition-colors flex-shrink-0" title="Logout">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>
                    ) : (
                        <button onClick={handleLogout} className="text-[#A3A3A3] hover:text-white transition-colors w-full flex justify-center" title="Logout">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    )}
                </div>
            </aside>

            {/* ── Main ── */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Topbar */}
                <header className="bg-white border-b border-solid border-[#E5E5E5] px-6 py-4 flex items-center gap-4 sticky top-0 z-[50]">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="text-[#525252] hover:text-black transition-colors"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                        </svg>
                    </button>
                    <div className="flex-1" />
                    <div className="flex items-center gap-3">
                        <div className="w-[8px] h-[8px] rounded-full bg-green-500"></div>
                        <span className="text-[13px] text-gray font-medium">{adminUser?.name}</span>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 p-6 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default AdminLayout
