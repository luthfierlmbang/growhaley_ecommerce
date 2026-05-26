import React, { useState, useMemo, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdmin } from '../../context/AdminContext'

/* ── Status colors ── */
const FS_COLORS = {
    Unfulfilled:         { bg: '#FFF7ED', text: '#EA580C', border: '#FED7AA' },
    Picking:             { bg: '#FFFBEB', text: '#D97706', border: '#FDE68A' },
    Packed:              { bg: '#EFF6FF', text: '#2563EB', border: '#BFDBFE' },
    Shipped:             { bg: '#F0F9FF', text: '#0284C7', border: '#BAE6FD' },
    Delivered:           { bg: '#F0FDF4', text: '#16A34A', border: '#BBF7D0' },
    Cancelled:           { bg: '#FEF2F2', text: '#DC2626', border: '#FECACA' },
    'Partially Cancelled': { bg: '#FDF4FF', text: '#9333EA', border: '#E9D5FF' },
    Returned:            { bg: '#FDF4FF', text: '#9333EA', border: '#E9D5FF' },
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
    if (tab === 'Cancelled')            return fs === 'Cancelled' || fs === 'Returned' || fs === 'Partially Cancelled'
    return true
}

/* ── Sort arrow ── */
const SortArrow = ({ col, sortCol, sortDir }) => {
    if (sortCol !== col) return <span className="text-[#A3A3A3] ml-1">↕</span>
    return <span className="text-black ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>
}

/* ── Saved Views helpers ── */
const VIEWS_KEY = 'lux_admin_saved_views'
const DEFAULT_VIEWS = [
    { name: 'Awaiting Fulfillment', tab: 'Awaiting Fulfillment', search: '' },
    { name: 'Overdue Orders',       tab: 'All',                  search: '' },
    { name: "Today's Orders",       tab: 'All',                  search: '' },
]
const loadViews = () => {
    try {
        const raw = localStorage.getItem(VIEWS_KEY)
        if (raw) return JSON.parse(raw)
    } catch (e) {}
    localStorage.setItem(VIEWS_KEY, JSON.stringify(DEFAULT_VIEWS))
    return DEFAULT_VIEWS
}
const saveViews = (views) => {
    try { localStorage.setItem(VIEWS_KEY, JSON.stringify(views)) } catch (e) {}
}

/* ── Column visibility helpers ── */
const COLS_KEY = 'lux_admin_col_visibility'
const DEFAULT_COLS = { Items: true, SLA: true, Courier: true, 'Payment Status': true }
const loadCols = () => {
    try {
        const raw = localStorage.getItem(COLS_KEY)
        if (raw) return JSON.parse(raw)
    } catch (e) {}
    return DEFAULT_COLS
}
const saveCols = (cols) => {
    try { localStorage.setItem(COLS_KEY, JSON.stringify(cols)) } catch (e) {}
}

/* ── SaveViewModal ── */
const SaveViewModal = ({ tab, search, onClose, onSave }) => {
    const [name, setName] = useState('')
    return (
        <div className="fixed inset-0 z-[500] flex items-center justify-center px-4" style={{ backgroundColor: 'rgba(23,23,23,0.5)', backdropFilter: 'blur(4px)' }}>
            <div className="bg-white rounded-[20px] w-full max-w-[380px] shadow-2xl">
                <div className="px-5 py-4 border-b border-solid border-[#E5E5E5] flex items-center justify-between">
                    <h4 className="font-medium text-[16px]">Save View</h4>
                    <button onClick={onClose} className="text-gray hover:text-black">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                    </button>
                </div>
                <div className="px-5 py-4 flex flex-col gap-4">
                    <div>
                        <label className="block text-[12px] font-medium text-gray mb-1">View Name</label>
                        <input autoFocus value={name} onChange={e => setName(e.target.value)}
                            placeholder="e.g. High Priority"
                            className="w-full h-[44px] px-4 border border-solid border-[#E5E5E5] rounded-[10px] text-[14px] outline-none focus:border-black transition-colors" />
                    </div>
                    <div className="p-3 bg-[#F6F6F6] rounded-[10px] text-[12px] text-gray flex flex-col gap-1">
                        <p><span className="font-medium text-black">Tab:</span> {tab}</p>
                        {search && <p><span className="font-medium text-black">Search:</span> "{search}"</p>}
                    </div>
                    <div className="flex gap-2">
                        <button onClick={onClose} className="flex-1 h-[40px] border border-solid border-[#E5E5E5] rounded-full text-[13px] font-medium hover:border-black transition-colors">Cancel</button>
                        <button onClick={() => name.trim() && onSave(name.trim())} disabled={!name.trim()}
                            className="flex-1 h-[40px] bg-black text-white rounded-full text-[13px] font-medium hover:bg-orange transition-colors disabled:opacity-40">
                            Save View
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

/* ── Advanced Filters Panel ── */
const AdvancedFilters = ({ filters, onChange, onApply, onReset }) => {
    const [local, setLocal] = useState(filters)
    const set = (key, val) => setLocal(p => ({ ...p, [key]: val }))
    const toggleArr = (key, val) => setLocal(p => {
        const arr = p[key] || []
        return { ...p, [key]: arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val] }
    })
    return (
        <div className="absolute right-0 top-[calc(100%+8px)] z-[200] bg-white border border-solid border-[#E5E5E5] rounded-[20px] shadow-2xl w-[340px] p-5 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-[11px] font-medium text-gray mb-1">Date From</label>
                    <input type="date" value={local.dateFrom || ''} onChange={e => set('dateFrom', e.target.value)}
                        className="w-full h-[38px] px-3 border border-solid border-[#E5E5E5] rounded-[8px] text-[12px] outline-none focus:border-black transition-colors" />
                </div>
                <div>
                    <label className="block text-[11px] font-medium text-gray mb-1">Date To</label>
                    <input type="date" value={local.dateTo || ''} onChange={e => set('dateTo', e.target.value)}
                        className="w-full h-[38px] px-3 border border-solid border-[#E5E5E5] rounded-[8px] text-[12px] outline-none focus:border-black transition-colors" />
                </div>
            </div>
            <div>
                <label className="block text-[11px] font-medium text-gray mb-2">Courier</label>
                <div className="flex gap-2 flex-wrap">
                    {['DHL','FedEx','UPS'].map(c => (
                        <label key={c} className={`flex items-center gap-2 px-3 py-[6px] rounded-full border border-solid cursor-pointer text-[12px] font-medium transition-colors ` + ((local.couriers || []).includes(c) ? 'bg-black text-white border-black' : 'border-[#E5E5E5] text-gray hover:border-black hover:text-black')}>
                            <input type="checkbox" className="hidden" checked={(local.couriers || []).includes(c)} onChange={() => toggleArr('couriers', c)} />
                            {c}
                        </label>
                    ))}
                </div>
            </div>
            <div>
                <label className="block text-[11px] font-medium text-gray mb-2">Payment Method</label>
                <div className="flex gap-2 flex-wrap">
                    {['PayPal','Apple Pay','Credit Card'].map(m => (
                        <label key={m} className={`flex items-center gap-2 px-3 py-[6px] rounded-full border border-solid cursor-pointer text-[12px] font-medium transition-colors ` + ((local.paymentMethods || []).includes(m) ? 'bg-black text-white border-black' : 'border-[#E5E5E5] text-gray hover:border-black hover:text-black')}>
                            <input type="checkbox" className="hidden" checked={(local.paymentMethods || []).includes(m)} onChange={() => toggleArr('paymentMethods', m)} />
                            {m}
                        </label>
                    ))}
                </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-[11px] font-medium text-gray mb-1">Min Total ($)</label>
                    <input type="number" value={local.minTotal || ''} onChange={e => set('minTotal', e.target.value)} placeholder="0"
                        className="w-full h-[38px] px-3 border border-solid border-[#E5E5E5] rounded-[8px] text-[12px] outline-none focus:border-black transition-colors" />
                </div>
                <div>
                    <label className="block text-[11px] font-medium text-gray mb-1">Max Total ($)</label>
                    <input type="number" value={local.maxTotal || ''} onChange={e => set('maxTotal', e.target.value)} placeholder="∞"
                        className="w-full h-[38px] px-3 border border-solid border-[#E5E5E5] rounded-[8px] text-[12px] outline-none focus:border-black transition-colors" />
                </div>
            </div>
            <div>
                <label className="block text-[11px] font-medium text-gray mb-2">Payment Status</label>
                <div className="flex gap-2 flex-wrap">
                    {['Paid','Pending','Refunded'].map(s => (
                        <label key={s} className={`flex items-center gap-2 px-3 py-[6px] rounded-full border border-solid cursor-pointer text-[12px] font-medium transition-colors ` + ((local.paymentStatuses || []).includes(s) ? 'bg-black text-white border-black' : 'border-[#E5E5E5] text-gray hover:border-black hover:text-black')}>
                            <input type="checkbox" className="hidden" checked={(local.paymentStatuses || []).includes(s)} onChange={() => toggleArr('paymentStatuses', s)} />
                            {s}
                        </label>
                    ))}
                </div>
            </div>
            <div className="flex gap-2 pt-1 border-t border-solid border-[#E5E5E5]">
                <button onClick={() => { setLocal({}); onReset() }} className="flex-1 h-[38px] border border-solid border-[#E5E5E5] rounded-full text-[12px] font-medium hover:border-black transition-colors">Reset</button>
                <button onClick={() => onApply(local)} className="flex-1 h-[38px] bg-black text-white rounded-full text-[12px] font-medium hover:bg-orange transition-colors">Apply Filters</button>
            </div>
        </div>
    )
}

/* ── Count active advanced filters ── */
const countActiveFilters = (f) => {
    let n = 0
    if (f.dateFrom) n++
    if (f.dateTo) n++
    if ((f.couriers || []).length) n++
    if ((f.paymentMethods || []).length) n++
    if (f.minTotal) n++
    if (f.maxTotal) n++
    if ((f.paymentStatuses || []).length) n++
    return n
}

/* ── Apply advanced filters to list ── */
const applyAdvancedFilters = (list, f) => {
    return list.filter(o => {
        if (f.dateFrom && new Date(o.date) < new Date(f.dateFrom)) return false
        if (f.dateTo && new Date(o.date) > new Date(f.dateTo + 'T23:59:59')) return false
        if ((f.couriers || []).length && !f.couriers.includes(o.shippingMethod)) return false
        if ((f.paymentMethods || []).length && !f.paymentMethods.includes(o.paymentMethod)) return false
        if (f.minTotal && o.total < parseFloat(f.minTotal)) return false
        if (f.maxTotal && o.total > parseFloat(f.maxTotal)) return false
        if ((f.paymentStatuses || []).length && !f.paymentStatuses.includes(o.paymentStatus)) return false
        return true
    })
}

/* ── Column visibility dropdown ── */
const TOGGLEABLE_COLS = ['Items', 'SLA', 'Courier', 'Payment Status']
const ColVisibilityDropdown = ({ cols, onChange }) => (
    <div className="absolute right-0 top-[calc(100%+8px)] z-[200] bg-white border border-solid border-[#E5E5E5] rounded-[16px] shadow-2xl w-[200px] p-3 flex flex-col gap-1">
        <p className="text-[11px] font-medium text-gray px-2 mb-1">Toggle Columns</p>
        {TOGGLEABLE_COLS.map(col => (
            <label key={col} className="flex items-center gap-3 px-2 py-2 rounded-[8px] hover:bg-[#F6F6F6] cursor-pointer">
                <div onClick={() => onChange(col)} className={`w-[18px] h-[18px] rounded-[4px] border-2 border-solid flex items-center justify-center flex-shrink-0 transition-all ` + (cols[col] ? 'bg-orange border-orange' : 'border-[#E5E5E5]')}>
                    {cols[col] && <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
                <span className="text-[13px] font-medium">{col}</span>
            </label>
        ))}
    </div>
)

/* ── Pagination ── */
const Pagination = ({ total, page, perPage, onPage, onPerPage }) => {
    const totalPages = Math.ceil(total / perPage)
    if (totalPages <= 1 && total <= perPage) return (
        <div className="flex items-center justify-between px-6 py-3 border-t border-solid border-[#E5E5E5]">
            <span className="text-[12px] text-gray">Showing {total} of {total} orders</span>
            <div className="flex items-center gap-2">
                <span className="text-[12px] text-gray">Show</span>
                {[10,25,50].map(n => (
                    <button key={n} onClick={() => onPerPage(n)} className={`text-[12px] px-2 py-1 rounded-[6px] font-medium transition-colors ` + (perPage === n ? 'bg-orange text-white' : 'text-gray hover:text-black')}>{n}</button>
                ))}
            </div>
        </div>
    )
    const start = (page - 1) * perPage + 1
    const end = Math.min(page * perPage, total)
    const pages = []
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) pages.push(i)
        else if (pages[pages.length - 1] !== '...') pages.push('...')
    }
    return (
        <div className="flex items-center justify-between px-6 py-3 border-t border-solid border-[#E5E5E5] flex-wrap gap-3">
            <span className="text-[12px] text-gray">Showing {start}–{end} of {total} orders</span>
            <div className="flex items-center gap-1">
                <button onClick={() => onPage(page - 1)} disabled={page === 1}
                    className="h-[32px] px-3 rounded-[8px] text-[12px] font-medium border border-solid border-[#E5E5E5] hover:border-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed">Prev</button>
                {pages.map((p, i) => p === '...'
                    ? <span key={`e${i}`} className="px-2 text-gray text-[12px]">…</span>
                    : <button key={p} onClick={() => onPage(p)}
                        className={`w-[32px] h-[32px] rounded-[8px] text-[12px] font-medium border border-solid transition-colors ` + (p === page ? 'bg-orange text-white border-orange' : 'border-[#E5E5E5] hover:border-black')}>{p}</button>
                )}
                <button onClick={() => onPage(page + 1)} disabled={page === totalPages}
                    className="h-[32px] px-3 rounded-[8px] text-[12px] font-medium border border-solid border-[#E5E5E5] hover:border-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed">Next</button>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-[12px] text-gray">Show</span>
                {[10,25,50].map(n => (
                    <button key={n} onClick={() => { onPerPage(n); onPage(1) }} className={`text-[12px] px-2 py-1 rounded-[6px] font-medium transition-colors ` + (perPage === n ? 'bg-orange text-white' : 'text-gray hover:text-black')}>{n}</button>
                ))}
            </div>
        </div>
    )
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
    const [page, setPage]         = useState(1)
    const [perPage, setPerPage]   = useState(10)

    // Saved views
    const [savedViews, setSavedViews] = useState(loadViews)
    const [showSaveModal, setShowSaveModal] = useState(false)

    // Advanced filters
    const [advFilters, setAdvFilters] = useState({})
    const [appliedFilters, setAppliedFilters] = useState({})
    const [showFilters, setShowFilters] = useState(false)
    const filtersRef = useRef(null)

    // Column visibility
    const [colVis, setColVis] = useState(loadCols)
    const [showColMenu, setShowColMenu] = useState(false)
    const colMenuRef = useRef(null)

    // Close dropdowns on outside click
    useEffect(() => {
        const handler = (e) => {
            if (filtersRef.current && !filtersRef.current.contains(e.target)) setShowFilters(false)
            if (colMenuRef.current && !colMenuRef.current.contains(e.target)) setShowColMenu(false)
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    const activeFilterCount = countActiveFilters(appliedFilters)
    const hasAnyFilter = activeFilterCount > 0 || search.trim() || tab !== 'All'

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
        list = applyAdvancedFilters(list, appliedFilters)
        list = [...list].sort((a, b) => {
            let va, vb
            if (sortCol === 'date')  { va = new Date(a.date).getTime(); vb = new Date(b.date).getTime() }
            if (sortCol === 'total') { va = a.total; vb = b.total }
            if (sortCol === 'sla')   { va = a.slaHours || 0; vb = b.slaHours || 0 }
            if (va === undefined)    return 0
            return sortDir === 'asc' ? va - vb : vb - va
        })
        return list
    }, [orders, tab, search, sortCol, sortDir, appliedFilters])

    // Reset to page 1 when filters change
    useEffect(() => { setPage(1) }, [tab, search, appliedFilters])

    const paginated = useMemo(() => {
        const start = (page - 1) * perPage
        return filtered.slice(start, start + perPage)
    }, [filtered, page, perPage])

    const toggleSort = (col) => {
        if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
        else { setSortCol(col); setSortDir('desc') }
    }

    /* ── Bulk select ── */
    const allSelected = paginated.length > 0 && paginated.every(o => selected.has(o.ref))
    const toggleAll = () => {
        if (allSelected) setSelected(new Set())
        else setSelected(new Set(paginated.map(o => o.ref)))
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

    /* ── Saved views handlers ── */
    const handleSaveView = (name) => {
        if (savedViews.length >= 5) return
        const newViews = [...savedViews, { name, tab, search }]
        setSavedViews(newViews)
        saveViews(newViews)
        setShowSaveModal(false)
    }
    const handleDeleteView = (idx) => {
        const newViews = savedViews.filter((_, i) => i !== idx)
        setSavedViews(newViews)
        saveViews(newViews)
    }
    const handleApplyView = (view) => {
        setTab(view.tab)
        setSearch(view.search || '')
    }

    /* ── Column visibility toggle ── */
    const toggleCol = (col) => {
        const next = { ...colVis, [col]: !colVis[col] }
        setColVis(next)
        saveCols(next)
    }

    /* ── Clear all filters ── */
    const clearAllFilters = () => {
        setTab('All')
        setSearch('')
        setAppliedFilters({})
        setAdvFilters({})
    }

    return (
        <div>
            {showSaveModal && (
                <SaveViewModal tab={tab} search={search}
                    onClose={() => setShowSaveModal(false)}
                    onSave={handleSaveView} />
            )}

            <div className="mb-6">
                <h1 className="font-Helvetica font-normal text-[32px] text-black">Orders</h1>
                <p className="text-gray text-[14px] mt-1">{orders.length} total orders</p>
            </div>

            {/* Filter tabs + Save View */}
            <div className="bg-white border border-solid border-[#E5E5E5] rounded-[24px] px-6 pt-4 pb-0 mb-2">
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1 overflow-x-auto flex-1">
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
                    <button onClick={() => setShowSaveModal(true)} disabled={savedViews.length >= 5}
                        className="flex-shrink-0 h-[34px] px-4 mb-2 rounded-full border border-solid border-[#E5E5E5] text-[12px] font-medium hover:border-black transition-colors flex items-center gap-1 disabled:opacity-40">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                        Save View
                    </button>
                </div>
            </div>

            {/* Saved view chips */}
            {savedViews.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap mb-3 px-1">
                    {savedViews.map((v, i) => (
                        <div key={i} className="flex items-center gap-1 bg-white border border-solid border-[#E5E5E5] rounded-full px-3 py-[5px] text-[12px] font-medium hover:border-black transition-colors">
                            <button onClick={() => handleApplyView(v)} className="text-black">{v.name}</button>
                            <button onClick={() => handleDeleteView(i)} className="text-gray hover:text-red-500 transition-colors ml-1">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Search + Filters */}
            <div className="bg-white border border-solid border-[#E5E5E5] rounded-[24px] px-6 py-4 mb-4 flex items-center gap-3 flex-wrap">
                <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by ref, customer, or email..."
                    className="h-[48px] px-4 border border-solid border-[#E5E5E5] rounded-full text-[14px] outline-none focus:border-black transition-colors flex-1 min-w-[200px] sm:max-w-[320px]" />
                <div className="relative" ref={filtersRef}>
                    <button onClick={() => setShowFilters(p => !p)}
                        className={`h-[48px] px-5 rounded-full border border-solid text-[13px] font-medium flex items-center gap-2 transition-colors ` + (activeFilterCount > 0 ? 'border-orange text-orange bg-[#FFF7ED]' : 'border-[#E5E5E5] hover:border-black')}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        {activeFilterCount > 0 ? `Filters (${activeFilterCount})` : 'Filters ▾'}
                    </button>
                    {showFilters && (
                        <AdvancedFilters
                            filters={advFilters}
                            onChange={setAdvFilters}
                            onApply={(f) => { setAppliedFilters(f); setAdvFilters(f); setShowFilters(false) }}
                            onReset={() => { setAppliedFilters({}); setAdvFilters({}); setShowFilters(false) }}
                        />
                    )}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-solid border-[#E5E5E5] rounded-[24px] overflow-hidden">
                {/* Column toggle button */}
                <div className="flex items-center justify-end px-6 pt-4 pb-2">
                    <div className="relative" ref={colMenuRef}>
                        <button onClick={() => setShowColMenu(p => !p)}
                            className="h-[34px] px-4 rounded-full border border-solid border-[#E5E5E5] text-[12px] font-medium hover:border-black transition-colors flex items-center gap-1">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zM12 8v4M12 16h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                            Columns ⚙
                        </button>
                        {showColMenu && <ColVisibilityDropdown cols={colVis} onChange={toggleCol} />}
                    </div>
                </div>

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
                                {colVis['Items'] && <th className="text-left text-gray font-medium px-4 py-3">Items</th>}
                                <th className="text-left text-gray font-medium px-4 py-3 cursor-pointer select-none hover:text-black" onClick={() => toggleSort('date')}>
                                    Date <SortArrow col="date" sortCol={sortCol} sortDir={sortDir} />
                                </th>
                                {colVis['SLA'] && <th className="text-left text-gray font-medium px-4 py-3 cursor-pointer select-none hover:text-black" onClick={() => toggleSort('sla')}>
                                    SLA <SortArrow col="sla" sortCol={sortCol} sortDir={sortDir} />
                                </th>}
                                {colVis['Courier'] && <th className="text-left text-gray font-medium px-4 py-3">Courier</th>}
                                <th className="text-right text-gray font-medium px-4 py-3 cursor-pointer select-none hover:text-black" onClick={() => toggleSort('total')}>
                                    Total <SortArrow col="total" sortCol={sortCol} sortDir={sortDir} />
                                </th>
                                <th className="text-center text-gray font-medium px-4 py-3">Status</th>
                                {colVis['Payment Status'] && <th className="text-center text-gray font-medium px-4 py-3">Payment</th>}
                                <th className="text-center text-gray font-medium px-4 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginated.map(order => {
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
                                        {colVis['Items'] && <td className="px-4 py-4">
                                            <div className="flex -space-x-2">
                                                {order.items.slice(0, 3).map((item, i) => (
                                                    <img key={i} src={item.img} className="w-[32px] h-[32px] rounded-[6px] object-cover border-2 border-white" alt={item.name} />
                                                ))}
                                            </div>
                                            <p className="text-[11px] text-gray mt-1">{order.items.length} item{order.items.length > 1 ? 's' : ''}</p>
                                        </td>}
                                        <td className="px-4 py-4 text-gray">{fmtDate(order.date)}</td>
                                        {colVis['SLA'] && <td className="px-4 py-4"><SlaBadge order={order} /></td>}
                                        {colVis['Courier'] && <td className="px-4 py-4 text-gray">{order.shippingMethod}</td>}
                                        <td className="px-4 py-4 text-right font-medium">${order.total.toFixed(2)}</td>
                                        <td className="px-4 py-4 text-center">
                                            <span className="inline-block text-[11px] font-medium px-3 py-[4px] rounded-full border border-solid" style={{ backgroundColor: fsColor.bg, color: fsColor.text, borderColor: fsColor.border }}>
                                                {order.fulfillmentStatus}
                                            </span>
                                        </td>
                                        {colVis['Payment Status'] && <td className="px-4 py-4 text-center">
                                            <span className="text-[11px] text-gray">{order.paymentStatus}</span>
                                        </td>}
                                        <td className="px-4 py-4 text-center" onClick={e => e.stopPropagation()}>
                                            <button onClick={() => navigate('/admin/orders/' + order.ref)}
                                                className="text-[12px] font-medium text-orange hover:underline">View Details</button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>

                    {/* Empty states */}
                    {filtered.length === 0 && orders.length > 0 && (
                        <div className="flex flex-col items-center justify-center py-16 gap-4">
                            <div className="w-[64px] h-[64px] rounded-full bg-[#F6F6F6] flex items-center justify-center">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" stroke="#A3A3A3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            </div>
                            <div className="text-center">
                                <p className="font-medium text-[16px] text-black mb-1">No orders match your filters</p>
                                <p className="text-gray text-[13px]">Try adjusting your search or filter criteria</p>
                            </div>
                            {hasAnyFilter && (
                                <button onClick={clearAllFilters} className="h-[40px] px-6 rounded-full border border-solid border-[#E5E5E5] text-[13px] font-medium hover:border-black transition-colors">
                                    Clear all filters
                                </button>
                            )}
                        </div>
                    )}
                    {orders.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-16 gap-4">
                            <div className="w-[64px] h-[64px] rounded-full bg-[#F6F6F6] flex items-center justify-center">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="#A3A3A3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 6h18M16 10a4 4 0 01-8 0" stroke="#A3A3A3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            </div>
                            <div className="text-center">
                                <p className="font-medium text-[16px] text-black mb-1">No orders yet</p>
                                <p className="text-gray text-[13px]">Share your store to get your first sale</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {filtered.length > 0 && (
                    <Pagination total={filtered.length} page={page} perPage={perPage} onPage={setPage} onPerPage={setPerPage} />
                )}
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
