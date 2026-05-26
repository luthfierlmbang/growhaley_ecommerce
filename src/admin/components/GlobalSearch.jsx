import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdmin } from '../../context/AdminContext'

const GlobalSearch = ({ isOpen, onClose }) => {
    const { orders, inventory, customers } = useAdmin()
    const navigate = useNavigate()
    const [query, setQuery] = useState('')
    const [activeIdx, setActiveIdx] = useState(0)
    const inputRef = useRef(null)
    const listRef = useRef(null)

    /* ── Focus input when opened ── */
    useEffect(() => {
        if (isOpen) {
            setQuery('')
            setActiveIdx(0)
            setTimeout(() => inputRef.current?.focus(), 50)
        }
    }, [isOpen])

    /* ── Build results ── */
    const results = useCallback(() => {
        if (!query.trim()) return []
        const q = query.toLowerCase()
        const orderResults = orders
            .filter(o => o.ref.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q))
            .slice(0, 4)
            .map(o => ({ type: 'order', id: o.ref, title: o.ref, sub: `${o.customer} · $${o.total.toFixed(2)} · ${o.status}`, to: '/admin/orders' }))
        const productResults = inventory
            .filter(p => p.name.toLowerCase().includes(q))
            .slice(0, 4)
            .map(p => ({ type: 'product', id: p.id, title: p.name, sub: `${p.category} · $${p.price} · ${p.stock} in stock`, to: '/admin/inventory' }))
        const customerResults = (customers || [])
            .filter(c => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q))
            .slice(0, 4)
            .map(c => ({ type: 'customer', id: c.id, title: c.name, sub: `${c.email} · ${c.orders} orders`, to: '/admin/customers' }))
        return [
            ...(orderResults.length ? [{ isGroup: true, label: 'Orders' }, ...orderResults] : []),
            ...(productResults.length ? [{ isGroup: true, label: 'Products' }, ...productResults] : []),
            ...(customerResults.length ? [{ isGroup: true, label: 'Customers' }, ...customerResults] : []),
        ]
    }, [query, orders, inventory, customers])

    const flat = results()
    const items = flat.filter(r => !r.isGroup)

    /* ── Keyboard navigation ── */
    useEffect(() => { setActiveIdx(0) }, [query])

    const handleKey = (e) => {
        if (e.key === 'Escape') { onClose(); return }
        if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, items.length - 1)) }
        if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, 0)) }
        if (e.key === 'Enter' && items[activeIdx]) {
            navigate(items[activeIdx].to)
            onClose()
        }
    }

    const handleSelect = (item) => {
        navigate(item.to)
        onClose()
    }

    /* ── Icon per type ── */
    const TypeIcon = ({ type }) => {
        if (type === 'order') return (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
        )
        if (type === 'product') return (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
        )
        return (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.8"/></svg>
        )
    }

    if (!isOpen) return null

    let itemCounter = -1

    return (
        <div
            className="fixed inset-0 z-[500] flex items-start justify-center pt-[10vh]"
            style={{ backgroundColor: 'rgba(23,23,23,0.5)', backdropFilter: 'blur(4px)' }}
            onClick={onClose}
        >
            <div
                className="w-full max-w-[560px] mx-4 bg-white rounded-[20px] shadow-2xl overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                {/* Search input */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-solid border-[#E5E5E5]">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-gray flex-shrink-0">
                        <circle cx="11" cy="11" r="8" stroke="#525252" strokeWidth="1.8"/>
                        <path d="M21 21l-4.35-4.35" stroke="#525252" strokeWidth="1.8" strokeLinecap="round"/>
                    </svg>
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        onKeyDown={handleKey}
                        placeholder="Search orders, products, customers…"
                        className="flex-1 text-[14px] outline-none bg-transparent text-black placeholder-[#A3A3A3]"
                    />
                    <kbd className="text-[11px] text-gray bg-[#F6F6F6] border border-solid border-[#E5E5E5] rounded-[6px] px-2 py-[2px] flex-shrink-0">ESC</kbd>
                </div>

                {/* Results */}
                <div ref={listRef} className="max-h-[400px] overflow-y-auto">
                    {query.trim() === '' && (
                        <div className="px-4 py-8 text-center">
                            <p className="text-[13px] text-gray">Type to search orders, products, or customers</p>
                            <div className="flex items-center justify-center gap-4 mt-3">
                                <span className="text-[11px] text-gray flex items-center gap-1">
                                    <kbd className="bg-[#F6F6F6] border border-solid border-[#E5E5E5] rounded-[4px] px-1">↑↓</kbd> navigate
                                </span>
                                <span className="text-[11px] text-gray flex items-center gap-1">
                                    <kbd className="bg-[#F6F6F6] border border-solid border-[#E5E5E5] rounded-[4px] px-1">↵</kbd> select
                                </span>
                            </div>
                        </div>
                    )}

                    {query.trim() !== '' && flat.length === 0 && (
                        <div className="px-4 py-8 text-center">
                            <p className="text-[13px] text-gray">No results for "<span className="text-black">{query}</span>"</p>
                        </div>
                    )}

                    {flat.map((item, i) => {
                        if (item.isGroup) {
                            return (
                                <div key={`group-${item.label}`} className="px-4 pt-3 pb-1">
                                    <p className="text-[10px] font-semibold text-gray uppercase tracking-wider">{item.label}</p>
                                </div>
                            )
                        }
                        itemCounter++
                        const idx = itemCounter
                        const isActive = idx === activeIdx
                        return (
                            <button
                                key={`${item.type}-${item.id}`}
                                onClick={() => handleSelect(item)}
                                onMouseEnter={() => setActiveIdx(idx)}
                                className="w-full flex items-center gap-3 px-4 py-[10px] text-left transition-colors"
                                style={{ backgroundColor: isActive ? '#FFF7ED' : 'transparent' }}
                            >
                                <div
                                    className="w-[30px] h-[30px] rounded-full flex items-center justify-center flex-shrink-0"
                                    style={{ backgroundColor: isActive ? '#E16F3D20' : '#F6F6F6', color: isActive ? '#E16F3D' : '#525252' }}
                                >
                                    <TypeIcon type={item.type} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[13px] font-medium text-black truncate">{item.title}</p>
                                    <p className="text-[11px] text-gray truncate">{item.sub}</p>
                                </div>
                                {isActive && (
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
                                        <path d="M9 18l6-6-6-6" stroke="#E16F3D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                )}
                            </button>
                        )
                    })}
                </div>

                {/* Footer */}
                {flat.length > 0 && (
                    <div className="px-4 py-2 border-t border-solid border-[#E5E5E5] flex items-center justify-between">
                        <span className="text-[11px] text-gray">{items.length} result{items.length !== 1 ? 's' : ''}</span>
                        <span className="text-[11px] text-gray">Press ↵ to open</span>
                    </div>
                )}
            </div>
        </div>
    )
}

export default GlobalSearch
