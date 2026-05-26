import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAdmin } from '../../context/AdminContext'

/* ── Status config ── */
const SC = {
    Completed:  { bg: '#F0FDF4', text: '#16A34A', border: '#BBF7D0' },
    Processing: { bg: '#FFF7ED', text: '#EA580C', border: '#FED7AA' },
    Shipped:    { bg: '#EFF6FF', text: '#2563EB', border: '#BFDBFE' },
    Cancelled:  { bg: '#FEF2F2', text: '#DC2626', border: '#FECACA' },
}

/* ── Generate 30-day revenue data ── */
const genRevenueData = (orders) => {
    const days = 30
    const result = []
    for (let i = days - 1; i >= 0; i--) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        const dayStr = d.toDateString()
        const rev = orders
            .filter(o => o.status !== 'Cancelled' && new Date(o.date).toDateString() === dayStr)
            .reduce((s, o) => s + o.total, 0)
        result.push({ day: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), rev, date: d })
    }
    return result
}

/* ── Mini Bar Chart (pure CSS) ── */
const RevenueChart = ({ data, range }) => {
    const slice = range === 7 ? data.slice(-7) : data
    const max = Math.max(...slice.map(d => d.rev), 1)
    return (
        <div className="flex items-end gap-[3px] h-[80px] w-full">
            {slice.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded-[4px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                        {d.day}: ${d.rev.toFixed(0)}
                    </div>
                    <div
                        className="w-full rounded-t-[3px] transition-all duration-300"
                        style={{
                            height: `${Math.max((d.rev / max) * 100, d.rev > 0 ? 8 : 2)}%`,
                            backgroundColor: d.rev > 0 ? '#E16F3D' : '#E5E5E5',
                        }}
                    ></div>
                </div>
            ))}
        </div>
    )
}

/* ── Order Funnel ── */
const OrderFunnel = ({ orders }) => {
    const stages = [
        { label: 'Processing', count: orders.filter(o => o.status === 'Processing').length, color: '#EA580C' },
        { label: 'Shipped',    count: orders.filter(o => o.status === 'Shipped').length,    color: '#2563EB' },
        { label: 'Completed',  count: orders.filter(o => o.status === 'Completed').length,  color: '#16A34A' },
        { label: 'Cancelled',  count: orders.filter(o => o.status === 'Cancelled').length,  color: '#DC2626' },
    ]
    const total = orders.length || 1
    return (
        <div className="flex flex-col gap-3">
            {stages.map(s => (
                <div key={s.label}>
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-[12px] font-medium" style={{ color: s.color }}>{s.label}</span>
                        <span className="text-[12px] text-gray">{s.count} ({Math.round((s.count / total) * 100)}%)</span>
                    </div>
                    <div className="h-[6px] bg-[#F5F5F5] rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(s.count / total) * 100}%`, backgroundColor: s.color }}></div>
                    </div>
                </div>
            ))}
        </div>
    )
}

/* ── Stat Card ── */
const StatCard = ({ label, value, sub, delta, color = '#E16F3D', icon, onClick }) => (
    <div onClick={onClick} className={`bg-white border border-solid border-[#E5E5E5] rounded-[24px] px-5 py-5 flex items-start gap-4 ${onClick ? 'cursor-pointer hover:border-orange transition-colors' : ''}`}>
        <div className="w-[44px] h-[44px] rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: color + '15' }}>
            <span style={{ color }}>{icon}</span>
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-gray text-[12px] mb-1">{label}</p>
            <h3 className="font-Helvetica font-normal text-[26px] text-black leading-tight">{value}</h3>
            {sub && <p className="text-[11px] text-gray mt-1">{sub}</p>}
        </div>
        {delta !== undefined && (
            <span className={`text-[11px] font-medium px-2 py-[3px] rounded-full flex-shrink-0 ` + (delta >= 0 ? 'bg-[#F0FDF4] text-[#16A34A]' : 'bg-[#FEF2F2] text-[#DC2626]')}>
                {delta >= 0 ? '↑' : '↓'} {Math.abs(delta)}%
            </span>
        )}
    </div>
)

/* ── Action Item (needs attention) ── */
const ActionItem = ({ icon, title, desc, cta, to, color = '#EA580C' }) => (
    <NavLink to={to} className="flex items-center gap-3 p-3 rounded-[12px] border border-solid border-[#E5E5E5] hover:border-orange transition-colors group">
        <div className="w-[36px] h-[36px] rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: color + '15' }}>
            <span style={{ color }}>{icon}</span>
        </div>
        <div className="flex-1 min-w-0">
            <p className="font-medium text-[13px]">{title}</p>
            <p className="text-[11px] text-gray">{desc}</p>
        </div>
        <span className="text-[12px] font-medium text-orange group-hover:underline flex-shrink-0">{cta} →</span>
    </NavLink>
)

const AdminDashboard = () => {
    const { stats, orders, inventory, updateOrderStatus } = useAdmin()
    const navigate = useNavigate()
    const [chartRange, setChartRange] = useState(7)
    const [quickOrder, setQuickOrder] = useState(null)

    const revenueData   = genRevenueData(orders)
    const recentOrders  = [...orders].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 8)
    const topProducts   = [...inventory].sort((a, b) => b.sold - a.sold).slice(0, 5)
    const toFulfill     = orders.filter(o => o.status === 'Processing')
    const lowStockItems = inventory.filter(p => p.stock === 0 || p.stock <= 5)

    /* Revenue this week vs last week */
    const now = new Date()
    const weekAgo = new Date(now); weekAgo.setDate(now.getDate() - 7)
    const twoWeeksAgo = new Date(now); twoWeeksAgo.setDate(now.getDate() - 14)
    const thisWeekRev = orders.filter(o => o.status !== 'Cancelled' && new Date(o.date) >= weekAgo).reduce((s, o) => s + o.total, 0)
    const lastWeekRev = orders.filter(o => o.status !== 'Cancelled' && new Date(o.date) >= twoWeeksAgo && new Date(o.date) < weekAgo).reduce((s, o) => s + o.total, 0)
    const revDelta = lastWeekRev > 0 ? Math.round(((thisWeekRev - lastWeekRev) / lastWeekRev) * 100) : 0

    const todayOrders = orders.filter(o => new Date(o.date).toDateString() === now.toDateString())
    const avgOrderValue = orders.length > 0 ? stats.totalRevenue / orders.filter(o => o.status !== 'Cancelled').length : 0

    const fmtDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    const fmtTime = (d) => new Date(d).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })

    return (
        <div>
            {/* ── Page header ── */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="font-Helvetica font-normal text-[32px] text-black">Overview</h1>
                    <p className="text-gray text-[14px] mt-1">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
                </div>
                <NavLink to="/admin/orders" className="btnClass font-medium text-[13px] bg-orange !border-orange text-white flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                    Manage Orders
                </NavLink>
            </div>

            {/* ── Action Items (needs attention) ── */}
            {(toFulfill.length > 0 || lowStockItems.length > 0) && (
                <div className="bg-[#FFF7ED] border border-solid border-[#FED7AA] rounded-[24px] px-6 py-4 mb-6">
                    <div className="flex items-center gap-2 mb-3">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="#EA580C" strokeWidth="1.8" strokeLinecap="round"/></svg>
                        <h5 className="font-medium text-[14px] text-[#EA580C]">Needs Your Attention</h5>
                    </div>
                    <div className="flex flex-col gap-2">
                        {toFulfill.length > 0 && (
                            <ActionItem
                                icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><circle cx="5.5" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="1.8"/><circle cx="18.5" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="1.8"/></svg>}
                                title={`${toFulfill.length} order${toFulfill.length > 1 ? 's' : ''} waiting to be fulfilled`}
                                desc="These orders are confirmed and ready to pack & ship"
                                cta="Fulfill now"
                                to="/admin/orders"
                                color="#EA580C"
                            />
                        )}
                        {lowStockItems.length > 0 && (
                            <ActionItem
                                icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>}
                                title={`${lowStockItems.length} product${lowStockItems.length > 1 ? 's' : ''} running low on stock`}
                                desc={lowStockItems.map(p => p.name).join(', ')}
                                cta="Restock"
                                to="/admin/inventory"
                                color="#7C3AED"
                            />
                        )}
                    </div>
                </div>
            )}

            {/* ── KPI Stats ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard label="Total Revenue" value={`$${stats.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
                    sub="all time" delta={revDelta} color="#E16F3D"
                    icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>}
                />
                <StatCard label="Orders Today" value={todayOrders.length}
                    sub={`${stats.activeOrders} active total`} color="#2563EB"
                    icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>}
                    onClick={() => navigate('/admin/orders')}
                />
                <StatCard label="Avg. Order Value" value={`$${avgOrderValue.toFixed(2)}`}
                    sub={`${stats.completedOrders} completed`} color="#16A34A"
                    icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                />
                <StatCard label="To Fulfill" value={toFulfill.length}
                    sub="orders processing" color={toFulfill.length > 0 ? '#EA580C' : '#16A34A'}
                    icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><circle cx="5.5" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="1.8"/><circle cx="18.5" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="1.8"/></svg>}
                    onClick={() => navigate('/admin/orders')}
                />
            </div>

            {/* ── Revenue Chart + Order Funnel ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 bg-white border border-solid border-[#E5E5E5] rounded-[24px] px-6 py-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h4 className="font-Helvetica font-normal text-[18px]">Revenue</h4>
                            <p className="text-[12px] text-gray mt-1">
                                This week: <span className="font-medium text-black">${thisWeekRev.toFixed(0)}</span>
                                {revDelta !== 0 && <span className={`ml-2 text-[11px] font-medium ` + (revDelta >= 0 ? 'text-green-600' : 'text-red-500')}>{revDelta >= 0 ? '↑' : '↓'} {Math.abs(revDelta)}% vs last week</span>}
                            </p>
                        </div>
                        <div className="flex items-center gap-1 bg-[#F6F6F6] rounded-full p-1">
                            {[7, 30].map(r => (
                                <button key={r} onClick={() => setChartRange(r)}
                                    className={`px-3 py-[5px] rounded-full text-[12px] font-medium transition-colors ` +
                                        (chartRange === r ? 'bg-white text-black shadow-sm' : 'text-gray hover:text-black')}>
                                    {r}d
                                </button>
                            ))}
                        </div>
                    </div>
                    <RevenueChart data={revenueData} range={chartRange} />
                    <div className="flex items-center justify-between mt-2">
                        <span className="text-[10px] text-gray">{revenueData[revenueData.length - (chartRange === 7 ? 7 : 30)]?.day}</span>
                        <span className="text-[10px] text-gray">{revenueData[revenueData.length - 1]?.day}</span>
                    </div>
                </div>

                {/* Order Funnel */}
                <div className="bg-white border border-solid border-[#E5E5E5] rounded-[24px] px-6 py-6">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="font-Helvetica font-normal text-[18px]">Order Status</h4>
                        <span className="text-[12px] text-gray">{stats.totalOrders} total</span>
                    </div>
                    <OrderFunnel orders={orders} />
                    <div className="mt-4 pt-4 border-t border-solid border-[#E5E5E5]">
                        <div className="flex items-center justify-between text-[12px]">
                            <span className="text-gray">Completion rate</span>
                            <span className="font-medium">{stats.totalOrders > 0 ? Math.round((stats.completedOrders / stats.totalOrders) * 100) : 0}%</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Recent Orders + Top Products ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Recent Orders */}
                <div className="lg:col-span-2 bg-white border border-solid border-[#E5E5E5] rounded-[24px] px-6 py-6">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="font-Helvetica font-normal text-[18px]">Recent Orders</h4>
                        <NavLink to="/admin/orders" className="text-[12px] text-orange font-medium hover:underline">View all →</NavLink>
                    </div>
                    <div className="flex flex-col gap-0">
                        {recentOrders.map((order, i) => {
                            const sc = SC[order.status] || SC.Processing
                            return (
                                <div key={order.ref} className={`flex items-center gap-3 py-3 ${i < recentOrders.length - 1 ? 'border-b border-solid border-[#F5F5F5]' : ''}`}>
                                    {/* Avatar */}
                                    <div className="w-[36px] h-[36px] rounded-full bg-orange flex items-center justify-center flex-shrink-0">
                                        <span className="text-white font-medium text-[13px]">{order.customer.charAt(0)}</span>
                                    </div>
                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="font-medium text-[13px] truncate">{order.customer}</p>
                                            <span className="text-[10px] font-medium px-2 py-[2px] rounded-full border border-solid flex-shrink-0" style={{ backgroundColor: sc.bg, color: sc.text, borderColor: sc.border }}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-gray">{order.ref} · {fmtDate(order.date)} {fmtTime(order.date)}</p>
                                    </div>
                                    {/* Amount + action */}
                                    <div className="text-right flex-shrink-0">
                                        <p className="font-medium text-[13px]">${order.total.toFixed(2)}</p>
                                        <button onClick={() => setQuickOrder(order)} className="text-[11px] text-orange hover:underline">Details</button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Top Products */}
                <div className="bg-white border border-solid border-[#E5E5E5] rounded-[24px] px-6 py-6">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="font-Helvetica font-normal text-[18px]">Top Products</h4>
                        <NavLink to="/admin/inventory" className="text-[12px] text-orange font-medium hover:underline">View all →</NavLink>
                    </div>
                    <div className="flex flex-col gap-4">
                        {topProducts.map((p, i) => (
                            <div key={p.id} className="flex items-center gap-3">
                                <span className="text-[12px] font-medium text-gray w-[16px] flex-shrink-0">{i + 1}</span>
                                <img src={p.img} className="w-[40px] h-[40px] rounded-[8px] object-cover flex-shrink-0" alt={p.name} />
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-[13px] truncate">{p.name}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="flex-1 h-[4px] bg-[#F5F5F5] rounded-full overflow-hidden">
                                            <div className="h-full bg-orange rounded-full" style={{ width: `${Math.min((p.sold / (topProducts[0]?.sold || 1)) * 100, 100)}%` }}></div>
                                        </div>
                                        <span className="text-[10px] text-gray flex-shrink-0">{p.sold} sold</span>
                                    </div>
                                </div>
                                <p className="text-[12px] font-medium text-orange flex-shrink-0">${(p.sold * p.price).toFixed(0)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Quick Order Detail (slide-in) ── */}
            {quickOrder && (
                <div className="fixed inset-0 z-[200] flex" style={{ backgroundColor: 'rgba(23,23,23,0.4)' }} onClick={() => setQuickOrder(null)}>
                    <div className="ml-auto w-full max-w-[420px] bg-white h-full overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="sticky top-0 bg-white border-b border-solid border-[#E5E5E5] px-6 py-4 flex items-center justify-between">
                            <div>
                                <h4 className="font-Helvetica font-normal text-[18px]">{quickOrder.ref}</h4>
                                <p className="text-gray text-[12px]">{fmtDate(quickOrder.date)} · {fmtTime(quickOrder.date)}</p>
                            </div>
                            <button onClick={() => setQuickOrder(null)} className="text-gray hover:text-black transition-colors">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                            </button>
                        </div>
                        <div className="px-6 py-5 flex flex-col gap-4">
                            {/* Status */}
                            <div className="flex items-center justify-between">
                                <span className="text-[12px] font-medium px-3 py-[5px] rounded-full border border-solid" style={{ backgroundColor: (SC[quickOrder.status] || SC.Processing).bg, color: (SC[quickOrder.status] || SC.Processing).text, borderColor: (SC[quickOrder.status] || SC.Processing).border }}>
                                    {quickOrder.status}
                                </span>
                                <NavLink to="/admin/orders" className="text-[12px] font-medium text-orange hover:underline">Full details →</NavLink>
                            </div>

                            {/* Customer */}
                            <div className="p-4 bg-[#F6F6F6] rounded-[16px]">
                                <div className="flex items-center gap-3">
                                    <div className="w-[40px] h-[40px] rounded-full bg-orange flex items-center justify-center flex-shrink-0">
                                        <span className="text-white font-medium">{quickOrder.customer.charAt(0)}</span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-[14px]">{quickOrder.customer}</p>
                                        <p className="text-gray text-[12px]">{quickOrder.email}</p>
                                    </div>
                                </div>
                                {quickOrder.address && (
                                    <p className="text-[12px] text-gray mt-2 ml-[52px]">
                                        {quickOrder.address.street}, {quickOrder.address.city}, {quickOrder.address.country}
                                    </p>
                                )}
                            </div>

                            {/* Items */}
                            <div>
                                <p className="font-medium text-[13px] mb-2">Items</p>
                                <div className="flex flex-col gap-2">
                                    {quickOrder.items.map((item, i) => (
                                        <div key={i} className="flex items-center gap-3 p-3 border border-solid border-[#E5E5E5] rounded-[12px]">
                                            <img src={item.img} className="w-[48px] h-[48px] rounded-[8px] object-cover flex-shrink-0" alt={item.name} />
                                            <div className="flex-1">
                                                <p className="font-medium text-[13px]">{item.name}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[11px] px-2 py-[2px] border border-solid border-[#E5E5E5] rounded-full">{item.selectedSize}</span>
                                                    {item.selectedColor && <span className="w-[12px] h-[12px] rounded-full border border-solid border-[#E5E5E5]" style={{ backgroundColor: item.selectedColor }}></span>}
                                                    <span className="text-[11px] text-gray">×{item.qty}</span>
                                                </div>
                                            </div>
                                            <p className="font-medium text-[13px]">${(parseFloat(item.price) * item.qty).toFixed(2)}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Shipping */}
                            <div className="grid grid-cols-2 gap-3 text-[12px]">
                                <div className="p-3 bg-[#F6F6F6] rounded-[12px]">
                                    <p className="text-gray mb-1">Courier</p>
                                    <p className="font-medium">{quickOrder.shippingMethod}</p>
                                </div>
                                <div className="p-3 bg-[#F6F6F6] rounded-[12px]">
                                    <p className="text-gray mb-1">Payment</p>
                                    <p className="font-medium">{quickOrder.paymentMethod}</p>
                                </div>
                            </div>

                            {/* Total */}
                            <div className="flex justify-between items-center p-4 bg-[#F6F6F6] rounded-[16px]">
                                <span className="font-medium text-[14px]">Total</span>
                                <span className="font-semibold text-[18px]">${quickOrder.total.toFixed(2)}</span>
                            </div>

                            {/* Quick status update */}
                            {quickOrder.status !== 'Completed' && quickOrder.status !== 'Cancelled' && (
                                <div>
                                    <p className="font-medium text-[13px] mb-2">Quick Update</p>
                                    <div className="grid grid-cols-2 gap-2">
                                        {['Processing', 'Shipped', 'Completed', 'Cancelled'].map(s => {
                                            const sc = SC[s]
                                            const isActive = quickOrder.status === s
                                            return (
                                                <button key={s} onClick={() => { updateOrderStatus(quickOrder.ref, s); setQuickOrder({ ...quickOrder, status: s }) }}
                                                    className="py-[10px] px-3 rounded-full text-[12px] font-medium border border-solid transition-all"
                                                    style={{ backgroundColor: isActive ? sc.bg : 'white', color: isActive ? sc.text : '#525252', borderColor: isActive ? sc.border : '#E5E5E5' }}>
                                                    {s}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminDashboard
