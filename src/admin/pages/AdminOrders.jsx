import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdmin } from '../../context/AdminContext'

/* ── Status colors ── */
const FS_COLORS = {
    Unfulfilled: { bg: '#FFF7ED', text: '#EA580C', border: '#FED7AA' },
    Picking:     { bg: '#FFFBEB', text: '#D97706', border: '#FDE68A' },
    Packed:      { bg: '#EFF6FF', text: '#2563EB', border: '#BFDBFE' },
    Shipped:     { bg: '#F0F9FF', text: '#0284C7', border: '#BAE6FD' },
    Delivered:   { bg: '#F0FDF4', text: '#16A34A', border: '#BBF7D0' },
    Cancelled:   { bg: '#FEF2F2', text: '#DC2626', border: '#FECACA' },
    Returned:    { bg: '#FDF4FF', text: '#9333EA', border: '#E9D5FF' },
}

const fmtDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

/* ── SLA badge ── */
const SlaBadge = ({ order }) => {
    const fs = order.fulfillmentStatus
    const active = ['Unfulfilled','Picking','Packed'].includes(fs)
    if (!active) return <span className="text-[11px] text-gray">—</span>
    const h = order.slaHours || 0
    if (h > 48) return <span className="inline-block text-[11px] font-medium px-2 py-[2px] rounded-full bg-red-100 text-red-600 border border-solid border-red-200">2d+</span>
    if (h > 24) return <span className="inline-block text-[11px] font-medium px-2 py-[2px] rounded-full bg-yellow-100 text-yellow-700 border border-solid border-yellow-200">1d+</span>
    return <span className="inline-block text-[11px] font-medium px-2 py-[2px] rounded-full bg-green-100 text-green-700 border border-solid border-green-200">On time</span>
}

/* ── Filter tabs ── */
const TABS = [
    { key: 'All',                  label: 'All' },
    { key: 'Awaiting Fulfillment', label: 'Awaiting Fulfillment' },
    { key: 'In Progress',          label: 'In Progress' },
    { key: 'Shipped',              label: 'Shipped' },
    { key: 'Delivered',            label: 'Delivered' },
    { key: 'Cancelled',            label: 'Cancelled' },
]

const matchTab = (order, tab) => {
    const fs = order.fulfillmentStatus
    if (tab === 'All')                  return true
    if (tab === 'Awaiting Fulfillment') return fs === 'Unfulfilled'
    if (tab === 'In Progress')          return fs === 'Picking' || fs === 'Packed'
    if (tab === 'Shipped')              return fs === 'Shipped'
    if (tab === 'Delivered')            return fs === 'Delivered'
    if (tab === 'Cancelled')            return fs === 'Cancelled' || fs === 'Returned'
    return true
}

/* ── Sort arrow ── */
const SortArrow = ({ col, sortCol, sortDir }) => {
    if (sortCol !== col) return <span className="text-[#A3A3A3] ml-1">↕</span>
    return <span className="text-black ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>
}

/* ── Main Orders Page ── */
const AdminOrders = () => {
    const { orders, markShipped, cancelOrder } = useAdmin()
    const navigate = useNavigate()

    const [tab, setTab]           = useState('All')
    const [search, setSearch]     = useState('')
    const [sortCol, setSortCol]   = useState('date')
    const [sortDir, setSortDir]   = useState('desc')
    const [selected, setSelected] = useState(new Set())

    /* ── Tab counts ── */
    const tabCounts = useMemo(() => {
        const counts = {}
        TABS.forEach(t => { counts[t.key] = orders.filter(o => matchTab(o, t.key)).length })
        return counts
    }, [orders])

    /* ── Filtered + sorted ── */
    const filtered = useMemo(() => {
        let list = orders.filter(o => matchTab(o, tab))
        if (search.trim()) {
            const q = search.toLowerCase()
            list = list.filter(o =>
                o.ref.toLowerCase().includes(q) ||
                o.customer.toLowerCase().includes(q) ||
                o.email.toLowerCase().includes(q)
            )
        }
        list = [...list].sort((a, b) => {
            let va, vb
            if (sortCol === 'date')  { va = new Date(a.date).getTime(); vb = new Date(b.date).getTime() }
            if (sortCol === 'total') { va = a.total; vb = b.total }
            if (sortCol === 'sla')   { va = a.slaHours || 0; vb = b.slaHours || 0 }
            if (va === undefined)    return 0
            return sortDir === 'asc' ? va - vb : vb - va
        })
        return list
    }, [orders, tab, search, sortCol, sortDir])

    const toggleSort = (col) => {
        if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
        else { setSortCol(col); setSortDir('desc') }
    }

    /* ── Bulk select ── */
    const allSelected = filtered.length > 0 && filtered.every(o => selected.has(o.ref))
    const toggleAll = () => {
        if (allSelected) setSelected(new Set())
        else setSelected(new Set(filtered.map(o => o.ref)))
    }
    const toggleOne = (ref) => {
        setSelected(prev => {
            const next = new Set(prev)
            next.has(ref) ? next.delete(ref) : next.add(ref)
            return next
        })
    }

    /* ── Bulk actions ── */
    const handleBulkShip = () => {
        selected.forEach(ref => {
            const o = orders.find(x => x.ref === ref)
            if (o && o.fulfillmentStatus === 'Packed') {
                markShipped(ref, { trackingNumber: 'BULK' + Date.now(), courier: o.shippingMethod })
            }
        })
        setSelected(new Set())
    }

    const handleBulkCancel = () => {
        selected.forEach(ref => {
            const o = orders.find(x => x.ref === ref)
            if (o && !['Delivered','Cancelled'].includes(o.fulfillmentStatus)) {
                cancelOrder(ref, { reason: 'Bulk cancel', message: '', refundAmount: o.total })
            }
        })
        setSelected(new Set())
    }

    const handleExportCSV = () => {
        const rows = [['Ref','Customer','Email','Date','Total','Status','Payment']]
        filtered.filter(o => selected.has(o.ref)).forEach(o => {
            rows.push([o.ref, o.customer, o.email, o.date, o.total, o.fulfillmentStatus, o.paymentStatus])
        })
        const csv = rows.map(r => r.join(',')).join('\n')
        const blob = new Blob([csv], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a'); a.href = url; a.download = 'orders.csv'; a.click()
        URL.revokeObjectURL(url)
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="font-Helvetica font-normal text-[32px] text-black">Orders</h1>
                <p className="text-gray text-[14px] mt-1">{orders.length} total orders</p>
            </div>

            {/* Filter tabs */}
            <div className="bg-white border border-solid border-[#E5E5E5] rounded-[24px] px-6 pt-4 pb-0 mb-4">
                <div className="flex items-center gap-1 overflow-x-auto">
                    {TABS.map(t => (
                        <button key={t.key} onClick={() => setTab(t.key)}
                            className={`flex items-center gap-2 px-4 py-2 text-[13px] font-medium border-b-2 border-solid transition-colors whitespace-nowrap ` +
                                (tab === t.key ? 'border-black text-black' : 'border-transparent text-gray hover:text-black')}>
                            {t.label}
                            <span className={`text-[11px] px-2 py-[1px] rounded-full font-medium ` + (tab === t.key ? 'bg-black text-white' : 'bg-[#F6F6F6] text-gray')}>
                                {tabCounts[t.key]}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Search */}
            <div className="bg-white border border-solid border-[#E5E5E5] rounded-[24px] px-6 py-4 mb-4">
                <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by ref, customer, or email..."
                    className="h-[48px] px-4 border border-solid border-[#E5E5E5] rounded-full text-[14px] outline-none focus:border-black transition-colors w-full sm:w-[320px]" />
            </div>

            {/* Table */}
            <div className="bg-white border border-solid border-[#E5E5E5] rounded-[24px] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-[13px]">
                        <thead className="border-b border-solid border-[#E5E5E5] bg-[#F6F6F6]">
                            <tr>
                                <th className="px-4 py-3 w-[40px]">
                                    <div onClick={toggleAll} className={`w-[18px] h-[18px] rounded-[4px] border-2 border-solid flex items-center justify-center cursor-pointer transition-all ` + (allSelected ? 'bg-orange border-orange' : 'border-[#E5E5E5] hover:border-black')}>
                                        {allSelected && <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                                    </div>
                                </th>
                                <th className="text-left text-gray font-medium px-4 py-3">Ref</th>
                                <th className="text-left text-gray font-medium px-4 py-3">Customer</th>
                                <th className="text-left text-gray font-medium px-4 py-3">Items</th>
                                <th className="text-left text-gray font-medium px-4 py-3 cursor-pointer select-none hover:text-black" onClick={() => toggleSort('date')}>
                                    Date <SortArrow col="date" sortCol={sortCol} sortDir={sortDir} />
                                </th>
                                <th className="text-left text-gray font-medium px-4 py-3 cursor-pointer select-none hover:text-black" onClick={() => toggleSort('sla')}>
                                    SLA <SortArrow col="sla" sortCol={sortCol} sortDir={sortDir} />
                                </th>
                                <th className="text-left text-gray font-medium px-4 py-3">Courier</th>
                                <th className="text-right text-gray font-medium px-4 py-3 cursor-pointer select-none hover:text-black" onClick={() => toggleSort('total')}>
                                    Total <SortArrow col="total" sortCol={sortCol} sortDir={sortDir} />
                                </th>
                                <th className="text-center text-gray font-medium px-4 py-3">Status</th>
                                <th className="text-center text-gray font-medium px-4 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(order => {
                                const fsColor = FS_COLORS[order.fulfillmentStatus] || FS_COLORS.Unfulfilled
                                const isSelected = selected.has(order.ref)
                                return (
                                    <tr key={order.ref}
                                        className={`border-b border-solid border-[#F5F5F5] last:border-0 hover:bg-[#FAFAFA] transition-colors cursor-pointer ` + (isSelected ? 'bg-[#FFF7ED]' : '')}
                                        onClick={() => navigate('/admin/orders/' + order.ref)}>
                                        <td className="px-4 py-4" onClick={e => e.stopPropagation()}>
                                            <div onClick={() => toggleOne(order.ref)} className={`w-[18px] h-[18px] rounded-[4px] border-2 border-solid flex items-center justify-center cursor-pointer transition-all ` + (isSelected ? 'bg-orange border-orange' : 'border-[#E5E5E5] hover:border-black')}>
                                                {isSelected && <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 font-medium text-black">{order.ref}</td>
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
                                        <td className="px-4 py-4 text-gray">{fmtDate(order.date)}</td>
                                        <td className="px-4 py-4"><SlaBadge order={order} /></td>
                                        <td className="px-4 py-4 text-gray">{order.shippingMethod}</td>
                                        <td className="px-4 py-4 text-right font-medium">${order.total.toFixed(2)}</td>
                                        <td className="px-4 py-4 text-center">
                                            <span className="inline-block text-[11px] font-medium px-3 py-[4px] rounded-full border border-solid" style={{ backgroundColor: fsColor.bg, color: fsColor.text, borderColor: fsColor.border }}>
                                                {order.fulfillmentStatus}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-center" onClick={e => e.stopPropagation()}>
                                            <button onClick={() => navigate('/admin/orders/' + order.ref)}
                                                className="text-[12px] font-medium text-orange hover:underline">View Details</button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                    {filtered.length === 0 && <div className="text-center py-12 text-gray text-[14px]">No orders found.</div>}
                </div>
            </div>

            {/* Bulk action bar */}
            {selected.size > 0 && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] bg-black text-white rounded-full px-6 py-3 flex items-center gap-4 shadow-2xl">
                    <span className="text-[13px] font-medium">{selected.size} selected</span>
                    <div className="w-[1px] h-[16px] bg-[#444]"></div>
                    <button onClick={handleBulkShip} className="text-[13px] font-medium hover:text-orange transition-colors">Mark Shipped</button>
                    <button onClick={handleExportCSV} className="text-[13px] font-medium hover:text-orange transition-colors">Export CSV</button>
                    <button onClick={handleBulkCancel} className="text-[13px] font-medium text-red-400 hover:text-red-300 transition-colors">Cancel</button>
                    <button onClick={() => setSelected(new Set())} className="text-gray hover:text-white transition-colors ml-2">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                    </button>
                </div>
            )}
        </div>
    )
}

export default AdminOrders
