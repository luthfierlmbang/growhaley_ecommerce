import React, { useState, useCallback, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAdmin } from '../../context/AdminContext'
import PrintPreview from '../components/PrintPreview'

/* ── Helpers ── */
const fmtDate = (d) => new Date(d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
const fmtShort = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

const relativeTime = (iso) => {
    const diff = Date.now() - new Date(iso).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1)   return 'just now'
    if (mins < 60)  return `${mins} min ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24)   return `${hrs} hr ago`
    const days = Math.floor(hrs / 24)
    if (days === 1) return 'Yesterday'
    return `${days} days ago`
}

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
const PS_COLORS = {
    Paid:                 { bg: '#F0FDF4', text: '#16A34A', border: '#BBF7D0' },
    Pending:              { bg: '#FFF7ED', text: '#EA580C', border: '#FED7AA' },
    Refunded:             { bg: '#F0F9FF', text: '#0284C7', border: '#BAE6FD' },
    'Partially Refunded': { bg: '#FDF4FF', text: '#9333EA', border: '#E9D5FF' },
}

const EVENT_ICONS = {
    order_placed:        { color: '#16A34A', icon: '🛍' },
    payment_received:    { color: '#0284C7', icon: '💳' },
    fulfillment_started: { color: '#D97706', icon: '📦' },
    item_picked:         { color: '#D97706', icon: '✅' },
    packed:              { color: '#2563EB', icon: '📫' },
    tracking_added:      { color: '#0284C7', icon: '🔢' },
    shipped:             { color: '#0284C7', icon: '🚚' },
    delivered:           { color: '#16A34A', icon: '🏠' },
    cancelled:           { color: '#DC2626', icon: '❌' },
    note_added:          { color: '#525252', icon: '📝' },
    customer_notified:   { color: '#9333EA', icon: '✉️' },
}

const EVENT_LABELS = {
    order_placed:        'Order placed',
    payment_received:    'Payment received',
    fulfillment_started: 'Fulfillment started',
    item_picked:         'Item picked',
    packed:              'Order packed',
    tracking_added:      'Tracking number added',
    shipped:             'Order shipped',
    delivered:           'Order delivered',
    cancelled:           'Order cancelled',
    note_added:          'Note added',
    customer_notified:   'Customer notified',
}

/* ── Toast ── */
const Toast = ({ toasts }) => (
    <div className="fixed bottom-6 right-6 z-[600] flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => (
            <div key={t.id} className={`flex items-center gap-3 px-5 py-3 rounded-[14px] shadow-2xl text-white text-[13px] font-medium animate-fade-in ` + (t.type === 'error' ? 'bg-red-500' : 'bg-[#16A34A]')}>
                {t.type === 'error'
                    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
                    : <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                {t.message}
            </div>
        ))}
    </div>
)

/* ── useToast hook ── */
const useToast = () => {
    const [toasts, setToasts] = useState([])
    const show = useCallback((message, type = 'success') => {
        const id = Date.now()
        setToasts(p => [...p, { id, message, type }])
        setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3000)
    }, [])
    return { toasts, show }
}

/* ── Modal: Start Fulfillment ── */
const StartFulfillmentModal = ({ order, onClose, onConfirm }) => {
    const [checked, setChecked] = useState({})
    const allChecked = order.items.every((_, i) => checked[i])
    const toggle = (i) => setChecked(p => ({ ...p, [i]: !p[i] }))
    return (
        <div className="fixed inset-0 z-[400] flex items-center justify-center px-4" style={{ backgroundColor: 'rgba(23,23,23,0.6)' }}>
            <div className="bg-white rounded-[24px] w-full max-w-[520px] max-h-[90vh] overflow-y-auto">
                <div className="px-6 py-5 border-b border-solid border-[#E5E5E5] flex items-center justify-between">
                    <div>
                        <h4 className="font-Helvetica font-normal text-[20px]">Start Fulfillment</h4>
                        <p className="text-gray text-[13px]">Check off each item as you pick it</p>
                    </div>
                    <button onClick={onClose} className="text-gray hover:text-black transition-colors">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                    </button>
                </div>
                <div className="px-6 py-5 flex flex-col gap-3">
                    {order.items.map((item, i) => (
                        <label key={i} onClick={() => toggle(i)} className={`flex items-center gap-4 p-4 rounded-[16px] border border-solid cursor-pointer transition-all ` + (checked[i] ? 'border-orange bg-[#FFF7ED]' : 'border-[#E5E5E5] hover:border-[#A3A3A3]')}>
                            <div className={`w-[22px] h-[22px] rounded-[6px] border-2 border-solid flex items-center justify-center flex-shrink-0 transition-all ` + (checked[i] ? 'bg-orange border-orange' : 'border-[#E5E5E5]')}>
                                {checked[i] && <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                            </div>
                            <img src={item.img} className="w-[48px] h-[48px] rounded-[10px] object-cover flex-shrink-0" alt={item.name} />
                            <div className="flex-1">
                                <p className="font-medium text-[14px]">{item.name}</p>
                                <p className="text-gray text-[12px]">Size {item.selectedSize} · Color {item.colorName} · Qty {item.qty}</p>
                            </div>
                        </label>
                    ))}
                    <div className="flex gap-3 mt-2">
                        <button onClick={onClose} className="flex-1 h-[48px] border border-solid border-[#E5E5E5] rounded-full text-[14px] font-medium hover:border-black transition-colors">Cancel</button>
                        <button onClick={() => allChecked && onConfirm()} disabled={!allChecked}
                            className="flex-1 h-[48px] bg-orange text-white rounded-full text-[14px] font-medium hover:bg-[#c85e2e] transition-colors disabled:opacity-40">
                            Confirm Picked
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

/* ── Modal: Mark as Packed ── */
const MarkPackedModal = ({ order, onClose, onConfirm }) => {
    const [weight, setWeight]             = useState('')
    const [boxSize, setBoxSize]           = useState('Medium')
    const [packingNotes, setPackingNotes] = useState('')
    const valid = weight.trim() !== ''
    return (
        <div className="fixed inset-0 z-[400] flex items-center justify-center px-4" style={{ backgroundColor: 'rgba(23,23,23,0.6)' }}>
            <div className="bg-white rounded-[24px] w-full max-w-[480px]">
                <div className="px-6 py-5 border-b border-solid border-[#E5E5E5] flex items-center justify-between">
                    <div>
                        <h4 className="font-Helvetica font-normal text-[20px]">Mark as Packed</h4>
                        <p className="text-gray text-[13px]">{order.ref}</p>
                    </div>
                    <button onClick={onClose} className="text-gray hover:text-black transition-colors">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                    </button>
                </div>
                <div className="px-6 py-5 flex flex-col gap-4">
                    <div>
                        <label className="block font-medium text-[13px] mb-2">Weight (kg) *</label>
                        <input type="text" value={weight} onChange={e => setWeight(e.target.value)} placeholder="e.g. 1.2"
                            className="w-full h-[48px] px-4 border border-solid border-[#E5E5E5] rounded-[8px] text-[14px] outline-none focus:border-black transition-colors" />
                    </div>
                    <div>
                        <label className="block font-medium text-[13px] mb-2">Box Size</label>
                        <select value={boxSize} onChange={e => setBoxSize(e.target.value)}
                            className="w-full h-[48px] px-4 border border-solid border-[#E5E5E5] rounded-[8px] text-[14px] outline-none focus:border-black transition-colors bg-white">
                            {['Small','Medium','Large','Extra Large'].map(s => <option key={s}>{s}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block font-medium text-[13px] mb-2">Packing Notes</label>
                        <textarea value={packingNotes} onChange={e => setPackingNotes(e.target.value)} placeholder="e.g. Fragile, handle with care..."
                            className="w-full px-4 py-3 border border-solid border-[#E5E5E5] rounded-[8px] text-[14px] outline-none focus:border-black transition-colors min-h-[80px] resize-none" />
                    </div>
                    <div className="flex gap-3">
                        <button onClick={onClose} className="flex-1 h-[48px] border border-solid border-[#E5E5E5] rounded-full text-[14px] font-medium hover:border-black transition-colors">Cancel</button>
                        <button onClick={() => valid && onConfirm({ weight: weight + ' kg', boxSize, packingNotes })} disabled={!valid}
                            className="flex-1 h-[48px] bg-orange text-white rounded-full text-[14px] font-medium hover:bg-[#c85e2e] transition-colors disabled:opacity-40">
                            Confirm Packed
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

/* ── Modal: Ship Order ── */
const ShipOrderModal = ({ order, onClose, onConfirm }) => {
    const [trackingNumber, setTrackingNumber] = useState('')
    const [courier, setCourier]               = useState(order.shippingMethod || 'DHL')
    const [serviceType, setServiceType]       = useState('Standard')
    const [notifyCustomer, setNotifyCustomer] = useState(true)
    const trackingUrl = courier ? `https://www.${courier.toLowerCase()}.com/tracking?num=${trackingNumber}` : ''
    const valid = trackingNumber.trim().length >= 8
    return (
        <div className="fixed inset-0 z-[400] flex items-center justify-center px-4" style={{ backgroundColor: 'rgba(23,23,23,0.6)' }}>
            <div className="bg-white rounded-[24px] w-full max-w-[520px] max-h-[90vh] overflow-y-auto">
                <div className="px-6 py-5 border-b border-solid border-[#E5E5E5] flex items-center justify-between">
                    <div>
                        <h4 className="font-Helvetica font-normal text-[20px]">Ship Order</h4>
                        <p className="text-gray text-[13px]">{order.ref}</p>
                    </div>
                    <button onClick={onClose} className="text-gray hover:text-black transition-colors">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                    </button>
                </div>
                <div className="px-6 py-5 flex flex-col gap-4">
                    <div>
                        <label className="block font-medium text-[13px] mb-2">Tracking Number *</label>
                        <input type="text" value={trackingNumber} onChange={e => setTrackingNumber(e.target.value)} placeholder="Min. 8 characters"
                            className={`w-full h-[48px] px-4 border border-solid rounded-[8px] text-[14px] outline-none transition-colors ` + (trackingNumber && !valid ? 'border-red-400 focus:border-red-500' : 'border-[#E5E5E5] focus:border-black')} />
                        {trackingNumber && !valid && <p className="text-red-500 text-[12px] mt-1">Tracking number must be at least 8 characters</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block font-medium text-[13px] mb-2">Courier</label>
                            <input type="text" value={courier} onChange={e => setCourier(e.target.value)}
                                className="w-full h-[48px] px-4 border border-solid border-[#E5E5E5] rounded-[8px] text-[14px] outline-none focus:border-black transition-colors" />
                        </div>
                        <div>
                            <label className="block font-medium text-[13px] mb-2">Service Type</label>
                            <select value={serviceType} onChange={e => setServiceType(e.target.value)}
                                className="w-full h-[48px] px-4 border border-solid border-[#E5E5E5] rounded-[8px] text-[14px] outline-none focus:border-black transition-colors bg-white">
                                {['Standard','Express','Same Day'].map(s => <option key={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>
                    {valid && (
                        <div className="p-3 bg-[#F6F6F6] rounded-[12px]">
                            <p className="text-[11px] text-gray mb-1">Tracking URL Preview</p>
                            <p className="text-[12px] font-mono text-black break-all">{trackingUrl}</p>
                        </div>
                    )}
                    <label className="flex items-center gap-3 cursor-pointer">
                        <div onClick={() => setNotifyCustomer(p => !p)} className={`w-[20px] h-[20px] rounded-[5px] border-2 border-solid flex items-center justify-center flex-shrink-0 transition-all ` + (notifyCustomer ? 'bg-orange border-orange' : 'border-[#E5E5E5]')}>
                            {notifyCustomer && <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                        </div>
                        <span className="text-[13px] font-medium">Notify customer via email</span>
                    </label>
                    <div className="flex gap-3">
                        <button onClick={onClose} className="flex-1 h-[48px] border border-solid border-[#E5E5E5] rounded-full text-[14px] font-medium hover:border-black transition-colors">Cancel</button>
                        <button onClick={() => valid && onConfirm({ trackingNumber, courier, serviceType, notifyCustomer })} disabled={!valid}
                            className="flex-1 h-[48px] bg-orange text-white rounded-full text-[14px] font-medium hover:bg-[#c85e2e] transition-colors disabled:opacity-40">
                            Confirm Shipment
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

/* ── Modal: Cancel Order (with partial cancel + 4D message preservation) ── */
const CANCEL_REASONS = ['Item out of stock','Customer requested cancellation','Payment issue','Shipping address invalid','Duplicate order','Other']

const DEFAULT_TEMPLATE = (customer, ref, reason) =>
    `Dear ${customer},\n\nWe regret to inform you that your order ${ref} has been cancelled.\n\nReason: ${reason}\n\nA full refund will be processed within 3-5 business days.\n\nWe apologize for the inconvenience.\n\nBest regards,\nLux Team`

const CancelOrderModal = ({ order, onClose, onConfirm }) => {
    const [reason, setReason]             = useState('')
    const [customReason, setCustomReason] = useState('')
    const [message, setMessage]           = useState(DEFAULT_TEMPLATE(order.customer, order.ref, '[reason]'))
    const [userEditedMessage, setUserEditedMessage] = useState(false)
    const [refundAmount, setRefundAmount] = useState(order.total.toFixed(2))
    const [refundMethod, setRefundMethod] = useState('Original Payment Method')
    const [loading, setLoading]           = useState(false)

    // Item-level cancel state
    const [itemSelections, setItemSelections] = useState(
        order.items.map(item => ({ selected: true, qty: item.qty }))
    )

    const selectedItems = order.items.filter((_, i) => itemSelections[i].selected)
    const isPartial = selectedItems.length > 0 && selectedItems.length < order.items.length

    const calcRefund = (selections) => {
        return order.items.reduce((sum, item, i) => {
            if (!selections[i].selected) return sum
            return sum + parseFloat(item.price) * selections[i].qty
        }, 0)
    }

    // Auto-update refund amount when item selections change
    useEffect(() => {
        const total = order.items.reduce((sum, item, i) => {
            if (!itemSelections[i].selected) return sum
            return sum + parseFloat(item.price) * itemSelections[i].qty
        }, 0)
        setRefundAmount(total.toFixed(2))
    }, [itemSelections, order.items])

    const handleReasonChange = (r) => {
        setReason(r)
        if (!userEditedMessage) {
            const displayReason = r === 'Other' ? (customReason || '[please specify]') : r
            setMessage(prev => prev.replace(/\nReason: .*\n/, `\nReason: ${displayReason}\n`))
        }
    }

    const handleMessageChange = (val) => {
        setMessage(val)
        setUserEditedMessage(true)
    }

    const handleResetTemplate = () => {
        const displayReason = reason === 'Other' ? (customReason || '[please specify]') : (reason || '[reason]')
        setMessage(DEFAULT_TEMPLATE(order.customer, order.ref, displayReason))
        setUserEditedMessage(false)
    }

    const toggleItem = (i) => {
        setItemSelections(prev => prev.map((s, idx) => idx === i ? { ...s, selected: !s.selected } : s))
    }
    const setItemQty = (i, qty) => {
        setItemSelections(prev => prev.map((s, idx) => idx === i ? { ...s, qty: Math.max(1, Math.min(qty, order.items[i].qty)) } : s))
    }

    const handleConfirm = () => {
        if (!reason || selectedItems.length === 0) return
        setLoading(true)
        const partialItems = isPartial
            ? order.items.filter((_, i) => itemSelections[i].selected).map((item, origIdx) => {
                const sel = itemSelections[order.items.indexOf(item)]
                return { ...item, qty: sel ? sel.qty : item.qty }
            })
            : null
        setTimeout(() => {
            onConfirm({
                reason: reason === 'Other' ? customReason || reason : reason,
                message,
                refundAmount: parseFloat(refundAmount) || 0,
                partialItems,
            })
            setLoading(false)
        }, 800)
    }

    const cancelledCount = itemSelections.filter(s => s.selected).length
    const refundPreview = calcRefund(itemSelections)

    return (
        <div className="fixed inset-0 z-[500] flex items-center justify-center px-4" style={{ backgroundColor: 'rgba(23,23,23,0.6)' }}>
            <div className="bg-white rounded-[24px] w-full max-w-[560px] max-h-[90vh] overflow-y-auto">
                <div className="px-6 py-5 border-b border-solid border-[#E5E5E5] flex items-center justify-between">
                    <div>
                        <h4 className="font-Helvetica font-normal text-[20px]">Cancel Order</h4>
                        <p className="text-gray text-[13px]">{order.ref} · {order.customer}</p>
                    </div>
                    <button onClick={onClose} className="text-gray hover:text-black transition-colors">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                    </button>
                </div>
                <div className="px-6 py-5 flex flex-col gap-5">
                    {/* Items to Cancel */}
                    <div>
                        <label className="block font-medium text-[13px] mb-3">Items to Cancel</label>
                        <div className="flex flex-col gap-2">
                            {order.items.map((item, i) => (
                                <div key={i} className={`flex items-center gap-3 p-3 rounded-[12px] border border-solid transition-all ` + (itemSelections[i].selected ? 'border-orange bg-[#FFF7ED]' : 'border-[#E5E5E5]')}>
                                    <div onClick={() => toggleItem(i)} className={`w-[18px] h-[18px] rounded-[4px] border-2 border-solid flex items-center justify-center flex-shrink-0 cursor-pointer transition-all ` + (itemSelections[i].selected ? 'bg-orange border-orange' : 'border-[#E5E5E5]')}>
                                        {itemSelections[i].selected && <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                                    </div>
                                    <img src={item.img} className="w-[40px] h-[40px] rounded-[8px] object-cover flex-shrink-0" alt={item.name} />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-[13px] truncate">{item.name}</p>
                                        <p className="text-gray text-[11px]">Size {item.selectedSize} · ${item.price}</p>
                                    </div>
                                    {itemSelections[i].selected && (
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <button onClick={() => setItemQty(i, itemSelections[i].qty - 1)} className="w-[24px] h-[24px] rounded-full border border-solid border-[#E5E5E5] flex items-center justify-center text-[14px] hover:border-black transition-colors">−</button>
                                            <span className="text-[13px] font-medium w-[20px] text-center">{itemSelections[i].qty}</span>
                                            <button onClick={() => setItemQty(i, itemSelections[i].qty + 1)} className="w-[24px] h-[24px] rounded-full border border-solid border-[#E5E5E5] flex items-center justify-center text-[14px] hover:border-black transition-colors">+</button>
                                            <span className="text-[11px] text-gray">/ {item.qty}</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        {/* Refund breakdown */}
                        <div className="mt-3 p-3 bg-[#F6F6F6] rounded-[10px] text-[12px]">
                            {isPartial
                                ? <p className="text-gray">Cancelling <span className="font-medium text-black">{cancelledCount} of {order.items.length} items</span> = <span className="font-medium text-orange">${refundPreview.toFixed(2)} refund</span></p>
                                : <p className="text-gray">Cancelling <span className="font-medium text-black">all {order.items.length} items</span> = <span className="font-medium text-orange">${refundPreview.toFixed(2)} full refund</span></p>
                            }
                        </div>
                    </div>

                    {/* Reason */}
                    <div>
                        <label className="block font-medium text-[13px] mb-3">Cancellation Reason *</label>
                        <div className="flex flex-col gap-2">
                            {CANCEL_REASONS.map(r => (
                                <label key={r} className={`flex items-center gap-3 p-3 rounded-[12px] border border-solid cursor-pointer transition-all ` + (reason === r ? 'border-orange bg-[#FFF7ED]' : 'border-[#E5E5E5] hover:border-[#A3A3A3]')}>
                                    <div className={`w-[18px] h-[18px] rounded-full border-2 border-solid flex items-center justify-center flex-shrink-0 ` + (reason === r ? 'border-orange' : 'border-[#E5E5E5]')}>
                                        {reason === r && <div className="w-[8px] h-[8px] rounded-full bg-orange"></div>}
                                    </div>
                                    <span className="text-[13px] font-medium">{r}</span>
                                    <input type="radio" className="hidden" value={r} checked={reason === r} onChange={() => handleReasonChange(r)} />
                                </label>
                            ))}
                        </div>
                        {reason === 'Other' && (
                            <input type="text" value={customReason} onChange={e => { setCustomReason(e.target.value); handleReasonChange('Other') }}
                                placeholder="Specify reason..." className="mt-2 w-full h-[48px] px-4 border border-solid border-[#E5E5E5] rounded-[8px] text-[13px] outline-none focus:border-black transition-colors" />
                        )}
                    </div>

                    {/* Refund */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block font-medium text-[13px] mb-2">Refund Amount ($)</label>
                            <input type="number" value={refundAmount} onChange={e => setRefundAmount(e.target.value)} step="0.01" min="0" max={order.total}
                                className="w-full h-[48px] px-4 border border-solid border-[#E5E5E5] rounded-[8px] text-[14px] outline-none focus:border-black transition-colors" />
                        </div>
                        <div>
                            <label className="block font-medium text-[13px] mb-2">Refund Method</label>
                            <select value={refundMethod} onChange={e => setRefundMethod(e.target.value)}
                                className="w-full h-[48px] px-4 border border-solid border-[#E5E5E5] rounded-[8px] text-[14px] outline-none focus:border-black transition-colors bg-white">
                                {['Original Payment Method','Store Credit','Manual'].map(m => <option key={m}>{m}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Message */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="font-medium text-[13px]">Message to Customer</label>
                            {userEditedMessage && (
                                <button onClick={handleResetTemplate} className="text-[11px] text-orange hover:underline">Reset to template</button>
                            )}
                        </div>
                        <p className="text-[12px] text-gray mb-2">Sent to <span className="font-medium text-black">{order.email}</span></p>
                        <textarea value={message} onChange={e => handleMessageChange(e.target.value)}
                            className="w-full px-4 py-3 border border-solid border-[#E5E5E5] rounded-[8px] text-[13px] outline-none focus:border-black transition-colors min-h-[140px] resize-none font-mono" />
                        {userEditedMessage && <p className="text-[11px] text-gray mt-1">✏️ You've edited this message manually</p>}
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-[#FEF2F2] border border-solid border-[#FECACA] rounded-[16px]">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="flex-shrink-0 mt-[1px]"><path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="#DC2626" strokeWidth="1.8" strokeLinecap="round"/></svg>
                        <p className="text-[12px] text-red-600">
                            {isPartial
                                ? 'This will partially cancel the order. The remaining items will continue to be fulfilled.'
                                : 'This action cannot be undone. The order will be fully cancelled and a refund notification will be sent.'}
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={onClose} className="flex-1 h-[48px] border border-solid border-[#E5E5E5] rounded-full text-[14px] font-medium hover:border-black transition-colors">Keep Order</button>
                        <button onClick={handleConfirm} disabled={!reason || loading || selectedItems.length === 0}
                            className="flex-1 h-[48px] bg-red-500 text-white rounded-full text-[14px] font-medium hover:bg-red-600 transition-colors disabled:opacity-40">
                            {loading ? 'Processing...' : isPartial ? 'Partial Cancel & Refund' : 'Cancel Order & Process Refund'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

/* ── Modal: Add Note ── */
const AddNoteModal = ({ order, onClose, onConfirm }) => {
    const [note, setNote]         = useState('')
    const [internal, setInternal] = useState(true)
    const valid = note.trim().length > 0
    return (
        <div className="fixed inset-0 z-[400] flex items-center justify-center px-4" style={{ backgroundColor: 'rgba(23,23,23,0.6)' }}>
            <div className="bg-white rounded-[24px] w-full max-w-[480px]">
                <div className="px-6 py-5 border-b border-solid border-[#E5E5E5] flex items-center justify-between">
                    <div>
                        <h4 className="font-Helvetica font-normal text-[20px]">Add Note</h4>
                        <p className="text-gray text-[13px]">{order.ref}</p>
                    </div>
                    <button onClick={onClose} className="text-gray hover:text-black transition-colors">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                    </button>
                </div>
                <div className="px-6 py-5 flex flex-col gap-4">
                    <div>
                        <label className="block font-medium text-[13px] mb-2">Note</label>
                        <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Add a note about this order..."
                            className="w-full px-4 py-3 border border-solid border-[#E5E5E5] rounded-[8px] text-[14px] outline-none focus:border-black transition-colors min-h-[100px] resize-none" />
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={() => setInternal(true)} className={`flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-medium border border-solid transition-colors ` + (internal ? 'bg-black text-white border-black' : 'border-[#E5E5E5] text-gray hover:border-black hover:text-black')}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                            Internal only
                        </button>
                        <button onClick={() => setInternal(false)} className={`flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-medium border border-solid transition-colors ` + (!internal ? 'bg-black text-white border-black' : 'border-[#E5E5E5] text-gray hover:border-black hover:text-black')}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M22 6l-10 7L2 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                            Notify customer
                        </button>
                    </div>
                    {!internal && note.trim() && (
                        <div className="p-4 bg-[#F6F6F6] rounded-[12px]">
                            <p className="text-[11px] text-gray mb-2 font-medium">EMAIL PREVIEW</p>
                            <p className="text-[12px] font-medium mb-1">To: {order.email}</p>
                            <p className="text-[12px] font-medium mb-2">Subject: Update on your order {order.ref}</p>
                            <p className="text-[12px] text-gray whitespace-pre-wrap">{`Dear ${order.customer},\n\n${note}\n\nBest regards,\nLux Team`}</p>
                        </div>
                    )}
                    <div className="flex gap-3">
                        <button onClick={onClose} className="flex-1 h-[48px] border border-solid border-[#E5E5E5] rounded-full text-[14px] font-medium hover:border-black transition-colors">Cancel</button>
                        <button onClick={() => valid && onConfirm({ note, internal })} disabled={!valid}
                            className="flex-1 h-[48px] bg-black text-white rounded-full text-[14px] font-medium hover:bg-orange transition-colors disabled:opacity-40">
                            Add Note
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

/* ── Modal: Email Customer ── */
const EMAIL_TEMPLATES = {
    'Order Update': {
        subject: (ref, status) => `Update on your order ${ref}`,
        body: (ref, status, customer) => `Dear ${customer},\n\nYour order ${ref} has been updated. Current status: ${status}.\n\nIf you have any questions, please don't hesitate to contact us.\n\nBest regards,\nLux Team`,
    },
    'Shipping Delay': {
        subject: (ref) => `Important update about your order ${ref}`,
        body: (ref, status, customer) => `Dear ${customer},\n\nWe apologize for the delay on your order ${ref}. We expect to ship within 2 business days.\n\nThank you for your patience.\n\nBest regards,\nLux Team`,
    },
    'Custom': {
        subject: () => '',
        body: () => '',
    },
}

const EmailCustomerModal = ({ order, onClose, onSend }) => {
    const [template, setTemplate] = useState('Order Update')
    const [subject, setSubject]   = useState(EMAIL_TEMPLATES['Order Update'].subject(order.ref, order.fulfillmentStatus))
    const [body, setBody]         = useState(EMAIL_TEMPLATES['Order Update'].body(order.ref, order.fulfillmentStatus, order.customer))
    const [preview, setPreview]   = useState(false)
    const [loading, setLoading]   = useState(false)

    const handleTemplateChange = (t) => {
        setTemplate(t)
        setSubject(EMAIL_TEMPLATES[t].subject(order.ref, order.fulfillmentStatus))
        setBody(EMAIL_TEMPLATES[t].body(order.ref, order.fulfillmentStatus, order.customer))
    }

    const handleSend = () => {
        if (!subject.trim() || !body.trim()) return
        setLoading(true)
        setTimeout(() => {
            onSend({ subject, body })
            setLoading(false)
        }, 600)
    }

    return (
        <div className="fixed inset-0 z-[400] flex items-center justify-center px-4" style={{ backgroundColor: 'rgba(23,23,23,0.6)' }}>
            <div className="bg-white rounded-[24px] w-full max-w-[560px] max-h-[90vh] overflow-y-auto">
                <div className="px-6 py-5 border-b border-solid border-[#E5E5E5] flex items-center justify-between">
                    <div>
                        <h4 className="font-Helvetica font-normal text-[20px]">Email Customer</h4>
                        <p className="text-gray text-[13px]">{order.email}</p>
                    </div>
                    <button onClick={onClose} className="text-gray hover:text-black transition-colors">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                    </button>
                </div>
                <div className="px-6 py-5 flex flex-col gap-4">
                    <div>
                        <label className="block font-medium text-[13px] mb-2">Template</label>
                        <div className="flex gap-2 flex-wrap">
                            {Object.keys(EMAIL_TEMPLATES).map(t => (
                                <button key={t} onClick={() => handleTemplateChange(t)}
                                    className={`px-4 py-2 rounded-full text-[12px] font-medium border border-solid transition-colors ` + (template === t ? 'bg-black text-white border-black' : 'border-[#E5E5E5] text-gray hover:border-black hover:text-black')}>
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block font-medium text-[13px] mb-2">Subject</label>
                        <input type="text" value={subject} onChange={e => setSubject(e.target.value)}
                            className="w-full h-[48px] px-4 border border-solid border-[#E5E5E5] rounded-[8px] text-[14px] outline-none focus:border-black transition-colors" />
                    </div>
                    <div>
                        <label className="block font-medium text-[13px] mb-2">Body</label>
                        <textarea value={body} onChange={e => setBody(e.target.value)}
                            className="w-full px-4 py-3 border border-solid border-[#E5E5E5] rounded-[8px] text-[13px] outline-none focus:border-black transition-colors min-h-[160px] resize-none" />
                    </div>
                    <button onClick={() => setPreview(p => !p)} className="text-[12px] text-orange hover:underline text-left">
                        {preview ? 'Hide preview' : 'Show email preview'}
                    </button>
                    {preview && (
                        <div className="p-4 bg-[#F6F6F6] rounded-[12px] border border-solid border-[#E5E5E5]">
                            <p className="text-[11px] text-gray font-medium mb-3 uppercase tracking-wide">Email Preview</p>
                            <div className="bg-white rounded-[8px] p-4 border border-solid border-[#E5E5E5]">
                                <p className="text-[12px] text-gray mb-1">To: <span className="font-medium text-black">{order.email}</span></p>
                                <p className="text-[12px] text-gray mb-3">Subject: <span className="font-medium text-black">{subject}</span></p>
                                <hr className="border-[#E5E5E5] mb-3" />
                                <p className="text-[13px] text-black whitespace-pre-wrap">{body}</p>
                            </div>
                        </div>
                    )}
                    <div className="flex gap-3">
                        <button onClick={onClose} className="flex-1 h-[48px] border border-solid border-[#E5E5E5] rounded-full text-[14px] font-medium hover:border-black transition-colors">Cancel</button>
                        <button onClick={handleSend} disabled={!subject.trim() || !body.trim() || loading}
                            className="flex-1 h-[48px] bg-black text-white rounded-full text-[14px] font-medium hover:bg-orange transition-colors disabled:opacity-40 flex items-center justify-center gap-2">
                            {loading ? 'Sending...' : <>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                Send Email
                            </>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

/* ── Activity Timeline ── */
const ActivityTimeline = ({ events }) => {
    if (!events || events.length === 0) return (
        <div className="text-center py-8 text-gray text-[13px]">No activity yet.</div>
    )
    const sorted = [...events].sort((a, b) => new Date(b.at) - new Date(a.at))
    return (
        <div className="flex flex-col gap-0">
            {sorted.map((ev, idx) => {
                const meta = EVENT_ICONS[ev.type] || { color: '#525252', icon: '•' }
                const label = EVENT_LABELS[ev.type] || ev.type
                return (
                    <div key={ev.id || idx} className="flex gap-4 relative">
                        {idx < sorted.length - 1 && (
                            <div className="absolute left-[19px] top-[40px] bottom-0 w-[2px] bg-[#E5E5E5]" style={{ zIndex: 0 }}></div>
                        )}
                        <div className="w-[40px] h-[40px] rounded-full flex items-center justify-center flex-shrink-0 z-[1] border-2 border-solid border-white"
                            style={{ backgroundColor: meta.color + '20', color: meta.color }}>
                            <span className="text-[16px] leading-none">{meta.icon}</span>
                        </div>
                        <div className="flex-1 pb-6">
                            <div className="flex items-start justify-between gap-2">
                                <div>
                                    <p className="font-medium text-[14px] text-black">{label}</p>
                                    <p className="text-[12px] text-gray">{ev.by}</p>
                                </div>
                                <span className="text-[11px] text-gray flex-shrink-0">{relativeTime(ev.at)}</span>
                            </div>
                            {ev.note && (
                                <p className="mt-1 text-[13px] text-gray bg-[#F6F6F6] rounded-[8px] px-3 py-2">{ev.note}</p>
                            )}
                            {ev.type === 'tracking_added' && ev.note && (
                                <a href="https://www.dhl.com/tracking" target="_blank" rel="noreferrer" className="text-[12px] text-orange hover:underline mt-1 inline-block">View tracking →</a>
                            )}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

/* ── Refund History Card ── */
const RefundHistoryCard = ({ order }) => {
    const history = order.refundHistory || []
    if (history.length === 0) return null
    const totalRefunded = history.reduce((s, r) => s + r.amount, 0)
    const isFullyRefunded = totalRefunded >= order.total
    return (
        <div className="bg-white border border-solid border-[#E5E5E5] rounded-[24px] px-5 py-4">
            <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-[14px] flex items-center gap-2">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M3 12a9 9 0 1018 0 9 9 0 00-18 0zM12 8v4l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                    Refund History
                </h4>
                <span className={`text-[11px] font-medium px-2 py-[2px] rounded-full border border-solid ` + (isFullyRefunded ? 'bg-[#F0F9FF] text-[#0284C7] border-[#BAE6FD]' : 'bg-[#FDF4FF] text-[#9333EA] border-[#E9D5FF]')}>
                    {isFullyRefunded ? 'Fully Refunded' : 'Partially Refunded'}
                </span>
            </div>
            <div className="flex flex-col gap-3">
                {history.map((r, i) => (
                    <div key={r.id || i} className="p-3 bg-[#F6F6F6] rounded-[10px]">
                        <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-[14px] text-orange">${r.amount.toFixed(2)}</span>
                            <span className="text-[11px] text-gray">{fmtShort(r.at)}</span>
                        </div>
                        <p className="text-[12px] text-gray">{r.method}</p>
                        {r.reason && <p className="text-[12px] text-gray mt-1">Reason: {r.reason}</p>}
                        {r.items && r.items.length > 0 && (
                            <p className="text-[11px] text-gray mt-1">{r.items.length} item{r.items.length > 1 ? 's' : ''} cancelled</p>
                        )}
                    </div>
                ))}
            </div>
            <div className="mt-3 pt-3 border-t border-solid border-[#E5E5E5] flex justify-between text-[13px]">
                <span className="text-gray">Total refunded</span>
                <span className="font-semibold">${totalRefunded.toFixed(2)} / ${order.total.toFixed(2)}</span>
            </div>
        </div>
    )
}

/* ── Action Zone ── */
const ActionZone = ({ order, onStartFulfillment, onMarkPacked, onShip, onMarkDelivered, onCancel, onAddNote, onEmailCustomer, loadingAction }) => {
    const fs = order.fulfillmentStatus
    const SpinnerBtn = ({ onClick, label, className, disabled }) => (
        <button onClick={onClick} disabled={disabled || loadingAction}
            className={`h-[44px] px-6 rounded-full text-[13px] font-medium transition-colors flex items-center gap-2 disabled:opacity-60 ` + className}>
            {loadingAction === label
                ? <><svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.3"/><path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg> Processing...</>
                : <>{label}<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></>
            }
        </button>
    )

    if (fs === 'Delivered') return (
        <div className="flex items-center gap-3 flex-wrap">
            {order.trackingUrl && <a href={order.trackingUrl} target="_blank" rel="noreferrer" className="h-[44px] px-5 rounded-full border border-solid border-[#E5E5E5] text-[13px] font-medium hover:border-black transition-colors flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                View Tracking
            </a>}
            <button onClick={onAddNote} className="h-[44px] px-5 rounded-full border border-solid border-[#E5E5E5] text-[13px] font-medium hover:border-black transition-colors">Add Note</button>
            <button onClick={onEmailCustomer} className="h-[44px] px-5 rounded-full border border-solid border-[#E5E5E5] text-[13px] font-medium hover:border-black transition-colors flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M22 6l-10 7L2 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                Email Customer
            </button>
        </div>
    )
    if (fs === 'Cancelled' || fs === 'Partially Cancelled') return (
        <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 px-4 py-2 bg-[#FEF2F2] border border-solid border-[#FECACA] rounded-full">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="#DC2626" strokeWidth="1.8" strokeLinecap="round"/></svg>
                <span className="text-[13px] font-medium text-red-600">{fs === 'Partially Cancelled' ? 'Partially Cancelled' : 'Order Cancelled'}</span>
            </div>
        </div>
    )
    return (
        <div className="flex items-center gap-3 flex-wrap">
            {fs === 'Unfulfilled' && <>
                <SpinnerBtn onClick={onStartFulfillment} label="Start Fulfillment" className="bg-orange text-white hover:bg-[#c85e2e]" />
                <button onClick={onEmailCustomer} className="h-[44px] px-5 rounded-full border border-solid border-[#E5E5E5] text-[13px] font-medium hover:border-black transition-colors flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M22 6l-10 7L2 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                    Email Customer
                </button>
                <button onClick={onCancel} className="h-[44px] px-5 rounded-full border border-solid border-[#FECACA] text-red-500 text-[13px] font-medium hover:bg-red-50 transition-colors">Cancel Order</button>
            </>}
            {fs === 'Picking' && <>
                <SpinnerBtn onClick={onMarkPacked} label="Mark as Packed" className="bg-orange text-white hover:bg-[#c85e2e]" />
                <button onClick={onAddNote} className="h-[44px] px-5 rounded-full border border-solid border-[#E5E5E5] text-[13px] font-medium hover:border-black transition-colors">Add Note</button>
                <button onClick={onEmailCustomer} className="h-[44px] px-5 rounded-full border border-solid border-[#E5E5E5] text-[13px] font-medium hover:border-black transition-colors flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M22 6l-10 7L2 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                    Email Customer
                </button>
                <button onClick={onCancel} className="h-[44px] px-5 rounded-full border border-solid border-[#FECACA] text-red-500 text-[13px] font-medium hover:bg-red-50 transition-colors">Cancel</button>
            </>}
            {fs === 'Packed' && <>
                <SpinnerBtn onClick={onShip} label="Ship Order" className="bg-orange text-white hover:bg-[#c85e2e]" />
                <button onClick={onAddNote} className="h-[44px] px-5 rounded-full border border-solid border-[#E5E5E5] text-[13px] font-medium hover:border-black transition-colors">Add Note</button>
                <button onClick={onEmailCustomer} className="h-[44px] px-5 rounded-full border border-solid border-[#E5E5E5] text-[13px] font-medium hover:border-black transition-colors flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M22 6l-10 7L2 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                    Email Customer
                </button>
                <button onClick={onCancel} className="h-[44px] px-5 rounded-full border border-solid border-[#FECACA] text-red-500 text-[13px] font-medium hover:bg-red-50 transition-colors">Cancel</button>
            </>}
            {fs === 'Shipped' && <>
                <SpinnerBtn onClick={onMarkDelivered} label="Mark Delivered" className="bg-orange text-white hover:bg-[#c85e2e]" />
                {order.trackingUrl && <a href={order.trackingUrl} target="_blank" rel="noreferrer" className="h-[44px] px-5 rounded-full border border-solid border-[#E5E5E5] text-[13px] font-medium hover:border-black transition-colors flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    View Tracking
                </a>}
                <button onClick={onAddNote} className="h-[44px] px-5 rounded-full border border-solid border-[#E5E5E5] text-[13px] font-medium hover:border-black transition-colors">Add Note</button>
                <button onClick={onEmailCustomer} className="h-[44px] px-5 rounded-full border border-solid border-[#E5E5E5] text-[13px] font-medium hover:border-black transition-colors flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M22 6l-10 7L2 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                    Email Customer
                </button>
            </>}
        </div>
    )
}

/* ── Main Page ── */
const AdminOrderDetail = () => {
    const { ref } = useParams()
    const navigate = useNavigate()
    const { orders, updateFulfillmentStatus, markPacked, markShipped, markDelivered, cancelOrder, addEvent, addOrderNote, sendCustomerMessage } = useAdmin()

    const order = orders.find(o => o.ref === ref)

    const [modal, setModal]           = useState(null)
    const [printType, setPrintType]   = useState(null)
    const [loadingAction, setLoadingAction] = useState(null)
    const { toasts, show: showToast } = useToast()

    const closeModal = useCallback(() => setModal(null), [])

    /* ── 404 empty state ── */
    if (!order) return (
        <div className="flex flex-col items-center justify-center py-24 gap-5">
            <div className="w-[80px] h-[80px] rounded-full bg-[#F6F6F6] flex items-center justify-center">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none"><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01" stroke="#A3A3A3" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </div>
            <div className="text-center">
                <p className="text-[24px] font-medium text-black mb-2">Order not found</p>
                <p className="text-gray text-[14px]">The order "{ref}" doesn't exist or has been removed.</p>
            </div>
            <button onClick={() => navigate('/admin/orders')}
                className="h-[44px] px-6 rounded-full bg-black text-white text-[13px] font-medium hover:bg-orange transition-colors flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Back to Orders
            </button>
        </div>
    )

    const fs = order.fulfillmentStatus
    const fsColor = FS_COLORS[fs] || FS_COLORS.Unfulfilled
    const psColor = PS_COLORS[order.paymentStatus] || PS_COLORS.Pending

    const isActiveFs = ['Unfulfilled','Picking','Packed'].includes(fs)
    const slaOverdue = isActiveFs && order.slaHours > 24
    const slaVeryOverdue = isActiveFs && order.slaHours > 48

    const totalRefunded = (order.refundHistory || []).reduce((s, r) => s + r.amount, 0)
    const isFullyRefunded = totalRefunded >= order.total && totalRefunded > 0
    const isPartiallyRefunded = totalRefunded > 0 && totalRefunded < order.total

    /* ── Async action wrapper ── */
    const withLoading = (label, fn) => {
        setLoadingAction(label)
        setTimeout(() => {
            fn()
            setLoadingAction(null)
        }, 600)
    }

    /* ── Handlers ── */
    const handleStartFulfillment = () => {
        withLoading('Start Fulfillment', () => {
            const at = new Date().toISOString()
            updateFulfillmentStatus(ref, 'Picking')
            addEvent(ref, { id: Date.now(), at, by: 'Admin Lux', type: 'fulfillment_started', from: 'Unfulfilled', to: 'Picking', note: 'Fulfillment started. Items being picked from warehouse.' })
            order.items.forEach((item, i) => {
                addEvent(ref, { id: Date.now() + i + 1, at, by: 'Admin Lux', type: 'item_picked', from: '', to: '', note: `Picked: ${item.name} — Size ${item.selectedSize} — Color ${item.colorName} × ${item.qty}` })
            })
            closeModal()
            showToast('Fulfillment started successfully')
        })
    }

    const handleMarkPacked = ({ weight, boxSize, packingNotes }) => {
        withLoading('Mark as Packed', () => {
            markPacked(ref, { weight, boxSize, packingNotes })
            closeModal()
            showToast('Order marked as packed')
        })
    }

    const handleShip = ({ trackingNumber, courier, serviceType, notifyCustomer }) => {
        withLoading('Ship Order', () => {
            markShipped(ref, { trackingNumber, courier })
            if (notifyCustomer) {
                addEvent(ref, { id: Date.now() + 10, at: new Date().toISOString(), by: 'Admin Lux', type: 'customer_notified', from: '', to: '', note: 'Customer notified via email with tracking information.' })
            }
            closeModal()
            showToast('Order shipped successfully')
        })
    }

    const handleMarkDelivered = () => {
        withLoading('Mark Delivered', () => {
            markDelivered(ref)
            showToast('Order marked as delivered')
        })
    }

    const handleCancel = ({ reason, message, refundAmount, partialItems }) => {
        cancelOrder(ref, { reason, message, refundAmount, partialItems })
        closeModal()
        showToast(partialItems ? 'Order partially cancelled' : 'Order cancelled and refund initiated')
    }

    const handleAddNote = ({ note, internal }) => {
        const at = new Date().toISOString()
        addOrderNote(ref, { text: note, date: at, author: 'Admin Lux', internal })
        addEvent(ref, { id: Date.now(), at, by: 'Admin Lux', type: internal ? 'note_added' : 'customer_notified', from: '', to: '', note })
        closeModal()
        showToast('Note added')
    }

    const handleSendEmail = ({ subject, body }) => {
        sendCustomerMessage(ref, { subject, body })
        closeModal()
        showToast(`Email sent to ${order.email}`)
    }

    const copyToClipboard = (text) => { try { navigator.clipboard?.writeText(text) } catch(e) {} }

    return (
        <div className="min-h-screen">
            <Toast toasts={toasts} />

            {/* Modals */}
            {modal === 'start'  && <StartFulfillmentModal order={order} onClose={closeModal} onConfirm={handleStartFulfillment} />}
            {modal === 'pack'   && <MarkPackedModal order={order} onClose={closeModal} onConfirm={handleMarkPacked} />}
            {modal === 'ship'   && <ShipOrderModal order={order} onClose={closeModal} onConfirm={handleShip} />}
            {modal === 'cancel' && <CancelOrderModal order={order} onClose={closeModal} onConfirm={handleCancel} />}
            {modal === 'note'   && <AddNoteModal order={order} onClose={closeModal} onConfirm={handleAddNote} />}
            {modal === 'email'  && <EmailCustomerModal order={order} onClose={closeModal} onSend={handleSendEmail} />}
            {modal === 'print'  && <PrintPreview order={order} type={printType} onClose={closeModal} />}

            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center gap-2 text-[13px] text-gray mb-3">
                    <Link to="/admin/orders" className="hover:text-black transition-colors">Orders</Link>
                    <span>/</span>
                    <span className="font-medium text-black">{order.ref}</span>
                </div>
                <div className="flex items-start justify-between flex-wrap gap-3">
                    <div>
                        <div className="flex items-center gap-3 flex-wrap mb-1">
                            <h1 className="font-Helvetica font-normal text-[32px] text-black">{order.ref}</h1>
                            <span className="text-[12px] font-medium px-3 py-[4px] rounded-full border border-solid" style={{ backgroundColor: fsColor.bg, color: fsColor.text, borderColor: fsColor.border }}>{fs}</span>
                            <span className="text-[12px] font-medium px-3 py-[4px] rounded-full border border-solid" style={{ backgroundColor: psColor.bg, color: psColor.text, borderColor: psColor.border }}>{order.paymentStatus}</span>
                            {isFullyRefunded && <span className="text-[11px] font-medium px-3 py-[4px] rounded-full bg-[#F0F9FF] text-[#0284C7] border border-solid border-[#BAE6FD]">Fully Refunded</span>}
                            {isPartiallyRefunded && <span className="text-[11px] font-medium px-3 py-[4px] rounded-full bg-[#FDF4FF] text-[#9333EA] border border-solid border-[#E9D5FF]">Partially Refunded</span>}
                            {slaVeryOverdue && <span className="text-[11px] font-medium px-3 py-[4px] rounded-full bg-red-100 text-red-600 border border-solid border-red-200">Overdue {order.slaHours}h</span>}
                            {!slaVeryOverdue && slaOverdue && <span className="text-[11px] font-medium px-3 py-[4px] rounded-full bg-yellow-100 text-yellow-700 border border-solid border-yellow-200">Overdue {order.slaHours}h</span>}
                        </div>
                        <p className="text-gray text-[14px]">Placed on {fmtDate(order.date)}</p>
                    </div>
                    <button onClick={() => navigate('/admin/orders')} className="h-[40px] px-4 rounded-full border border-solid border-[#E5E5E5] text-[13px] font-medium hover:border-black transition-colors flex items-center gap-2">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        Back
                    </button>
                </div>
            </div>

            {/* 2-column layout */}
            <div className="flex gap-6 items-start">
                {/* Left */}
                <div className="flex-1 min-w-0 flex flex-col gap-6">
                    <div className="bg-white border border-solid border-[#E5E5E5] rounded-[24px] px-6 py-5">
                        <h3 className="font-medium text-[16px] mb-5">Activity Timeline</h3>
                        <ActivityTimeline events={order.events} />
                    </div>
                    <div className="bg-white border border-solid border-[#E5E5E5] rounded-[24px] px-6 py-4 sticky bottom-6 z-[10] shadow-lg">
                        <p className="text-[11px] text-gray font-medium mb-3 uppercase tracking-wide">Actions</p>
                        <ActionZone
                            order={order}
                            onStartFulfillment={() => setModal('start')}
                            onMarkPacked={() => setModal('pack')}
                            onShip={() => setModal('ship')}
                            onMarkDelivered={handleMarkDelivered}
                            onCancel={() => setModal('cancel')}
                            onAddNote={() => setModal('note')}
                            onEmailCustomer={() => setModal('email')}
                            loadingAction={loadingAction}
                        />
                    </div>
                </div>

                {/* Right sidebar */}
                <div className="w-[360px] flex-shrink-0 flex flex-col gap-4 sticky top-[80px]">
                    {/* Customer card */}
                    <div className="bg-white border border-solid border-[#E5E5E5] rounded-[24px] px-5 py-4">
                        <h4 className="font-medium text-[14px] mb-3 flex items-center gap-2">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.8"/></svg>
                            Customer
                        </h4>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-[44px] h-[44px] rounded-full bg-orange flex items-center justify-center flex-shrink-0">
                                <span className="text-white font-medium text-[18px]">{order.customer.charAt(0)}</span>
                            </div>
                            <div>
                                <p className="font-medium text-[14px]">{order.customer}</p>
                                <p className="text-gray text-[12px]">{order.email}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-[12px]">
                            <div><p className="text-gray text-[11px] mb-1">Phone</p><p className="font-medium">{order.phone || order.address?.phone || '—'}</p></div>
                            <div><p className="text-gray text-[11px] mb-1">Orders</p><p className="font-medium">3 orders</p></div>
                        </div>
                    </div>

                    {/* Shipping address */}
                    <div className="bg-white border border-solid border-[#E5E5E5] rounded-[24px] px-5 py-4">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-[14px] flex items-center gap-2">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.8"/></svg>
                                Shipping Address
                            </h4>
                            {order.address && (
                                <button onClick={() => copyToClipboard(`${order.customer}\n${order.address.street}\n${order.address.city}, ${order.address.region} ${order.address.postal}\n${order.address.country}`)}
                                    className="text-[11px] text-orange hover:underline">Copy</button>
                            )}
                        </div>
                        {order.address ? (
                            <div className="text-[13px] text-gray leading-relaxed">
                                <p className="font-medium text-black">{order.customer}</p>
                                <p>{order.address.street}</p>
                                <p>{order.address.city}, {order.address.region} {order.address.postal}</p>
                                <p>{order.address.country}</p>
                                <p className="mt-1">{order.address.phone}</p>
                            </div>
                        ) : <p className="text-gray text-[13px]">No address on file</p>}
                    </div>

                    {/* Shipping & payment */}
                    <div className="bg-white border border-solid border-[#E5E5E5] rounded-[24px] px-5 py-4">
                        <h4 className="font-medium text-[14px] mb-3 flex items-center gap-2">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><circle cx="5.5" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="1.8"/><circle cx="18.5" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="1.8"/></svg>
                            Shipping & Payment
                        </h4>
                        <div className="flex flex-col gap-2 text-[13px]">
                            <div className="flex justify-between"><span className="text-gray">Courier</span><span className="font-medium">{order.shippingMethod}</span></div>
                            <div className="flex justify-between"><span className="text-gray">Payment</span><span className="font-medium">{order.paymentMethod}</span></div>
                            <div className="flex justify-between"><span className="text-gray">Shipping cost</span><span className="font-medium">{order.shippingCost === 0 ? 'Free' : `$${order.shippingCost?.toFixed(2)}`}</span></div>
                            {order.trackingNumber && (
                                <div className="flex justify-between items-center">
                                    <span className="text-gray">Tracking</span>
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono text-[12px] font-medium">{order.trackingNumber}</span>
                                        <button onClick={() => copyToClipboard(order.trackingNumber)} className="text-[11px] text-orange hover:underline">Copy</button>
                                        {order.trackingUrl && <a href={order.trackingUrl} target="_blank" rel="noreferrer" className="text-[11px] text-orange hover:underline">Track</a>}
                                    </div>
                                </div>
                            )}
                            {order.weight && <div className="flex justify-between"><span className="text-gray">Weight</span><span className="font-medium">{order.weight}</span></div>}
                            {order.boxSize && <div className="flex justify-between"><span className="text-gray">Box size</span><span className="font-medium">{order.boxSize}</span></div>}
                        </div>
                    </div>

                    {/* Order items */}
                    <div className="bg-white border border-solid border-[#E5E5E5] rounded-[24px] px-5 py-4">
                        <h4 className="font-medium text-[14px] mb-3">Order Items</h4>
                        <div className="flex flex-col gap-3">
                            {order.items.map((item, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <img src={item.img} className="w-[52px] h-[52px] rounded-[10px] object-cover flex-shrink-0" alt={item.name} />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-[13px] truncate">{item.name}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[11px] text-gray px-2 py-[2px] border border-solid border-[#E5E5E5] rounded-full">{item.selectedSize}</span>
                                            <span className="w-[14px] h-[14px] rounded-full border border-solid border-[#E5E5E5] flex-shrink-0" style={{ backgroundColor: item.selectedColor }}></span>
                                            <span className="text-[11px] text-gray">{item.colorName}</span>
                                        </div>
                                        <p className="text-[12px] text-gray mt-1">×{item.qty} · ${item.price}</p>
                                    </div>
                                    <p className="font-semibold text-[14px] text-orange flex-shrink-0">${(parseFloat(item.price) * item.qty).toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order summary */}
                    <div className="bg-white border border-solid border-[#E5E5E5] rounded-[24px] px-5 py-4">
                        <h4 className="font-medium text-[14px] mb-3">Order Summary</h4>
                        <div className="flex flex-col gap-2 text-[13px]">
                            <div className="flex justify-between"><span className="text-gray">Subtotal</span><span>${order.subtotal?.toFixed(2) || order.total.toFixed(2)}</span></div>
                            {order.discount > 0 && <div className="flex justify-between"><span className="text-gray">Discount</span><span className="text-green-600">-${order.discount.toFixed(2)}</span></div>}
                            <div className="flex justify-between"><span className="text-gray">Shipping</span><span>{order.shippingCost === 0 ? 'Free' : `$${order.shippingCost?.toFixed(2)}`}</span></div>
                            <hr className="border-[#E5E5E5]" />
                            <div className="flex justify-between font-semibold text-[15px]"><span>Total</span><span>${order.total.toFixed(2)}</span></div>
                            {totalRefunded > 0 && <div className="flex justify-between text-red-500"><span>Refunded</span><span>-${totalRefunded.toFixed(2)}</span></div>}
                        </div>
                    </div>

                    {/* Refund History */}
                    <RefundHistoryCard order={order} />

                    {/* Documents */}
                    <div className="bg-white border border-solid border-[#E5E5E5] rounded-[24px] px-5 py-4">
                        <h4 className="font-medium text-[14px] mb-3 flex items-center gap-2">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                            Documents
                        </h4>
                        <div className="flex flex-col gap-2">
                            <button onClick={() => { setPrintType('picklist'); setModal('print') }}
                                className="flex items-center gap-3 p-3 rounded-[12px] border border-solid border-[#E5E5E5] hover:border-black transition-colors text-[13px] font-medium text-left">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                                Print Pick List
                            </button>
                            <button onClick={() => { setPrintType('packingslip'); setModal('print') }}
                                className="flex items-center gap-3 p-3 rounded-[12px] border border-solid border-[#E5E5E5] hover:border-black transition-colors text-[13px] font-medium text-left">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                                Print Packing Slip
                            </button>
                            {order.trackingNumber && (
                                <button onClick={() => { setPrintType('shippinglabel'); setModal('print') }}
                                    className="flex items-center gap-3 p-3 rounded-[12px] border border-solid border-[#E5E5E5] hover:border-black transition-colors text-[13px] font-medium text-left">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><circle cx="5.5" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="1.8"/><circle cx="18.5" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="1.8"/></svg>
                                    Print Shipping Label
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminOrderDetail
