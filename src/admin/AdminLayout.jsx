import React, { useState, useEffect } from 'react'
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAdmin } from '../context/AdminContext'
import GlobalSearch from './components/GlobalSearch'
import NotificationBell from './components/NotificationBell'

const NAV = [
    {
        to: '/admin', label: 'Overview',
        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8"/><rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8"/><rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8"/><rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8"/></svg>,
    },
    {
        to: '/admin/orders', label: 'Orders',
        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M9 12h6M9 16h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>,
    },
    {
        to: '/admin/inventory', label: 'Products',
        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>,
    },
    {
        to: '/admin/customers', label: 'Customers',
        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.8"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>,
    },
    {
        to: '/admin/blogs', label: 'Content',
        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>,
    },
]

/* ── Breadcrumb map ── */
const BREADCRUMBS = {
    '/admin':            'Overview',
    '/admin/orders':     'Orders',
    '/admin/inventory':  'Products',
    '/admin/customers':  'Customers',
    '/admin/blogs':      'Content',
}

const getBreadcrumb = (pathname) => {
    // /admin/orders/:ref
    const orderDetailMatch = pathname.match(/^\/admin\/orders\/(.+)$/)
    if (orderDetailMatch) return { parent: { label: 'Orders', to: '/admin/orders' }, current: orderDetailMatch[1] }
    const label = BREADCRUMBS[pathname]
    if (label) return { current: label }
    return { current: 'Admin' }
}

const AdminLayout = () => {
    const { adminUser, adminLogout } = useAdmin()
    const navigate = useNavigate()
    const location = useLocation()
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [searchOpen, setSearchOpen] = useState(false)

    const handleLogout = () => { adminLogout(); navigate('/admin/login') }

    const breadcrumb = getBreadcrumb(location.pathname)

    /* ── ⌘K / Ctrl+K shortcut ── */
    useEffect(() => {
        const handler = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault()
                setSearchOpen(o => !o)
            }
        }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [])

    return (
        <div className="min-h-screen bg-[#F6F6F6] flex">
            {/* ── Sidebar ── */}
            <aside className={`${sidebarOpen ? 'w-[240px]' : 'w-[68px]'} bg-black flex flex-col transition-all duration-300 flex-shrink-0 min-h-screen`}>
                {/* Logo */}
                <div className="flex items-center gap-3 px-4 py-5 border-b border-solid border-[#2a2a2a]">
                    <div className="w-[36px] h-[36px] rounded-full bg-orange flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-Helvetica font-normal text-[16px]">L</span>
                    </div>
                    {sidebarOpen && (
                        <div>
                            <p className="text-white font-Helvetica font-normal text-[16px] leading-tight">Lux</p>
                            <p className="text-[#A3A3A3] text-[11px]">Admin Panel</p>
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
                                `flex items-center gap-3 px-4 py-[10px] mx-2 rounded-full mb-1 transition-colors text-[14px] font-medium ` +
                                (isActive ? 'bg-orange text-white' : 'text-[#A3A3A3] hover:bg-[#2a2a2a] hover:text-white')
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
                                <span className="text-white font-medium text-[14px]">{adminUser?.name?.charAt(0) || 'A'}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-white text-[13px] font-medium truncate">{adminUser?.name}</p>
                                <p className="text-[#A3A3A3] text-[11px] truncate">{adminUser?.email}</p>
                            </div>
                            <button onClick={handleLogout} className="text-[#A3A3A3] hover:text-white transition-colors flex-shrink-0" title="Logout">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            </button>
                        </div>
                    ) : (
                        <button onClick={handleLogout} className="text-[#A3A3A3] hover:text-white transition-colors w-full flex justify-center" title="Logout">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </button>
                    )}
                </div>
            </aside>

            {/* ── Main ── */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Topbar: [hamburger] [breadcrumb] [flex-1] [search] [notif] [divider] [view store] [user] */}
                <header className="bg-white border-b border-solid border-[#E5E5E5] px-6 py-4 flex items-center gap-3 sticky top-0 z-[50]">
                    {/* Hamburger */}
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray hover:text-black transition-colors flex-shrink-0">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                    </button>

                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-[13px]">
                        <span className="text-gray">Admin</span>
                        <span className="text-gray">/</span>
                        {breadcrumb.parent ? (
                            <>
                                <NavLink to={breadcrumb.parent.to} className="text-gray hover:text-black transition-colors">{breadcrumb.parent.label}</NavLink>
                                <span className="text-gray">/</span>
                                <span className="font-medium text-black">{breadcrumb.current}</span>
                            </>
                        ) : (
                            <span className="font-medium text-black">{breadcrumb.current}</span>
                        )}
                    </div>

                    {/* Spacer */}
                    <div className="flex-1" />

                    {/* Search button */}
                    <button
                        onClick={() => setSearchOpen(true)}
                        className="flex items-center gap-2 px-3 py-[6px] rounded-full border border-solid border-[#E5E5E5] text-gray hover:border-orange hover:text-black transition-colors text-[12px]"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.8"/>
                            <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                        </svg>
                        <span className="hidden sm:inline">Search</span>
                        <kbd className="hidden sm:inline text-[10px] bg-[#F6F6F6] border border-solid border-[#E5E5E5] rounded-[4px] px-1">⌘K</kbd>
                    </button>

                    {/* Notification Bell */}
                    <NotificationBell />

                    {/* Divider */}
                    <div className="w-[1px] h-[16px] bg-[#E5E5E5] flex-shrink-0"></div>

                    {/* View Store */}
                    <NavLink to="/" target="_blank" className="text-[12px] text-gray hover:text-black transition-colors flex items-center gap-1 flex-shrink-0">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        View Store
                    </NavLink>

                    {/* User */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <div className="w-[8px] h-[8px] rounded-full bg-green-500"></div>
                        <span className="text-[13px] text-gray font-medium hidden sm:inline">{adminUser?.name}</span>
                    </div>
                </header>

                <main className="flex-1 p-6 overflow-y-auto">
                    <Outlet />
                </main>
            </div>

            {/* Global Search Overlay */}
            <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
        </div>
    )
}

export default AdminLayout
