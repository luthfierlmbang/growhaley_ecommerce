import React, { useState } from 'react'
import { useAdmin } from '../../context/AdminContext'

const STATUS_OPTIONS = ['All', 'Processing', 'Shipped', 'Completed', 'Cancelled']

const SC = {
    Completed:  { bg: '#F0FDF4', text: '#16A34A', border: '#BBF7D0' },
    Processing: { bg: '#FFF7ED', text: '#EA580C', border: '#FED7AA' },
    Shipped:    { bg: '#EFF6FF', text: '#2563EB', border: '#BFDBFE' },
    Cancelled:  { bg: '#FEF2F2', text: '#DC2626', border: '#FECACA' },
}

const DELIVERY_STEPS = [
    { key: 'placed',           label: 'Order Placed',      desc: 'Payment confirmed' },
    { key: 'processing',       label: 'Processing',        desc: 'Preparing package' },
    { key: 'shipped',          label: 'Shipped',           desc: 'Handed to courier' },
    { key: 'out_for_delivery', label: 'Out for Delivery',  desc: 'On the way' },
    { key: 'delivered',        label: 'Delivered',         desc: 'Package received' },
]

const CANCEL_REASONS = [
    'Item out of stock',
    'Customer requested cancellation',
    'Payment issue',
    'Shipping address invalid',
    'Duplicate order',
    'Other',
]

const fmtDate = (d) => new Date(d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
const fmtDateTime = (d) => new Date(d).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })

/* ── Delivery Timeline ── */
const DeliveryTimeline = ({ currentStep, isCancelled }) => {
    if (isCancelled) {
        return (
            <div className="flex items-center gap-3 p-4 bg-[#FEF2F2] border border-solid border-[#FECACA] rounded-[16px]">
                <div className="w-[40px] h-[40px] rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="#DC2626" strokeWidth="2" strokeLinecap="round"/></svg>
                </div>
                <div>
                    <p className="font-medium text-[14px] text-red-600">Order Cancelled</p>
                    <p className="text-[12px] text-red-400">This order has been cancelled and refund initiated</p>
                </div>
            </div>
        )
    }
    return (
        <div className="relative">
            <div className="absolute left-[19px] top-[20px] bottom-[20px] w-[2px] bg-[#E5E5E5]"></div>
            <div className="absolute left-[19px] top-[20px] w-[2px] bg-orange transition-all duration-700"
                style={{ height: currentStep >= DELIVERY_STEPS.length ? 'calc(100% - 40px)' : `${((currentStep - 1) / (DELIVERY_STEPS.length - 1)) * 100}%` }}>
            </div>
            <div className="flex flex-col gap-4">
                {DELIVERY_STEPS.map((step, idx) => {
                    const num = idx + 1
                    const done = num <= currentStep
                    const active = num === currentStep
                    return (
                        <div key={step.key} className="flex items-center gap-4 relative">
                            <div className={`w-[40px] h-[40px] rounded-full flex items-center justify-center flex-shrink-0 z-[1] border-2 border-solid transition-all ` +
                                (done ? 'bg-orange border-orange' : 'bg-white border-[#E5E5E5]')}>
                                {done
                                    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                    : <span className="text-[12px] font-medium text-gray">{num}</span>
                                }
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <p className={`font-medium text-[14px] ` + (done ? 'text-black' : 'text-gray')}>{step.label}</p>
                                    {active && <span className="text-[10px] font-medium px-2 py-[2px] bg-orange text-white rounded-full">Current</span>}
                                </div>
                                <p className={`text-[12px] ` + (done ? 'text-gray' : 'text-[#A3A3A3]')}>{step.desc}</p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

/* ── Cancel Modal ── */
const CancelModal = ({ order, onClose, onConfirm }) => {
    const [reason, setReason] = useState('')
    const [customReason, setCustomReason] = useState('')
    const [message, setMessage] = useState(`Dear ${order.customer},\n\nWe regret to inform you that your order ${order.ref} has been cancelled.\n\nReason: [reason]\n\nA full refund will be processed within 3-5 business days.\n\nWe apologize for the inconvenience.\n\nBest regards,\nLux Team`)
    const [sending, setSending] = useState(false)

    const handleReasonChange = (r) => {
        setReason(r)
        setMessage(`Dear ${order.customer},\n\nWe regret to inform you that your order ${order.ref} has been cancelled.\n\nReason: ${r === 'Other' ? customReason || '[please specify]' : r}\n\nA full refund will be processed within 3-5 business days.\n\nWe apologize for the inconvenience.\n\nBest regards,\nLux Team`)
    }

    const handleConfirm = () => {
        if (!reason) return
        setSending(true)
        setTimeout(() => {
            onConfirm(reason === 'Other' ? customReason || reason : reason, message)
            setSending(false)
        }, 800)
    }

    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center px-4" style={{ backgroundColor: 'rgba(23,23,23,0.6)' }}>
            <div className="bg-white rounded-[24px] w-full max-w-[520px] max-h-[90vh] overflow-y-auto">
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
                    {/* Reason */}
                    <div>
                        <label className="block font-medium text-[13px] mb-3">Cancellation Reason *</label>
                        <div className="flex flex-col gap-2">
                            {CANCEL_REASONS.map(r => (
                                <label key={r} className={`flex items-center gap-3 p-3 rounded-[12px] border border-solid cursor-pointer transition-all ` +
                                    (reason === r ? 'border-orange bg-[#FFF7ED]' : 'border-[#E5E5E5] hover:border-[#A3A3A3]')}>
                                    <div className={`w-[18px] h-[18px] rounded-full border-2 border-solid flex items-center justify-center flex-shrink-0 ` +
                                        (reason === r ? 'border-orange' : 'border-[#E5E5E5]')}>
                                        {reason === r && <div className="w-[8px] h-[8px] rounded-full bg-orange"></div>}
                                    </div>
                                    <span className="text-[13px] font-medium">{r}</span>
                                    <input type="radio" className="hidden" value={r} checked={reason === r} onChange={() => handleReasonChange(r)} />
                                </label>
                            ))}
                        </div>
                        {reason === 'Other' && (
                            <input type="text" value={customReason} onChange={e => { setCustomReason(e.target.value); handleReasonChange('Other') }}
                                placeholder="Specify reason..."
                                className="mt-2 w-full h-[48px] px-4 border border-solid border-[#E5E5E5] rounded-[8px] text-[13px] outline-none focus:border-black transition-colors" />
                        )}
                    </div>

                    {/* Message to customer */}
                    <div>
                        <label className="block font-medium text-[13px] mb-2">Message to Customer</label>
                        <p className="text-[12px] text-gray mb-2">This message will be sent to <span className="font-medium text-black">{order.email}</span></p>
                        <textarea value={message} onChange={e => setMessage(e.target.value)}
                            className="w-full px-4 py-3 border border-solid border-[#E5E5E5] rounded-[8px] text-[13px] outline-none focus:border-black transition-colors min-h-[160px] resize-none font-mono" />
                    </div>

                    {/* Warning */}
                    <div className="flex items-start gap-3 p-4 bg-[#FEF2F2] border border-solid border-[#FECACA] rounded-[16px]">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="flex-shrink-0 mt-[1px]"><path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="#DC2626" strokeWidth="1.8" strokeLinecap="round"/></svg>
                        <p className="text-[12px] text-red-600">This action cannot be undone. The order will be cancelled and a refund notification will be sent to the customer.</p>
                    </div>

                    <div className="flex gap-3">
                        <button onClick={onClose} className="flex-1 h-[48px] border border-solid border-[#E5E5E5] rounded-full text-[14px] font-medium hover:border-black transition-colors">
                            Keep Order
                        </button>
                        <button onClick={handleConfirm} disabled={!reason || sending}
                            className="flex-1 h-[48px] bg-red-500 text-white rounded-full text-[14px] font-medium hover:bg-red-600 transition-colors disabled:opacity-40">
                            {sending ? 'Cancelling...' : 'Cancel Order & Notify Customer'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

/* ── Order Detail Panel (full-screen slide-in) ── */
const OrderDetailPanel = ({ order, onClose, onStatusChange, onCancel, onAddNote }) => {
    const [activeTab, setActiveTab] = useState('overview')
    const [showCancel, setShowCancel] = useState(false)
    const [note, setNote] = useState('')
    const [noteSuccess, setNoteSuccess] = useState(false)

    const sc = SC[order.status] || SC.Processing
    const isCancelled = order.status === 'Cancelled'
    const deliveryStep = order.deliveryStep >= 0 ? order.deliveryStep + 1 : 0

    const NEXT_STATUS = { Processing: 'Shipped', Shipped: 'Completed' }
    const nextStatus = NEXT_STATUS[order.status]

    const handleAddNote = () => {
        if (!note.trim()) return
        onAddNote(order.ref, { text: note, date: new Date().toISOString(), author: 'Admin' })
        setNote('')
        setNoteSuccess(true)
        setTimeout(() => setNoteSuccess(false), 2000)
    }

    const handleCancel = (reason, message) => {
        onCancel(order.ref, reason, message)
        setShowCancel(false)
    }

    const TABS = ['overview', 'items', 'delivery', 'notes']

    return (
        <>
            {showCancel && <CancelModal order={order} onClose={() => setShowCancel(false)} onConfirm={handleCancel} />}

            <div className="fixed inset-0 z-[200] flex" style={{ backgroundColor: 'rgba(23,23,23,0.5)' }} onClick={onClose}>
                <div className="ml-auto w-full max-w-[680px] bg-white h-full overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
                    {/* Header */}
                    <div className="sticky top-0 bg-white border-b border-solid border-[#E5E5E5] px-6 py-4 z-[10]">
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <h4 className="font-Helvetica font-normal text-[22px]">{order.ref}</h4>
                                    <span className="text-[12px] font-medium px-3 py-[4px] rounded-full border border-solid" style={{ backgroundColor: sc.bg, color: sc.text, borderColor: sc.border }}>
                                        {order.status}
                                    </span>
                                </div>
                                <p className="text-gray text-[13px]">Placed on {fmtDate(order.date)}</p>
                            </div>
                            <button onClick={onClose} className="text-gray hover:text-black transition-colors mt-1">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                            </button>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2 flex-wrap">
                            {nextStatus && !isCancelled && (
                                <button onClick={() => onStatusChange(order.ref, nextStatus, { deliveryStep: (order.deliveryStep || 0) + 1 })}
                                    className="btnClass font-medium text-[12px] bg-orange !border-orange text-white flex items-center gap-2">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                    Mark as {nextStatus}
                                </button>
                            )}
                            {!isCancelled && order.status !== 'Completed' && (
                                <button onClick={() => setShowCancel(true)}
                                    className="btnClass font-medium text-[12px] !border-[#FECACA] text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                                    Cancel Order
                                </button>
                            )}
                        </div>

                        {/* Tabs */}
                        <div className="flex items-center gap-1 mt-4 border-b border-solid border-[#E5E5E5] -mb-4">
                            {TABS.map(tab => (
                                <button key={tab} onClick={() => setActiveTab(tab)}
                                    className={`px-4 py-2 text-[13px] font-medium capitalize border-b-2 border-solid transition-colors ` +
                                        (activeTab === tab ? 'border-black text-black' : 'border-transparent text-gray hover:text-black')}>
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="px-6 py-6">
                        {/* ── Tab: Overview ── */}
                        {activeTab === 'overview' && (
                            <div className="flex flex-col gap-5">
                                {/* Customer info */}
                                <div className="border border-solid border-[#E5E5E5] rounded-[16px] px-5 py-4">
                                    <h5 className="font-medium text-[14px] mb-3 flex items-center gap-2">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.8"/></svg>
                                        Customer
                                    </h5>
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-[40px] h-[40px] rounded-full bg-orange flex items-center justify-center flex-shrink-0">
                                            <span className="text-white font-medium text-[16px]">{order.customer.charAt(0)}</span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-[14px]">{order.customer}</p>
                                            <p className="text-gray text-[12px]">{order.email}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 text-[13px]">
                                        <div>
                                            <p className="text-gray text-[11px] mb-1">Phone</p>
                                            <p className="font-medium">{order.phone || order.address?.phone || '—'}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray text-[11px] mb-1">Payment</p>
                                            <p className="font-medium">{order.paymentMethod}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Shipping address */}
                                <div className="border border-solid border-[#E5E5E5] rounded-[16px] px-5 py-4">
                                    <h5 className="font-medium text-[14px] mb-3 flex items-center gap-2">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.8"/></svg>
                                        Shipping Address
                                    </h5>
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
                                <div className="border border-solid border-[#E5E5E5] rounded-[16px] px-5 py-4">
                                    <h5 className="font-medium text-[14px] mb-3 flex items-center gap-2">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><circle cx="5.5" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="1.8"/><circle cx="18.5" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="1.8"/></svg>
                                        Shipping & Payment
                                    </h5>
                                    <div className="grid grid-cols-2 gap-3 text-[13px]">
                                        <div>
                                            <p className="text-gray text-[11px] mb-1">Courier</p>
                                            <p className="font-medium">{order.shippingMethod}</p>
                                            <p className="text-gray text-[11px]">{order.shippingMethod === 'FedEx' ? 'Next day' : '3 business days'}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray text-[11px] mb-1">Shipping Cost</p>
                                            <p className="font-medium">{order.shippingCost === 0 ? 'Free' : `$${order.shippingCost?.toFixed(2)}`}</p>
                                        </div>
                                        {order.trackingNumber && (
                                            <div className="col-span-2">
                                                <p className="text-gray text-[11px] mb-1">Tracking Number</p>
                                                <div className="flex items-center gap-2">
                                                    <p className="font-medium font-mono text-[13px]">{order.trackingNumber}</p>
                                                    <button onClick={() => navigator.clipboard?.writeText(order.trackingNumber)} className="text-orange text-[11px] hover:underline">Copy</button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Order summary */}
                                <div className="border border-solid border-[#E5E5E5] rounded-[16px] px-5 py-4">
                                    <h5 className="font-medium text-[14px] mb-3">Order Summary</h5>
                                    <div className="flex flex-col gap-2 text-[13px]">
                                        <div className="flex justify-between"><span className="text-gray">Subtotal</span><span>${order.subtotal?.toFixed(2) || order.total.toFixed(2)}</span></div>
                                        {order.discount > 0 && <div className="flex justify-between"><span className="text-gray">Discount</span><span>-${order.discount.toFixed(2)}</span></div>}
                                        <div className="flex justify-between"><span className="text-gray">Shipping</span><span>{order.shippingCost === 0 ? 'Free' : `$${order.shippingCost?.toFixed(2)}`}</span></div>
                                        <hr className="border-[#E5E5E5]" />
                                        <div className="flex justify-between font-semibold text-[15px]"><span>Total</span><span>${order.total.toFixed(2)}</span></div>
                                    </div>
                                </div>

                                {/* Cancel info */}
                                {isCancelled && order.cancelReason && (
                                    <div className="border border-solid border-[#FECACA] rounded-[16px] px-5 py-4 bg-[#FEF2F2]">
                                        <h5 className="font-medium text-[14px] text-red-600 mb-2">Cancellation Details</h5>
                                        <p className="text-[13px] text-red-500 mb-2"><span className="font-medium">Reason:</span> {order.cancelReason}</p>
                                        {order.cancelMessage && (
                                            <div>
                                                <p className="text-[12px] text-gray mb-1">Message sent to customer:</p>
                                                <pre className="text-[12px] text-gray whitespace-pre-wrap font-sans bg-white p-3 rounded-[8px] border border-solid border-[#FECACA]">{order.cancelMessage}</pre>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ── Tab: Items ── */}
                        {activeTab === 'items' && (
                            <div className="flex flex-col gap-3">
                                {order.items.map((item, i) => (
                                    <div key={i} className="border border-solid border-[#E5E5E5] rounded-[16px] p-4 flex items-start gap-4">
                                        <img src={item.img} className="w-[80px] h-[80px] rounded-[12px] object-cover flex-shrink-0" alt={item.name} />
                                        <div className="flex-1">
                                            <h5 className="font-medium text-[15px] mb-2">{item.name}</h5>
                                            <div className="grid grid-cols-2 gap-2 text-[12px]">
                                                <div>
                                                    <p className="text-gray mb-1">Size</p>
                                                    <span className="font-medium px-3 py-[4px] border border-solid border-[#E5E5E5] rounded-full">{item.selectedSize || '—'}</span>
                                                </div>
                                                <div>
                                                    <p className="text-gray mb-1">Color</p>
                                                    <div className="flex items-center gap-2">
                                                        {item.selectedColor && <span className="w-[18px] h-[18px] rounded-full border border-solid border-[#E5E5E5]" style={{ backgroundColor: item.selectedColor }}></span>}
                                                        <span className="font-medium">{item.colorName || item.selectedColor || '—'}</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-gray mb-1">Quantity</p>
                                                    <p className="font-medium">×{item.qty}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray mb-1">Unit Price</p>
                                                    <p className="font-medium">${item.price}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-[16px] text-orange">${(parseFloat(item.price) * item.qty).toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                                <div className="flex justify-between items-center p-4 bg-[#F6F6F6] rounded-[16px] font-semibold text-[15px]">
                                    <span>Total</span>
                                    <span>${order.total.toFixed(2)}</span>
                                </div>
                            </div>
                        )}

                        {/* ── Tab: Delivery ── */}
                        {activeTab === 'delivery' && (
                            <div className="flex flex-col gap-5">
                                {order.trackingNumber && (
                                    <div className="border border-solid border-[#E5E5E5] rounded-[16px] px-5 py-4">
                                        <h5 className="font-medium text-[14px] mb-3">Tracking Information</h5>
                                        <div className="grid grid-cols-2 gap-3 text-[13px] mb-3">
                                            <div>
                                                <p className="text-gray text-[11px] mb-1">Courier</p>
                                                <p className="font-medium">{order.shippingMethod}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray text-[11px] mb-1">Tracking Number</p>
                                                <p className="font-medium font-mono">{order.trackingNumber}</p>
                                            </div>
                                        </div>
                                        <a href={`https://www.${order.shippingMethod?.toLowerCase()}.com/tracking`} target="_blank" rel="noreferrer"
                                            className="btnClass font-medium text-[12px] !border-[#E5E5E5] text-black hover:bg-black hover:text-white transition-colors flex items-center gap-2 w-fit">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                            Track on {order.shippingMethod} Website
                                        </a>
                                    </div>
                                )}

                                <div className="border border-solid border-[#E5E5E5] rounded-[16px] px-5 py-4">
                                    <h5 className="font-medium text-[14px] mb-4">Delivery Progress</h5>
                                    <DeliveryTimeline currentStep={deliveryStep} isCancelled={isCancelled} />
                                </div>

                                {/* Advance delivery step */}
                                {!isCancelled && order.status !== 'Completed' && (
                                    <div className="border border-solid border-[#E5E5E5] rounded-[16px] px-5 py-4">
                                        <h5 className="font-medium text-[14px] mb-2">Update Delivery Step</h5>
                                        <p className="text-gray text-[12px] mb-3">Manually advance the delivery tracking shown to the customer</p>
                                        <div className="flex flex-wrap gap-2">
                                            {DELIVERY_STEPS.map((step, idx) => {
                                                const num = idx + 1
                                                const isActive = num === deliveryStep
                                                return (
                                                    <button key={step.key}
                                                        onClick={() => onStatusChange(order.ref, order.status, { deliveryStep: idx })}
                                                        className={`px-4 py-[8px] rounded-full text-[12px] font-medium border border-solid transition-colors ` +
                                                            (isActive ? 'bg-orange border-orange text-white' : 'border-[#E5E5E5] text-gray hover:border-black hover:text-black')}>
                                                        {step.label}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ── Tab: Notes ── */}
                        {activeTab === 'notes' && (
                            <div className="flex flex-col gap-4">
                                <div className="border border-solid border-[#E5E5E5] rounded-[16px] px-5 py-4">
                                    <h5 className="font-medium text-[14px] mb-3">Add Internal Note</h5>
                                    <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Add a note about this order (internal only, not visible to customer)..."
                                        className="w-full px-4 py-3 border border-solid border-[#E5E5E5] rounded-[8px] text-[13px] outline-none focus:border-black transition-colors min-h-[100px] resize-none mb-3" />
                                    <div className="flex items-center gap-3">
                                        <button onClick={handleAddNote} disabled={!note.trim()}
                                            className="btnClass font-medium text-[13px] bg-black !border-black text-white hover:bg-orange hover:!border-orange transition-colors disabled:opacity-40">
                                            Add Note
                                        </button>
                                        {noteSuccess && <span className="text-[12px] text-green-600 font-medium">✓ Note added</span>}
                                    </div>
                                </div>

                                {order.notes?.length > 0 ? (
                                    <div className="flex flex-col gap-3">
                                        {[...order.notes].reverse().map((n, i) => (
                                            <div key={i} className="border border-solid border-[#E5E5E5] rounded-[16px] px-5 py-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="font-medium text-[13px]">{n.author}</span>
                                                    <span className="text-[11px] text-gray">{fmtDateTime(n.date)}</span>
                                                </div>
                                                <p className="text-[13px] text-gray">{n.text}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray text-[13px]">No notes yet</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

/* ── Main Orders Page ── */
const AdminOrders = () => {
    const { orders, updateOrderStatus, addOrderNote } = useAdmin()
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

    const handleStatusChange = (ref, status, extra = {}) => {
        updateOrderStatus(ref, status, extra)
        if (selected?.ref === ref) setSelected(prev => ({ ...prev, status, ...extra }))
    }

    const handleCancel = (ref, reason, message) => {
        updateOrderStatus(ref, 'Cancelled', { cancelReason: reason, cancelMessage: message, deliveryStep: -1 })
        if (selected?.ref === ref) setSelected(prev => ({ ...prev, status: 'Cancelled', cancelReason: reason, cancelMessage: message, deliveryStep: -1 }))
    }

    const handleAddNote = (ref, note) => {
        addOrderNote(ref, note)
        if (selected?.ref === ref) setSelected(prev => ({ ...prev, notes: [...(prev.notes || []), note] }))
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="font-Helvetica font-normal text-[32px] text-black">Orders</h1>
                <p className="text-gray text-[14px] lg:text-[16px] mt-1">{orders.length} total orders</p>
            </div>

            {/* Filters */}
            <div className="bg-white border border-solid border-[#E5E5E5] rounded-[24px] px-6 py-4 mb-4 flex flex-wrap items-center gap-3">
                <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by ref or customer..."
                    className="h-[48px] px-4 border border-solid border-[#E5E5E5] rounded-full text-[14px] outline-none focus:border-black transition-colors w-full sm:w-[260px]" />
                <div className="flex items-center gap-2 flex-wrap">
                    {STATUS_OPTIONS.map(s => (
                        <button key={s} onClick={() => setFilter(s)}
                            className={`px-4 py-[8px] rounded-full text-[12px] font-medium border border-solid transition-colors ` +
                                (filter === s ? 'bg-black text-white border-black' : 'border-[#E5E5E5] text-gray hover:border-black hover:text-black')}>
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-solid border-[#E5E5E5] rounded-[24px] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-[13px]">
                        <thead className="border-b border-solid border-[#E5E5E5] bg-[#F6F6F6]">
                            <tr>
                                <th className="text-left text-gray font-medium px-6 py-3">Ref</th>
                                <th className="text-left text-gray font-medium px-4 py-3">Customer</th>
                                <th className="text-left text-gray font-medium px-4 py-3">Items</th>
                                <th className="text-left text-gray font-medium px-4 py-3">Date</th>
                                <th className="text-left text-gray font-medium px-4 py-3">Courier</th>
                                <th className="text-right text-gray font-medium px-4 py-3">Total</th>
                                <th className="text-center text-gray font-medium px-4 py-3">Status</th>
                                <th className="text-center text-gray font-medium px-4 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(order => {
                                const sc = SC[order.status] || SC.Processing
                                return (
                                    <tr key={order.ref} className="border-b border-solid border-[#F5F5F5] last:border-0 hover:bg-[#FAFAFA] transition-colors cursor-pointer" onClick={() => setSelected(order)}>
                                        <td className="px-6 py-4 font-medium text-black">{order.ref}</td>
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
                                        <td className="px-4 py-4 text-gray">{order.shippingMethod}</td>
                                        <td className="px-4 py-4 text-right font-medium">${order.total.toFixed(2)}</td>
                                        <td className="px-4 py-4 text-center">
                                            <span className="inline-block text-[11px] font-medium px-3 py-[4px] rounded-full border border-solid" style={{ backgroundColor: sc.bg, color: sc.text, borderColor: sc.border }}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-center" onClick={e => e.stopPropagation()}>
                                            <button onClick={() => setSelected(order)} className="text-[12px] font-medium text-orange hover:underline">View Details</button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                    {filtered.length === 0 && <div className="text-center py-12 text-gray text-[14px]">No orders found.</div>}
                </div>
            </div>

            {/* Full detail panel */}
            {selected && (
                <OrderDetailPanel
                    order={selected}
                    onClose={() => setSelected(null)}
                    onStatusChange={handleStatusChange}
                    onCancel={handleCancel}
                    onAddNote={handleAddNote}
                />
            )}
        </div>
    )
}

export default AdminOrders
