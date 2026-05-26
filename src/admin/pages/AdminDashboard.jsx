import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAdmin } from '../../context/AdminContext'

/* ── Status config ── */
const SC = {
    Completed:  { bg: '#F0FDF4', text: '#16A34A', border: '#BBF7D0' },
    Processing: { bg: '#FFF7ED', text: '#EA580C', border: '#FED7AA' },
    Shipped:    { bg: '#EFF6FF', text: '#2563EB', border: '#BFDBFE' },
    Cancelled:  { bg: '#FEF2F2', text: '#DC2626', border: '#FECACA' },
    Pending:    { bg: '#F5F5F5', text: '#525252', border: '#E5E5E5' },
}

/* ── Order lifecycle steps ── */
const ORDER_LIFECYCLE = [
    {
        step: 1,
        status: 'Pending',
        title: 'Order Placed',
        desc: 'Customer completes payment on the website. Order appears in the admin dashboard with status Pending.',
        action: 'Review order details and confirm stock availability.',
        icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>,
    },
    {
        step: 2,
        status: 'Processing',
        title: 'Processing',
        desc: 'Admin confirms the order and starts preparing the package. Stock is deducted from inventory.',
        action: 'Click "Manage" on the order → set status to Processing.',
        icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>,
    },
    {
        step: 3,
        status: 'Shipped',
        title: 'Shipped',
        desc: 'Package handed to courier (DHL / FedEx). Tracking number generated and customer is notified.',
        action: 'Click "Manage" on the order → set status to Shipped.',
        icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><circle cx="5.5" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="1.8"/><circle cx="18.5" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="1.8"/></svg>,
    },
    {
        step: 4,
        status: 'Completed',
        title: 'Delivered',
        desc: 'Customer receives the package. Order is marked as Completed. Customer can leave a review.',
        action: 'Click "Manage" on the order → set status to Completed.',
        icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    },
]

const StatCard = ({ label, value, sub, color = '#E16F3D', icon }) => (
    <div className="bg-white border border-solid border-[#E5E5E5] rounded-[24px] px-6 py-5 flex items-start gap-4">
        <div className="w-[48px] h-[48px] rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: color + '18' }}>
            <span style={{ color }}>{icon}</span>
        </div>
        <div>
            <p className="text-gray text-[13px] mb-1">{label}</p>
            <h3 className="font-Helvetica font-normal text-[28px] text-black leading-tight">{value}</h3>
            {sub && <p className="text-[12px] text-gray mt-1">{sub}</p>}
        </div>
    </div>
)

const AdminDashboard = () => {
    const { stats, orders, inventory, updateOrderStatus } = useAdmin()
    const [showLifecycle, setShowLifecycle] = useState(false)
    const [selectedOrder, setSelectedOrder] = useState(null)

    const recentOrders = [...orders].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6)
    const topProducts  = [...inventory].sort((a, b) => b.sold - a.sold).slice(0, 5)

    const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

    return (
        <div>
            {/* ── Header ── */}
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h1 className="font-Helvetica font-normal text-[32px] text-black">Dashboard</h1>
                    <p className="text-gray text-[14px] lg:text-[16px] mt-1">Welcome back — here's what's happening with Lux today.</p>
                </div>
                <button
                    onClick={() => setShowLifecycle(!showLifecycle)}
                    className="btnClass font-medium text-[12px] lg:text-[14px] !border-[#E5E5E5] text-black hover:bg-black hover:text-white transition-colors flex items-center gap-2"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8"/><path d="M12 8v4l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                    Order Lifecycle
                </button>
            </div>

            {/* ── Order Lifecycle Panel ── */}
            {showLifecycle && (
                <div className="bg-white border border-solid border-[#E5E5E5] rounded-[24px] px-6 py-6 mb-6">
                    <div className="flex items-center justify-between mb-6">
                        <h4 className="font-Helvetica font-normal text-[20px]">Order Lifecycle — How an Order Flows</h4>
                        <button onClick={() => setShowLifecycle(false)} className="text-gray hover:text-black transition-colors">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                        </button>
                    </div>

                    {/* Timeline */}
                    <div className="relative">
                        {/* Connector line */}
                        <div className="hidden md:block absolute top-[24px] left-[calc(12.5%_-_1px)] right-[calc(12.5%_-_1px)] h-[2px] bg-[#E5E5E5] z-0"></div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-[1]">
                            {ORDER_LIFECYCLE.map((item, i) => {
                                const sc = SC[item.status] || SC.Pending
                                return (
                                    <div key={item.step} className="flex flex-col items-center text-center">
                                        {/* Circle */}
                                        <div className="w-[48px] h-[48px] rounded-full flex items-center justify-center mb-3 border-2 border-solid" style={{ backgroundColor: sc.bg, borderColor: sc.border, color: sc.text }}>
                                            {item.icon}
                                        </div>
                                        {/* Step number */}
                                        <span className="text-[11px] font-medium px-2 py-[2px] rounded-full border border-solid mb-2" style={{ backgroundColor: sc.bg, color: sc.text, borderColor: sc.border }}>
                                            Step {item.step}
                                        </span>
                                        <h5 className="font-medium text-[14px] mb-1">{item.title}</h5>
                                        <p className="text-[12px] text-gray mb-2">{item.desc}</p>
                                        <p className="text-[11px] font-medium text-orange">{item.action}</p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <div className="mt-6 p-4 bg-[#F6F6F6] rounded-[16px]">
                        <p className="text-[13px] text-gray">
                            <span className="font-medium text-black">Cancellation:</span> If an order needs to be cancelled (out of stock, customer request), set status to <span className="font-medium text-red-500">Cancelled</span> via the Manage button. Customer will be notified and refund initiated.
                        </p>
                    </div>
                </div>
            )}

            {/* ── Stats Grid ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard label="Total Revenue" value={`$${stats.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} sub={`${stats.completedOrders} completed`} color="#E16F3D"
                    icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>}
                />
                <StatCard label="Total Orders" value={stats.totalOrders} sub={`${stats.activeOrders} active`} color="#2563EB"
                    icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>}
                />
                <StatCard label="Customers" value={stats.totalCustomers} sub="registered users" color="#16A34A"
                    icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.8"/></svg>}
                />
                <StatCard label="Products" value={stats.totalProducts} sub={`${stats.lowStock} low · ${stats.outOfStock} out`} color="#7C3AED"
                    icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* ── Recent Orders ── */}
                <div className="lg:col-span-2 bg-white border border-solid border-[#E5E5E5] rounded-[24px] px-6 py-6">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="font-Helvetica font-normal text-[20px]">Recent Orders</h4>
                        <NavLink to="/admin/orders" className="text-[13px] text-orange font-medium hover:underline">View all</NavLink>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-[13px]">
                            <thead>
                                <tr className="border-b border-solid border-[#E5E5E5]">
                                    <th className="text-left text-gray font-medium pb-3">Ref</th>
                                    <th className="text-left text-gray font-medium pb-3">Customer</th>
                                    <th className="text-left text-gray font-medium pb-3">Date</th>
                                    <th className="text-right text-gray font-medium pb-3">Total</th>
                                    <th className="text-right text-gray font-medium pb-3">Status</th>
                                    <th className="text-right text-gray font-medium pb-3">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map(order => {
                                    const sc = SC[order.status] || SC.Processing
                                    return (
                                        <tr key={order.ref} className="border-b border-solid border-[#F5F5F5] last:border-0">
                                            <td className="py-3 font-medium text-black">{order.ref}</td>
                                            <td className="py-3 text-gray">{order.customer}</td>
                                            <td className="py-3 text-gray">{formatDate(order.date)}</td>
                                            <td className="py-3 text-right font-medium">${order.total.toFixed(2)}</td>
                                            <td className="py-3 text-right">
                                                <span className="inline-block text-[11px] font-medium px-2 py-[3px] rounded-full border border-solid" style={{ backgroundColor: sc.bg, color: sc.text, borderColor: sc.border }}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="py-3 text-right">
                                                <button onClick={() => setSelectedOrder(order)} className="text-[12px] font-medium text-orange hover:underline">Manage</button>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* ── Top Products ── */}
                <div className="bg-white border border-solid border-[#E5E5E5] rounded-[24px] px-6 py-6">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="font-Helvetica font-normal text-[20px]">Top Products</h4>
                        <NavLink to="/admin/inventory" className="text-[13px] text-orange font-medium hover:underline">View all</NavLink>
                    </div>
                    <div className="flex flex-col gap-4">
                        {topProducts.map((p, i) => (
                            <div key={p.id} className="flex items-center gap-3">
                                <span className="text-[13px] font-medium text-gray w-[20px]">{i + 1}</span>
                                <img src={p.img} className="w-[40px] h-[40px] rounded-[8px] object-cover flex-shrink-0" alt={p.name} />
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-[13px] truncate">{p.name}</p>
                                    <p className="text-[11px] text-gray">{p.sold} sold · ${p.price}</p>
                                </div>
                                <p className="text-[13px] font-medium text-orange">${(p.sold * p.price).toFixed(0)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Stock Alerts ── */}
            {(stats.lowStock > 0 || stats.outOfStock > 0) && (
                <div className="mt-6 bg-white border border-solid border-[#E5E5E5] rounded-[24px] px-6 py-6">
                    <h4 className="font-Helvetica font-normal text-[20px] mb-4">Stock Alerts</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {inventory.filter(p => p.stock === 0 || p.stock <= 5).map(p => (
                            <div key={p.id} className="flex items-center gap-3 p-3 rounded-[16px] border border-solid" style={{ borderColor: p.stock === 0 ? '#FECACA' : '#FED7AA', backgroundColor: p.stock === 0 ? '#FEF2F2' : '#FFF7ED' }}>
                                <img src={p.img} className="w-[40px] h-[40px] rounded-[8px] object-cover flex-shrink-0" alt={p.name} />
                                <div className="flex-1">
                                    <p className="font-medium text-[13px]">{p.name}</p>
                                    <p className="text-[12px]" style={{ color: p.stock === 0 ? '#DC2626' : '#EA580C' }}>
                                        {p.stock === 0 ? 'Out of stock' : `Only ${p.stock} left`}
                                    </p>
                                </div>
                                <NavLink to="/admin/inventory" className="text-[12px] font-medium text-orange hover:underline">Restock</NavLink>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── Quick Manage Modal ── */}
            {selectedOrder && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center px-4" style={{ backgroundColor: 'rgba(23,23,23,0.5)' }}>
                    <div className="bg-white rounded-[24px] w-full max-w-[480px] max-h-[90vh] overflow-y-auto">
                        <div className="px-6 py-5 border-b border-solid border-[#E5E5E5] flex items-center justify-between">
                            <h4 className="font-Helvetica font-normal text-[20px]">Order {selectedOrder.ref}</h4>
                            <button onClick={() => setSelectedOrder(null)} className="text-gray hover:text-black transition-colors">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                            </button>
                        </div>
                        <div className="px-6 py-5">
                            <div className="mb-4 p-4 bg-[#F6F6F6] rounded-[16px]">
                                <p className="text-[12px] text-gray mb-1">Customer</p>
                                <p className="font-medium text-[14px]">{selectedOrder.customer}</p>
                                <p className="text-[13px] text-gray">{selectedOrder.email}</p>
                            </div>
                            <div className="flex flex-col gap-2 mb-4">
                                {selectedOrder.items.map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 border border-solid border-[#E5E5E5] rounded-[16px]">
                                        <img src={item.img} className="w-[48px] h-[48px] rounded-[8px] object-cover" alt={item.name} />
                                        <div className="flex-1">
                                            <p className="font-medium text-[13px]">{item.name}</p>
                                            <p className="text-[11px] text-gray">Size {item.selectedSize} ×{item.qty}</p>
                                        </div>
                                        <p className="font-medium text-[13px]">${(parseFloat(item.price) * item.qty).toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between items-center p-3 bg-[#F6F6F6] rounded-[16px] mb-4">
                                <span className="font-medium text-[14px]">Total</span>
                                <span className="font-semibold text-[16px]">${selectedOrder.total.toFixed(2)}</span>
                            </div>
                            <h5 className="font-medium text-[14px] mb-3">Update Status</h5>
                            <div className="grid grid-cols-2 gap-2">
                                {['Processing', 'Shipped', 'Completed', 'Cancelled'].map(s => {
                                    const sc = SC[s]
                                    const isActive = selectedOrder.status === s
                                    return (
                                        <button key={s} onClick={() => { updateOrderStatus(selectedOrder.ref, s); setSelectedOrder({ ...selectedOrder, status: s }) }}
                                            className="py-[10px] px-4 rounded-full text-[13px] font-medium border border-solid transition-all"
                                            style={{ backgroundColor: isActive ? sc.bg : 'white', color: isActive ? sc.text : '#525252', borderColor: isActive ? sc.border : '#E5E5E5' }}
                                        >
                                            {s}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminDashboard
