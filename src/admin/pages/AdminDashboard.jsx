import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAdmin } from '../../context/AdminContext'

const StatCard = ({ label, value, sub, color = '#E16F3D', icon }) => (
    <div className="bg-white border border-solid border-[#E5E5E5] rounded-[16px] px-6 py-5 flex items-start gap-4">
        <div className="w-[48px] h-[48px] rounded-[12px] flex items-center justify-center flex-shrink-0" style={{ backgroundColor: color + '18' }}>
            <span style={{ color }}>{icon}</span>
        </div>
        <div>
            <p className="text-gray text-[13px] mb-1">{label}</p>
            <h3 className="font-Helvetica font-normal text-[28px] text-[#171717] leading-tight">{value}</h3>
            {sub && <p className="text-[12px] text-gray mt-1">{sub}</p>}
        </div>
    </div>
)

const AdminDashboard = () => {
    const { stats, orders, inventory } = useAdmin()

    const recentOrders = [...orders].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6)
    const topProducts  = [...inventory].sort((a, b) => b.sold - a.sold).slice(0, 5)

    const statusColor = {
        Completed:  { bg: '#F0FDF4', text: '#16A34A', border: '#BBF7D0' },
        Processing: { bg: '#FFF7ED', text: '#EA580C', border: '#FED7AA' },
        Shipped:    { bg: '#EFF6FF', text: '#2563EB', border: '#BFDBFE' },
        Cancelled:  { bg: '#FEF2F2', text: '#DC2626', border: '#FECACA' },
    }

    const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

    return (
        <div>
            <div className="mb-6">
                <h1 className="font-Helvetica font-normal text-[28px] text-[#171717]">Dashboard</h1>
                <p className="text-gray text-[14px] mt-1">Welcome back, here's what's happening with Lux today.</p>
            </div>

            {/* ── Stats Grid ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard
                    label="Total Revenue"
                    value={`$${stats.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    sub={`${stats.completedOrders} completed orders`}
                    color="#E16F3D"
                    icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>}
                />
                <StatCard
                    label="Total Orders"
                    value={stats.totalOrders}
                    sub={`${stats.activeOrders} active`}
                    color="#2563EB"
                    icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>}
                />
                <StatCard
                    label="Customers"
                    value={stats.totalCustomers}
                    sub="registered users"
                    color="#16A34A"
                    icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /><circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.8" /></svg>}
                />
                <StatCard
                    label="Products"
                    value={stats.totalProducts}
                    sub={`${stats.lowStock} low stock · ${stats.outOfStock} out`}
                    color="#7C3AED"
                    icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* ── Recent Orders ── */}
                <div className="lg:col-span-2 bg-white border border-solid border-[#E5E5E5] rounded-[16px] px-6 py-6">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="font-Helvetica font-normal text-[18px]">Recent Orders</h4>
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
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map(order => {
                                    const sc = statusColor[order.status] || statusColor.Processing
                                    return (
                                        <tr key={order.ref} className="border-b border-solid border-[#F5F5F5] last:border-0">
                                            <td className="py-3 font-medium text-[#171717]">{order.ref}</td>
                                            <td className="py-3 text-gray">{order.customer}</td>
                                            <td className="py-3 text-gray">{formatDate(order.date)}</td>
                                            <td className="py-3 text-right font-medium">${order.total.toFixed(2)}</td>
                                            <td className="py-3 text-right">
                                                <span className="inline-block text-[11px] font-medium px-2 py-[3px] rounded-full border border-solid" style={{ backgroundColor: sc.bg, color: sc.text, borderColor: sc.border }}>
                                                    {order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* ── Top Products ── */}
                <div className="bg-white border border-solid border-[#E5E5E5] rounded-[16px] px-6 py-6">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="font-Helvetica font-normal text-[18px]">Top Products</h4>
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
                                <div className="text-right">
                                    <p className="text-[13px] font-medium text-orange">${(p.sold * p.price).toFixed(0)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Stock Alerts ── */}
            {(stats.lowStock > 0 || stats.outOfStock > 0) && (
                <div className="mt-6 bg-white border border-solid border-[#E5E5E5] rounded-[16px] px-6 py-6">
                    <h4 className="font-Helvetica font-normal text-[18px] mb-4">Stock Alerts</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {inventory.filter(p => p.stock === 0 || p.stock <= 5).map(p => (
                            <div key={p.id} className="flex items-center gap-3 p-3 rounded-[8px] border border-solid" style={{ borderColor: p.stock === 0 ? '#FECACA' : '#FED7AA', backgroundColor: p.stock === 0 ? '#FEF2F2' : '#FFF7ED' }}>
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
        </div>
    )
}

export default AdminDashboard
