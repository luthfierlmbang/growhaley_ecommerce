import React, { useState, useRef } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAdmin } from '../../context/AdminContext'
import { useDate } from '../../context/DateContext'

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
const SC = {
    Completed:  { bg: '#F0FDF4', text: '#16A34A', border: '#BBF7D0' },
    Processing: { bg: '#FFF7ED', text: '#EA580C', border: '#FED7AA' },
    Shipped:    { bg: '#EFF6FF', text: '#2563EB', border: '#BFDBFE' },
    Cancelled:  { bg: '#FEF2F2', text: '#DC2626', border: '#FECACA' },
}

const relTime = (date) => {
    const diff = Math.floor((Date.now() - new Date(date)) / 1000)
    if (diff < 60) return 'just now'
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`
    return `${Math.floor(diff / 86400)}d ago`
}

const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
}

const fmtCurrency = (n) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`

/* ─────────────────────────────────────────────
   REVENUE LINE CHART (pure SVG)
───────────────────────────────────────────── */
const RevenueLineChart = ({ currentData, prevData }) => {
    const [tooltip, setTooltip] = useState(null)
    const svgRef = useRef(null)
    const W = 600, H = 160, PAD = { top: 16, right: 16, bottom: 28, left: 48 }
    const innerW = W - PAD.left - PAD.right
    const innerH = H - PAD.top - PAD.bottom

    const allVals = [...currentData.map(d => d.rev), ...prevData.map(d => d.rev)]
    const maxVal = Math.max(...allVals, 1)

    const xScale = (i, len) => PAD.left + (i / Math.max(len - 1, 1)) * innerW
    const yScale = (v) => PAD.top + innerH - (v / maxVal) * innerH

    const toPath = (data) =>
        data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${xScale(i, data.length).toFixed(1)} ${yScale(d.rev).toFixed(1)}`).join(' ')

    const toArea = (data) => {
        const line = toPath(data)
        const last = data.length - 1
        return `${line} L ${xScale(last, data.length).toFixed(1)} ${(PAD.top + innerH).toFixed(1)} L ${PAD.left.toFixed(1)} ${(PAD.top + innerH).toFixed(1)} Z`
    }

    const yLabels = [0, Math.round(maxVal / 2), maxVal]
    const xStep = Math.max(1, Math.floor(currentData.length / 6))

    return (
        <div className="relative w-full" style={{ paddingBottom: '28%' }}>
            <svg
                ref={svgRef}
                viewBox={`0 0 ${W} ${H}`}
                className="absolute inset-0 w-full h-full"
                preserveAspectRatio="none"
                onMouseLeave={() => setTooltip(null)}
            >
                {/* Y grid lines */}
                {yLabels.map((v, i) => (
                    <g key={i}>
                        <line x1={PAD.left} y1={yScale(v)} x2={W - PAD.right} y2={yScale(v)} stroke="#F0F0F0" strokeWidth="1"/>
                        <text x={PAD.left - 6} y={yScale(v) + 4} textAnchor="end" fontSize="9" fill="#A3A3A3">
                            {v >= 1000 ? `$${(v/1000).toFixed(0)}k` : `$${v}`}
                        </text>
                    </g>
                ))}

                {/* Previous period area (dashed) */}
                {prevData.length > 1 && (
                    <>
                        <path d={toArea(prevData)} fill="#F5F5F5" opacity="0.5"/>
                        <path d={toPath(prevData)} fill="none" stroke="#D4D4D4" strokeWidth="1.5" strokeDasharray="4 3"/>
                    </>
                )}

                {/* Current period area */}
                {currentData.length > 1 && (
                    <>
                        <defs>
                            <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#E16F3D" stopOpacity="0.18"/>
                                <stop offset="100%" stopColor="#E16F3D" stopOpacity="0"/>
                            </linearGradient>
                        </defs>
                        <path d={toArea(currentData)} fill="url(#revGrad)"/>
                        <path d={toPath(currentData)} fill="none" stroke="#E16F3D" strokeWidth="2"/>
                    </>
                )}

                {/* X axis labels */}
                {currentData.map((d, i) => {
                    if (i % xStep !== 0 && i !== currentData.length - 1) return null
                    return (
                        <text key={i} x={xScale(i, currentData.length)} y={H - 4} textAnchor="middle" fontSize="9" fill="#A3A3A3">
                            {d.day}
                        </text>
                    )
                })}

                {/* Hover dots + invisible hit areas */}
                {currentData.map((d, i) => (
                    <g key={i}>
                        <rect
                            x={xScale(i, currentData.length) - 12}
                            y={PAD.top}
                            width="24"
                            height={innerH}
                            fill="transparent"
                            onMouseEnter={(e) => {
                                const prev = prevData[i]
                                setTooltip({ x: xScale(i, currentData.length), y: yScale(d.rev), d, prev, i })
                            }}
                        />
                        {tooltip?.i === i && (
                            <circle cx={xScale(i, currentData.length)} cy={yScale(d.rev)} r="4" fill="#E16F3D" stroke="white" strokeWidth="2"/>
                        )}
                    </g>
                ))}
            </svg>

            {/* Tooltip */}
            {tooltip && (
                <div
                    className="absolute z-10 bg-black text-white text-[11px] rounded-[8px] px-3 py-2 pointer-events-none shadow-lg"
                    style={{
                        left: `${(tooltip.x / W) * 100}%`,
                        top: `${(tooltip.y / H) * 100}%`,
                        transform: 'translate(-50%, -110%)',
                        minWidth: 120,
                    }}
                >
                    <p className="font-medium">{tooltip.d.day}</p>
                    <p>Revenue: <span className="text-orange">{fmtCurrency(tooltip.d.rev)}</span></p>
                    <p>Orders: {tooltip.d.orders}</p>
                    {tooltip.prev && <p className="text-[#A3A3A3]">Prev: {fmtCurrency(tooltip.prev.rev)}</p>}
                </div>
            )}
        </div>
    )
}

/* ─────────────────────────────────────────────
   TRUE CONVERSION FUNNEL
───────────────────────────────────────────── */
const ConversionFunnel = ({ orders }) => {
    const total = orders.length || 1
    const processing = orders.filter(o => o.status === 'Processing').length
    const shipped = orders.filter(o => o.status === 'Shipped').length
    const completed = orders.filter(o => o.status === 'Completed').length

    const stages = [
        { label: 'Total Orders', count: total, color: '#E16F3D', pct: 100 },
        { label: 'Processing',   count: processing, color: '#EA580C', pct: Math.round((processing / total) * 100) },
        { label: 'Shipped',      count: shipped,    color: '#2563EB', pct: Math.round((shipped / total) * 100) },
        { label: 'Completed',    count: completed,  color: '#16A34A', pct: Math.round((completed / total) * 100) },
    ]

    return (
        <div className="flex flex-col gap-4">
            {stages.map((s, i) => {
                const dropOff = i > 0 ? stages[i - 1].pct - s.pct : null
                return (
                    <div key={s.label}>
                        {dropOff !== null && dropOff > 0 && (
                            <div className="flex items-center gap-2 mb-2 ml-1">
                                <div className="w-[1px] h-[12px] bg-[#E5E5E5]"></div>
                                <span className="text-[10px] text-gray">{dropOff}% drop-off</span>
                            </div>
                        )}
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-[12px] font-medium" style={{ color: s.color }}>{s.label}</span>
                            <span className="text-[12px] text-gray">{s.count} <span className="text-[10px]">({s.pct}%)</span></span>
                        </div>
                        <div className="h-[8px] bg-[#F5F5F5] rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full transition-all duration-700"
                                style={{ width: `${s.pct}%`, backgroundColor: s.color }}
                            />
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

/* ─────────────────────────────────────────────
   ACTIVITY FEED
───────────────────────────────────────────── */
const ActivityFeed = ({ orders, onFulfill }) => {
    const navigate = useNavigate()
    const [shown, setShown] = useState(10)
    const [filter, setFilter] = useState('all')

    const sorted = [...orders].sort((a, b) => new Date(b.date) - new Date(a.date))

    const getAction = (status) => {
        if (status === 'Processing') return 'placed order'
        if (status === 'Shipped') return 'order shipped'
        if (status === 'Completed') return 'order completed'
        if (status === 'Cancelled') return 'order cancelled'
        return 'order updated'
    }

    const filtered = filter === 'all' ? sorted : sorted.filter(o => {
        if (filter === 'orders') return true
        if (filter === 'alerts') return o.status === 'Processing' || o.status === 'Cancelled'
        return true
    })

    const visible = filtered.slice(0, shown)

    return (
        <div>
            {/* Filter tabs */}
            <div className="flex items-center gap-1 mb-4">
                {['all', 'orders', 'alerts'].map(f => (
                    <button
                        key={f}
                        onClick={() => { setFilter(f); setShown(10) }}
                        className="px-3 py-[5px] rounded-full text-[12px] font-medium transition-colors capitalize"
                        style={{
                            backgroundColor: filter === f ? '#171717' : '#F6F6F6',
                            color: filter === f ? 'white' : '#525252',
                        }}
                    >
                        {f}
                    </button>
                ))}
            </div>

            <div className="flex flex-col gap-0">
                {visible.map((order, i) => {
                    const sc = SC[order.status] || SC.Processing
                    return (
                        <div key={order.ref} className={`flex items-center gap-3 py-3 ${i < visible.length - 1 ? 'border-b border-solid border-[#F5F5F5]' : ''}`}>
                            <div className="w-[36px] h-[36px] rounded-full bg-orange flex items-center justify-center flex-shrink-0">
                                <span className="text-white font-medium text-[13px]">{order.customer.charAt(0)}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[13px]">
                                    <span className="font-medium">{order.customer}</span>
                                    <span className="text-gray"> {getAction(order.status)}</span>
                                </p>
                                <div className="flex items-center gap-2 mt-[2px]">
                                    <span className="text-[10px] font-medium px-2 py-[1px] rounded-full border border-solid" style={{ backgroundColor: sc.bg, color: sc.text, borderColor: sc.border }}>{order.status}</span>
                                    <span className="text-[11px] text-gray">{relTime(order.date)}</span>
                                </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                                <p className="font-medium text-[13px]">${order.total.toFixed(2)}</p>
                                <div className="flex items-center gap-1 mt-1 justify-end">
                                    {order.status === 'Processing' && (
                                        <button onClick={() => onFulfill(order)} className="text-[10px] font-medium text-orange hover:underline">Fulfill</button>
                                    )}
                                    <button onClick={() => navigate('/admin/orders')} className="text-[10px] text-gray hover:text-black transition-colors">View</button>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {shown < filtered.length && (
                <button
                    onClick={() => setShown(s => s + 10)}
                    className="w-full mt-4 py-2 text-[12px] font-medium text-gray hover:text-black border border-solid border-[#E5E5E5] rounded-full transition-colors"
                >
                    Load more ({filtered.length - shown} remaining)
                </button>
            )}
        </div>
    )
}

/* ─────────────────────────────────────────────
   COLLAPSIBLE WIDGET WRAPPER
───────────────────────────────────────────── */
const Widget = ({ title, children, defaultOpen = true, action }) => {
    const [open, setOpen] = useState(defaultOpen)
    return (
        <div className="bg-white border border-solid border-[#E5E5E5] rounded-[24px] overflow-hidden">
            <button
                onClick={() => setOpen(o => !o)}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-[#FAFAFA] transition-colors"
            >
                <h4 className="font-Helvetica font-normal text-[16px] text-black">{title}</h4>
                <div className="flex items-center gap-3">
                    {action && <span onClick={e => e.stopPropagation()}>{action}</span>}
                    <svg
                        width="16" height="16" viewBox="0 0 24 24" fill="none"
                        className="transition-transform duration-200 text-gray"
                        style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    >
                        <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
            </button>
            {open && <div className="px-6 pb-5">{children}</div>}
        </div>
    )
}

/* ─────────────────────────────────────────────
   TOP PRODUCTS WIDGET
───────────────────────────────────────────── */
const TopProductsWidget = ({ inventory }) => {
    const top = [...inventory].sort((a, b) => b.sold - a.sold).slice(0, 5)
    const maxSold = top[0]?.sold || 1
    return (
        <div className="flex flex-col gap-4">
            {top.map((p, i) => (
                <div key={p.id} className="flex items-center gap-3">
                    <span className="text-[11px] font-medium text-gray w-[14px] flex-shrink-0">{i + 1}</span>
                    <img src={p.img} className="w-[38px] h-[38px] rounded-[8px] object-cover flex-shrink-0" alt={p.name}/>
                    <div className="flex-1 min-w-0">
                        <p className="font-medium text-[13px] truncate">{p.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="flex-1 h-[4px] bg-[#F5F5F5] rounded-full overflow-hidden">
                                <div className="h-full rounded-full" style={{ width: `${(p.sold / maxSold) * 100}%`, backgroundColor: '#E16F3D' }}/>
                            </div>
                            <span className="text-[10px] text-gray flex-shrink-0">{p.sold} sold</span>
                        </div>
                    </div>
                    <p className="text-[12px] font-medium text-orange flex-shrink-0">${(p.sold * p.price).toFixed(0)}</p>
                </div>
            ))}
        </div>
    )
}

/* ─────────────────────────────────────────────
   TOP CUSTOMERS WIDGET
───────────────────────────────────────────── */
const TopCustomersWidget = ({ customers }) => {
    const top = [...customers].sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 5)
    return (
        <div className="flex flex-col gap-3">
            {top.map((c, i) => (
                <div key={c.id} className="flex items-center gap-3">
                    <span className="text-[11px] font-medium text-gray w-[14px] flex-shrink-0">{i + 1}</span>
                    <div className="w-[32px] h-[32px] rounded-full bg-orange flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-[12px] font-medium">{c.name.charAt(0)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-medium text-[13px] truncate">{c.name}</p>
                        <p className="text-[11px] text-gray">{c.orders} orders</p>
                    </div>
                    <p className="text-[12px] font-medium text-orange flex-shrink-0">${c.totalSpent.toFixed(0)}</p>
                </div>
            ))}
        </div>
    )
}

/* ─────────────────────────────────────────────
   SALES BY CATEGORY WIDGET
───────────────────────────────────────────── */
const SalesByCategoryWidget = ({ inventory }) => {
    const cats = {}
    inventory.forEach(p => {
        if (!cats[p.category]) cats[p.category] = { revenue: 0, sold: 0 }
        cats[p.category].revenue += p.sold * p.price
        cats[p.category].sold += p.sold
    })
    const sorted = Object.entries(cats).sort((a, b) => b[1].revenue - a[1].revenue)
    const maxRev = sorted[0]?.[1].revenue || 1
    return (
        <div className="flex flex-col gap-3">
            {sorted.map(([cat, data]) => (
                <div key={cat}>
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-[12px] font-medium text-black">{cat}</span>
                        <span className="text-[12px] text-gray">${data.revenue.toFixed(0)}</span>
                    </div>
                    <div className="h-[6px] bg-[#F5F5F5] rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${(data.revenue / maxRev) * 100}%`, backgroundColor: '#E16F3D' }}/>
                    </div>
                </div>
            ))}
        </div>
    )
}

/* ─────────────────────────────────────────────
   GENERATE CHART DATA
───────────────────────────────────────────── */
const genChartData = (orders, days) => {
    const result = []
    for (let i = days - 1; i >= 0; i--) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        const dayStr = d.toDateString()
        const dayOrders = orders.filter(o => o.status !== 'Cancelled' && new Date(o.date).toDateString() === dayStr)
        result.push({
            day: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            rev: dayOrders.reduce((s, o) => s + o.total, 0),
            orders: dayOrders.length,
            date: d,
        })
    }
    return result
}

/* ─────────────────────────────────────────────
   MAIN DASHBOARD
───────────────────────────────────────────── */
const AdminDashboard = () => {
    const { orders, inventory, customers, adminUser, updateOrderStatus } = useAdmin()
    const { period, selectPeriod } = useDate()

    // Dismissed action items (localStorage)
    const [dismissed, setDismissed] = useState(() => {
        try { return JSON.parse(localStorage.getItem('admin_dismissed') || '[]') } catch { return [] }
    })
    const dismiss = (key) => {
        const next = [...dismissed, key]
        setDismissed(next)
        localStorage.setItem('admin_dismissed', JSON.stringify(next))
    }

    const [quickOrder, setQuickOrder] = useState(null)

    // Period selector maps to chart range
    const chartDays = period === 'today' ? 1 : period === '30d' ? 30 : 7

    const currentData = genChartData(orders, chartDays)
    const prevData = genChartData(orders, chartDays * 2).slice(0, chartDays)

    // Today stats
    const now = new Date()
    const todayStr = now.toDateString()
    const todayOrders = orders.filter(o => new Date(o.date).toDateString() === todayStr)
    const todayRevenue = todayOrders.filter(o => o.status !== 'Cancelled').reduce((s, o) => s + o.total, 0)

    // Yesterday
    const yest = new Date(); yest.setDate(yest.getDate() - 1)
    const yesterdayRevenue = orders
        .filter(o => o.status !== 'Cancelled' && new Date(o.date).toDateString() === yest.toDateString())
        .reduce((s, o) => s + o.total, 0)
    const revDelta = yesterdayRevenue > 0 ? Math.round(((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100) : null

    const toFulfill = orders.filter(o => o.status === 'Processing')
    const lowStockItems = inventory.filter(p => p.stock === 0 || p.stock <= 5)
    const avgOrderValue = orders.filter(o => o.status !== 'Cancelled').length > 0
        ? orders.filter(o => o.status !== 'Cancelled').reduce((s, o) => s + o.total, 0) / orders.filter(o => o.status !== 'Cancelled').length
        : 0

    const PERIODS = [
        { key: 'today', label: 'Today' },
        { key: '7d',    label: '7d' },
        { key: '30d',   label: '30d' },
    ]

    const fmtDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    const fmtTime = (d) => new Date(d).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })

    return (
        <div className="flex flex-col gap-6">

            {/* ── A. HERO SNAPSHOT ── */}
            <div className="bg-black rounded-[28px] px-8 py-7 text-white">
                <div className="flex items-start justify-between flex-wrap gap-4">
                    <div>
                        <p className="text-[#A3A3A3] text-[14px] mb-1">
                            {greeting()}, <span className="text-white font-medium">{adminUser?.name || 'Admin'}</span>
                        </p>
                        <div className="flex items-end gap-3 flex-wrap">
                            <h1 className="font-Helvetica font-normal leading-none" style={{ fontSize: 48 }}>
                                {fmtCurrency(todayRevenue)}
                            </h1>
                            {revDelta !== null && (
                                <span className={`text-[14px] font-medium mb-1 flex items-center gap-1 ` + (revDelta >= 0 ? 'text-green-400' : 'text-red-400')}>
                                    {revDelta >= 0 ? '↑' : '↓'} {Math.abs(revDelta)}% vs yesterday
                                </span>
                            )}
                        </div>
                        <p className="text-[#A3A3A3] text-[13px] mt-1">Revenue today</p>
                    </div>

                    {/* Period selector */}
                    <div className="flex items-center gap-1 bg-[#2a2a2a] rounded-full p-1 self-start">
                        {PERIODS.map(p => (
                            <button
                                key={p.key}
                                onClick={() => selectPeriod(p.key)}
                                className="px-4 py-[6px] rounded-full text-[12px] font-medium transition-colors"
                                style={{
                                    backgroundColor: period === p.key ? '#E16F3D' : 'transparent',
                                    color: period === p.key ? 'white' : '#A3A3A3',
                                }}
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 3 mini stats */}
                <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-solid border-[#2a2a2a]">
                    <div>
                        <p className="text-[#A3A3A3] text-[11px] mb-1">Orders Today</p>
                        <p className="font-Helvetica font-normal text-[24px]">{todayOrders.length}</p>
                    </div>
                    <div>
                        <p className="text-[#A3A3A3] text-[11px] mb-1">Avg Order Value</p>
                        <p className="font-Helvetica font-normal text-[24px]">{fmtCurrency(avgOrderValue)}</p>
                    </div>
                    <div>
                        <p className="text-[#A3A3A3] text-[11px] mb-1">Items to Fulfill</p>
                        <p className="font-Helvetica font-normal text-[24px]" style={{ color: toFulfill.length > 0 ? '#E16F3D' : 'white' }}>
                            {toFulfill.length}
                        </p>
                    </div>
                </div>
            </div>

            {/* ── B. ACTION CENTER ── */}
            <div className="bg-white border border-solid border-[#E5E5E5] rounded-[24px] px-6 py-5">
                <div className="flex items-center gap-2 mb-4">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="#E16F3D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <h4 className="font-medium text-[14px] text-black">Action Center</h4>
                </div>

                {toFulfill.length === 0 && lowStockItems.length === 0 ? (
                    <div>
                        <div className="flex items-center gap-2 mb-4 p-3 bg-[#F0FDF4] rounded-[12px]">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="#16A34A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            <span className="text-[13px] font-medium text-green-700">All caught up ✓</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <NavLink to="/admin/inventory" className="flex items-center gap-2 p-3 border border-solid border-[#E5E5E5] rounded-[12px] hover:border-orange transition-colors group">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="#E16F3D" strokeWidth="1.8" strokeLinecap="round"/></svg>
                                <span className="text-[13px] font-medium group-hover:text-orange transition-colors">Add new product</span>
                            </NavLink>
                            <NavLink to="/admin/orders" className="flex items-center gap-2 p-3 border border-solid border-[#E5E5E5] rounded-[12px] hover:border-orange transition-colors group">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18 20V10M12 20V4M6 20v-6" stroke="#E16F3D" strokeWidth="1.8" strokeLinecap="round"/></svg>
                                <span className="text-[13px] font-medium group-hover:text-orange transition-colors">View analytics</span>
                            </NavLink>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        {toFulfill.length > 0 && !dismissed.includes('fulfill') && (
                            <div className="flex items-center gap-3 p-3 rounded-[12px] border border-solid border-[#FED7AA] bg-[#FFF7ED]">
                                <div className="w-[36px] h-[36px] rounded-full bg-[#EA580C20] flex items-center justify-center flex-shrink-0">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8z" stroke="#EA580C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><circle cx="5.5" cy="18.5" r="2.5" stroke="#EA580C" strokeWidth="1.8"/><circle cx="18.5" cy="18.5" r="2.5" stroke="#EA580C" strokeWidth="1.8"/></svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-[13px]">{toFulfill.length} order{toFulfill.length > 1 ? 's' : ''} to fulfill</p>
                                    <p className="text-[11px] text-gray">Confirmed and ready to pack & ship</p>
                                </div>
                                <NavLink to="/admin/orders" className="text-[12px] font-medium text-orange hover:underline flex-shrink-0">Start fulfilling →</NavLink>
                                <button onClick={() => dismiss('fulfill')} className="text-gray hover:text-black transition-colors flex-shrink-0 ml-1">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                                </button>
                            </div>
                        )}
                        {lowStockItems.length > 0 && !dismissed.includes('restock') && (
                            <div className="flex items-center gap-3 p-3 rounded-[12px] border border-solid border-[#DDD6FE] bg-[#F5F3FF]">
                                <div className="w-[36px] h-[36px] rounded-full bg-[#7C3AED20] flex items-center justify-center flex-shrink-0">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="#7C3AED" strokeWidth="1.8" strokeLinecap="round"/></svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-[13px]">{lowStockItems.length} product{lowStockItems.length > 1 ? 's' : ''} low on stock</p>
                                    <p className="text-[11px] text-gray truncate">{lowStockItems.map(p => p.name).join(', ')}</p>
                                </div>
                                <NavLink to="/admin/inventory" className="text-[12px] font-medium text-[#7C3AED] hover:underline flex-shrink-0">Restock →</NavLink>
                                <button onClick={() => dismiss('restock')} className="text-gray hover:text-black transition-colors flex-shrink-0 ml-1">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* ── C. REVENUE LINE CHART + D. FUNNEL ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 bg-white border border-solid border-[#E5E5E5] rounded-[24px] px-6 py-6">
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <h4 className="font-Helvetica font-normal text-[18px]">Revenue</h4>
                            <p className="text-[12px] text-gray mt-1">
                                {period === 'today' ? 'Today' : `Last ${chartDays} days`}:&nbsp;
                                <span className="font-medium text-black">
                                    {fmtCurrency(currentData.reduce((s, d) => s + d.rev, 0))}
                                </span>
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1 text-[11px] text-gray">
                                <span className="inline-block w-[16px] h-[2px] rounded" style={{ backgroundColor: '#E16F3D' }}></span>
                                Current
                            </div>
                            <div className="flex items-center gap-1 text-[11px] text-gray">
                                <span className="inline-block w-[16px] h-[2px] rounded border-t-2 border-dashed border-[#D4D4D4]"></span>
                                Previous
                            </div>
                        </div>
                    </div>
                    <RevenueLineChart currentData={currentData} prevData={prevData} />
                </div>

                {/* Conversion Funnel */}
                <div className="bg-white border border-solid border-[#E5E5E5] rounded-[24px] px-6 py-6">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="font-Helvetica font-normal text-[18px]">Conversion</h4>
                        <span className="text-[12px] text-gray">{orders.length} total</span>
                    </div>
                    <ConversionFunnel orders={orders} />
                    <div className="mt-4 pt-4 border-t border-solid border-[#E5E5E5]">
                        <div className="flex items-center justify-between text-[12px]">
                            <span className="text-gray">Completion rate</span>
                            <span className="font-medium">
                                {orders.length > 0 ? Math.round((orders.filter(o => o.status === 'Completed').length / orders.length) * 100) : 0}%
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── E. ACTIVITY FEED ── */}
            <div className="bg-white border border-solid border-[#E5E5E5] rounded-[24px] px-6 py-6">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="font-Helvetica font-normal text-[18px]">Activity Feed</h4>
                    <NavLink to="/admin/orders" className="text-[12px] text-orange font-medium hover:underline">View all →</NavLink>
                </div>
                <ActivityFeed orders={orders} onFulfill={setQuickOrder} />
            </div>

            {/* ── F. OPERATIONAL WIDGETS ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Widget title="Top Products" action={<NavLink to="/admin/inventory" className="text-[12px] text-orange font-medium hover:underline">View all</NavLink>}>
                    <TopProductsWidget inventory={inventory} />
                </Widget>
                <Widget title="Top Customers" action={<NavLink to="/admin/customers" className="text-[12px] text-orange font-medium hover:underline">View all</NavLink>}>
                    <TopCustomersWidget customers={customers} />
                </Widget>
                <Widget title="Sales by Category">
                    <SalesByCategoryWidget inventory={inventory} />
                </Widget>
            </div>

            {/* ── QUICK ORDER DETAIL DRAWER ── */}
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
                            <div className="flex items-center justify-between">
                                <span className="text-[12px] font-medium px-3 py-[5px] rounded-full border border-solid"
                                    style={{ backgroundColor: (SC[quickOrder.status] || SC.Processing).bg, color: (SC[quickOrder.status] || SC.Processing).text, borderColor: (SC[quickOrder.status] || SC.Processing).border }}>
                                    {quickOrder.status}
                                </span>
                                <NavLink to="/admin/orders" className="text-[12px] font-medium text-orange hover:underline">Full details →</NavLink>
                            </div>
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
                            </div>
                            <div>
                                <p className="font-medium text-[13px] mb-2">Items</p>
                                <div className="flex flex-col gap-2">
                                    {quickOrder.items.map((item, i) => (
                                        <div key={i} className="flex items-center gap-3 p-3 border border-solid border-[#E5E5E5] rounded-[12px]">
                                            <img src={item.img} className="w-[48px] h-[48px] rounded-[8px] object-cover flex-shrink-0" alt={item.name}/>
                                            <div className="flex-1">
                                                <p className="font-medium text-[13px]">{item.name}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[11px] px-2 py-[2px] border border-solid border-[#E5E5E5] rounded-full">{item.selectedSize}</span>
                                                    <span className="text-[11px] text-gray">×{item.qty}</span>
                                                </div>
                                            </div>
                                            <p className="font-medium text-[13px]">${(parseFloat(item.price) * item.qty).toFixed(2)}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-[#F6F6F6] rounded-[16px]">
                                <span className="font-medium text-[14px]">Total</span>
                                <span className="font-semibold text-[18px]">${quickOrder.total.toFixed(2)}</span>
                            </div>
                            {quickOrder.status !== 'Completed' && quickOrder.status !== 'Cancelled' && (
                                <div>
                                    <p className="font-medium text-[13px] mb-2">Quick Update</p>
                                    <div className="grid grid-cols-2 gap-2">
                                        {['Processing', 'Shipped', 'Completed', 'Cancelled'].map(s => {
                                            const sc = SC[s]
                                            const isActive = quickOrder.status === s
                                            return (
                                                <button key={s}
                                                    onClick={() => { updateOrderStatus(quickOrder.ref, s); setQuickOrder({ ...quickOrder, status: s }) }}
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
