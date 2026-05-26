import React, { useState } from 'react'
import { useAdmin } from '../../context/AdminContext'

const STATUS_OPTIONS = ['All', 'Processing', 'Shipped', 'Completed', 'Cancelled']

const statusColor = {
    Completed:  { bg: '#F0FDF4', text: '#16A34A', border: '#BBF7D0' },
    Processing: { bg: '#FFF7ED', text: '#EA580C', border: '#FED7AA' },
    Shipped:    { bg: '#EFF6FF', text: '#2563EB', border: '#BFDBFE' },
    Cancelled:  { bg: '#FEF2F2', text: '#DC2626', border: '#FECACA' },
}

const AdminOrders = () => {
    const { orders, updateOrderStatus } = useAdmin()
    const [filter, setFilter]   = useState('All')
    const [search, setSearch]   = useState('')
    const [selected, setSelected] = useState(null)

    const filtered = [...orders]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .filter(o => filter === 'All' || o.status === filter)
        .filter(o =>
            o.ref.toLowerCase().includes(search.toLowerCase()) ||
            o.customer.toLowerCase().includes(search.toLowerCase())
        )

    const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

    return (
        <div>
            <div className="mb-6">
                <h1 className="font-Helvetica font-normal text-[28px] text-[#171717]">Orders</h1>
                <p className="text-gray text-[14px] mt-1">{orders.length} total orders</p>
            </div>

            {/* Filters */}
            <div className="bg-white border border-solid border-[#E5E5E5] rounded-[16px] px-6 py-4 mb-4 flex flex-wrap items-center gap-3">
                <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search by ref or customer..."
                    className="h-[40px] px-4 border border-solid border-[#E5E5E5] rounded-full text-[13px] outline-none focus:border-[#171717] transition-colors w-full sm:w-[260px]"
                />
                <div className="flex items-center gap-2 flex-wrap">
                    {STATUS_OPTIONS.map(s => (
                        <button
                            key={s}
                            onClick={() => setFilter(s)}
                            className={`px-4 py-[6px] rounded-full text-[12px] font-medium border border-solid transition-colors ` +
                                (filter === s ? 'bg-[#171717] text-white border-[#171717]' : 'border-[#E5E5E5] text-gray hover:border-[#171717] hover:text-black')}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-solid border-[#E5E5E5] rounded-[16px] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-[13px]">
                        <thead className="border-b border-solid border-[#E5E5E5] bg-[#F8F8F8]">
                            <tr>
                                <th className="text-left text-gray font-medium px-6 py-3">Ref</th>
                                <th className="text-left text-gray font-medium px-4 py-3">Customer</th>
                                <th className="text-left text-gray font-medium px-4 py-3">Items</th>
                                <th className="text-left text-gray font-medium px-4 py-3">Date</th>
                                <th className="text-left text-gray font-medium px-4 py-3">Shipping</th>
                                <th className="text-right text-gray font-medium px-4 py-3">Total</th>
                                <th className="text-center text-gray font-medium px-4 py-3">Status</th>
                                <th className="text-center text-gray font-medium px-4 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(order => {
                                const sc = statusColor[order.status] || statusColor.Processing
                                return (
                                    <tr key={order.ref} className="border-b border-solid border-[#F5F5F5] last:border-0 hover:bg-[#FAFAFA] transition-colors">
                                        <td className="px-6 py-4 font-medium text-[#171717]">{order.ref}</td>
                                        <td className="px-4 py-4">
                                            <p className="font-medium">{order.customer}</p>
                                            <p className="text-gray text-[11px]">{order.email}</p>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex -space-x-2">
                                                {order.items.slice(0, 3).map((item, i) => (
                                                    <img key={i} src={item.img} className="w-[32px] h-[32px] rounded-[6px] object-cover border-2 border-white" alt={item.name} />
                                                ))}
                                            </div>
                                            <p className="text-[11px] text-gray mt-1">{order.items.length} item{order.items.length > 1 ? 's' : ''}</p>
                                        </td>
                                        <td className="px-4 py-4 text-gray">{formatDate(order.date)}</td>
                                        <td className="px-4 py-4 text-gray">{order.shippingMethod}</td>
                                        <td className="px-4 py-4 text-right font-medium">${order.total.toFixed(2)}</td>
                                        <td className="px-4 py-4 text-center">
                                            <span className="inline-block text-[11px] font-medium px-2 py-[3px] rounded-full border border-solid" style={{ backgroundColor: sc.bg, color: sc.text, borderColor: sc.border }}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-center">
                                            <button
                                                onClick={() => setSelected(order)}
                                                className="text-[12px] font-medium text-orange hover:underline"
                                            >
                                                Manage
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                    {filtered.length === 0 && (
                        <div className="text-center py-12 text-gray text-[14px]">No orders found.</div>
                    )}
                </div>
            </div>

            {/* ── Order Detail Modal ── */}
            {selected && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center px-4" style={{ backgroundColor: 'rgba(23,23,23,0.5)' }}>
                    <div className="bg-white rounded-[16px] w-full max-w-[560px] max-h-[90vh] overflow-y-auto">
                        <div className="px-6 py-5 border-b border-solid border-[#E5E5E5] flex items-center justify-between">
                            <h4 className="font-Helvetica font-normal text-[18px]">Order {selected.ref}</h4>
                            <button onClick={() => setSelected(null)} className="text-gray hover:text-black transition-colors">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
                            </button>
                        </div>
                        <div className="px-6 py-5">
                            {/* Customer */}
                            <div className="mb-4 p-4 bg-[#F8F8F8] rounded-[8px]">
                                <p className="text-[12px] text-gray mb-1">Customer</p>
                                <p className="font-medium text-[14px]">{selected.customer}</p>
                                <p className="text-[13px] text-gray">{selected.email}</p>
                            </div>

                            {/* Items */}
                            <h5 className="font-medium text-[14px] mb-3">Items</h5>
                            <div className="flex flex-col gap-3 mb-4">
                                {selected.items.map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 border border-solid border-[#E5E5E5] rounded-[8px]">
                                        <img src={item.img} className="w-[48px] h-[48px] rounded-[6px] object-cover" alt={item.name} />
                                        <div className="flex-1">
                                            <p className="font-medium text-[13px]">{item.name}</p>
                                            <p className="text-[11px] text-gray">
                                                {item.selectedSize && `Size ${item.selectedSize}`}
                                                {item.selectedColor && <span className="inline-block w-[10px] h-[10px] rounded-full ml-2 align-middle" style={{ backgroundColor: item.selectedColor }}></span>}
                                                {' '}×{item.qty}
                                            </p>
                                        </div>
                                        <p className="font-medium text-[13px]">${(parseFloat(item.price) * item.qty).toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Total */}
                            <div className="flex justify-between items-center p-3 bg-[#F8F8F8] rounded-[8px] mb-4">
                                <span className="font-medium text-[14px]">Total</span>
                                <span className="font-semibold text-[16px]">${selected.total.toFixed(2)}</span>
                            </div>

                            {/* Update Status */}
                            <h5 className="font-medium text-[14px] mb-2">Update Status</h5>
                            <div className="grid grid-cols-2 gap-2">
                                {['Processing', 'Shipped', 'Completed', 'Cancelled'].map(s => {
                                    const sc = statusColor[s]
                                    const isActive = selected.status === s
                                    return (
                                        <button
                                            key={s}
                                            onClick={() => {
                                                updateOrderStatus(selected.ref, s)
                                                setSelected({ ...selected, status: s })
                                            }}
                                            className="py-2 px-4 rounded-[8px] text-[13px] font-medium border border-solid transition-all"
                                            style={{
                                                backgroundColor: isActive ? sc.bg : 'white',
                                                color: isActive ? sc.text : '#525252',
                                                borderColor: isActive ? sc.border : '#E5E5E5',
                                            }}
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

export default AdminOrders
