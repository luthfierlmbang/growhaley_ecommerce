import React, { useState, useMemo, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdmin } from '../../context/AdminContext'

/* ── Generate notifications from orders + inventory ── */
const buildNotifications = (orders, inventory) => {
    const notifs = []

    // New orders (Processing)
    orders
        .filter(o => o.status === 'Processing')
        .slice(0, 5)
        .forEach(o => {
            notifs.push({
                id: `order-new-${o.ref}`,
                type: 'new_order',
                title: 'New Order Received',
                desc: `${o.customer} placed order ${o.ref} for $${o.total.toFixed(2)}`,
                timestamp: new Date(o.date),
                link: '/admin/orders',
                read: false,
            })
        })

    // Shipped orders
    orders
        .filter(o => o.status === 'Shipped')
        .slice(0, 3)
        .forEach(o => {
            notifs.push({
                id: `order-shipped-${o.ref}`,
                type: 'shipped',
                title: 'Order Shipped',
                desc: `${o.ref} for ${o.customer} has been shipped`,
                timestamp: new Date(o.date),
                link: '/admin/orders',
                read: false,
            })
        })

    // Completed orders
    orders
        .filter(o => o.status === 'Completed')
        .slice(0, 2)
        .forEach(o => {
            notifs.push({
                id: `order-done-${o.ref}`,
                type: 'completed',
                title: 'Order Completed',
                desc: `${o.ref} for ${o.customer} has been delivered`,
                timestamp: new Date(o.date),
                link: '/admin/orders',
                read: true,
            })
        })

    // Low stock
    inventory
        .filter(p => p.stock > 0 && p.stock <= 5)
        .forEach(p => {
            notifs.push({
                id: `stock-low-${p.id}`,
                type: 'low_stock',
                title: 'Low Stock Alert',
                desc: `${p.name} has only ${p.stock} unit${p.stock !== 1 ? 's' : ''} left`,
                timestamp: new Date(),
                link: '/admin/inventory',
                read: false,
            })
        })

    // Out of stock
    inventory
        .filter(p => p.stock === 0)
        .forEach(p => {
            notifs.push({
                id: `stock-out-${p.id}`,
                type: 'out_of_stock',
                title: 'Out of Stock',
                desc: `${p.name} is out of stock`,
                timestamp: new Date(),
                link: '/admin/inventory',
                read: false,
            })
        })

    return notifs.sort((a, b) => b.timestamp - a.timestamp)
}

/* ── Relative time ── */
const relTime = (date) => {
    const diff = Math.floor((Date.now() - new Date(date)) / 1000)
    if (diff < 60) return 'just now'
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return `${Math.floor(diff / 86400)}d ago`
}

/* ── Icon per type ── */
const NotifIcon = ({ type }) => {
    const cfg = {
        new_order:    { bg: '#FFF7ED', color: '#EA580C', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg> },
        shipped:      { bg: '#EFF6FF', color: '#2563EB', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><circle cx="5.5" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="1.8"/><circle cx="18.5" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="1.8"/></svg> },
        completed:    { bg: '#F0FDF4', color: '#16A34A', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg> },
        low_stock:    { bg: '#FFFBEB', color: '#D97706', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg> },
        out_of_stock: { bg: '#FEF2F2', color: '#DC2626', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8"/><path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg> },
    }
    const c = cfg[type] || cfg.new_order
    return (
        <div className="w-[32px] h-[32px] rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: c.bg, color: c.color }}>
            {c.icon}
        </div>
    )
}

const NotificationBell = () => {
    const { orders, inventory } = useAdmin()
    const navigate = useNavigate()
    const [open, setOpen] = useState(false)
    const [readIds, setReadIds] = useState(new Set())
    const [filter, setFilter] = useState('all') // 'all' | 'unread'
    const drawerRef = useRef(null)

    const allNotifs = useMemo(() => buildNotifications(orders, inventory), [orders, inventory])

    const notifs = allNotifs.map(n => ({ ...n, read: n.read || readIds.has(n.id) }))
    const unreadCount = notifs.filter(n => !n.read).length
    const displayed = filter === 'unread' ? notifs.filter(n => !n.read) : notifs

    const markRead = (id) => setReadIds(prev => new Set([...prev, id]))
    const markAllRead = () => setReadIds(new Set(allNotifs.map(n => n.id)))

    /* ── Close on outside click ── */
    useEffect(() => {
        const handler = (e) => {
            if (drawerRef.current && !drawerRef.current.contains(e.target)) setOpen(false)
        }
        if (open) document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [open])

    return (
        <>
            {/* Bell button */}
            <button
                onClick={() => setOpen(o => !o)}
                className="relative w-[36px] h-[36px] rounded-full flex items-center justify-center hover:bg-[#F6F6F6] transition-colors"
                title="Notifications"
            >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke="#525252" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {unreadCount > 0 && (
                    <span
                        className="absolute -top-[2px] -right-[2px] min-w-[16px] h-[16px] rounded-full flex items-center justify-center text-white text-[9px] font-bold px-[3px]"
                        style={{ backgroundColor: '#DC2626' }}
                    >
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Backdrop */}
            {open && (
                <div
                    className="fixed inset-0 z-[300]"
                    style={{ backgroundColor: 'rgba(23,23,23,0.2)', backdropFilter: 'blur(2px)' }}
                    onClick={() => setOpen(false)}
                />
            )}

            {/* Drawer */}
            <div
                ref={drawerRef}
                className="fixed top-0 right-0 h-full w-full max-w-[380px] bg-white shadow-2xl z-[400] flex flex-col transition-transform duration-300"
                style={{ transform: open ? 'translateX(0)' : 'translateX(100%)' }}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-solid border-[#E5E5E5] flex-shrink-0">
                    <div>
                        <h4 className="font-Helvetica font-normal text-[18px] text-black">Notifications</h4>
                        {unreadCount > 0 && <p className="text-[12px] text-gray mt-[2px]">{unreadCount} unread</p>}
                    </div>
                    <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                            <button onClick={markAllRead} className="text-[12px] text-orange font-medium hover:underline">
                                Mark all read
                            </button>
                        )}
                        <button onClick={() => setOpen(false)} className="text-gray hover:text-black transition-colors ml-2">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                        </button>
                    </div>
                </div>

                {/* Filter tabs */}
                <div className="flex items-center gap-1 px-5 py-2 border-b border-solid border-[#E5E5E5] flex-shrink-0">
                    {['all', 'unread'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className="px-3 py-[5px] rounded-full text-[12px] font-medium transition-colors capitalize"
                            style={{
                                backgroundColor: filter === f ? '#171717' : 'transparent',
                                color: filter === f ? 'white' : '#525252',
                            }}
                        >
                            {f === 'all' ? `All (${notifs.length})` : `Unread (${unreadCount})`}
                        </button>
                    ))}
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto">
                    {displayed.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-6">
                            <div className="w-[48px] h-[48px] rounded-full bg-[#F6F6F6] flex items-center justify-center">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                                    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke="#A3A3A3" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <p className="text-[13px] text-gray">No {filter === 'unread' ? 'unread ' : ''}notifications</p>
                        </div>
                    )}

                    {displayed.map(n => (
                        <div
                            key={n.id}
                            className="flex items-start gap-3 px-5 py-4 border-b border-solid border-[#F5F5F5] hover:bg-[#FAFAFA] transition-colors cursor-pointer"
                            style={{ backgroundColor: n.read ? 'transparent' : '#FFFBF8' }}
                            onClick={() => { markRead(n.id); navigate(n.link); setOpen(false) }}
                        >
                            <NotifIcon type={n.type} />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                    <p className="text-[13px] font-medium text-black leading-snug">{n.title}</p>
                                    {!n.read && (
                                        <span className="w-[7px] h-[7px] rounded-full flex-shrink-0 mt-[4px]" style={{ backgroundColor: '#E16F3D' }}></span>
                                    )}
                                </div>
                                <p className="text-[12px] text-gray mt-[2px] leading-snug">{n.desc}</p>
                                <p className="text-[11px] text-gray mt-1 opacity-70">{relTime(n.timestamp)}</p>
                            </div>
                            {!n.read && (
                                <button
                                    onClick={e => { e.stopPropagation(); markRead(n.id) }}
                                    className="text-[10px] text-gray hover:text-orange transition-colors flex-shrink-0 mt-[2px]"
                                    title="Mark as read"
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default NotificationBell
