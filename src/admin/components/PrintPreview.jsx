import React from 'react'

const fmtDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

/* ── Pick List ── */
const PickList = ({ order }) => (
    <div className="print-doc p-8 max-w-[800px] mx-auto font-Inter">
        <div className="flex items-start justify-between mb-6 pb-4 border-b border-solid border-[#E5E5E5]">
            <div>
                <h1 className="text-[24px] font-bold text-black mb-1">Pick List</h1>
                <p className="text-gray text-[13px]">Order: <strong>{order.ref}</strong></p>
                <p className="text-gray text-[13px]">Date: {fmtDate(order.date)}</p>
                <p className="text-gray text-[13px]">Admin: Admin Lux</p>
            </div>
            <div className="text-right">
                <div className="w-[48px] h-[48px] rounded-full bg-orange flex items-center justify-center">
                    <span className="text-white font-bold text-[22px]">L</span>
                </div>
            </div>
        </div>
        <table className="w-full text-[13px] border-collapse">
            <thead>
                <tr className="bg-[#F6F6F6]">
                    <th className="text-left px-3 py-2 border border-solid border-[#E5E5E5] font-medium">No</th>
                    <th className="text-left px-3 py-2 border border-solid border-[#E5E5E5] font-medium">Product</th>
                    <th className="text-left px-3 py-2 border border-solid border-[#E5E5E5] font-medium">SKU</th>
                    <th className="text-left px-3 py-2 border border-solid border-[#E5E5E5] font-medium">Size</th>
                    <th className="text-left px-3 py-2 border border-solid border-[#E5E5E5] font-medium">Color</th>
                    <th className="text-center px-3 py-2 border border-solid border-[#E5E5E5] font-medium">Qty</th>
                    <th className="text-left px-3 py-2 border border-solid border-[#E5E5E5] font-medium">Location</th>
                </tr>
            </thead>
            <tbody>
                {order.items.map((item, i) => (
                    <tr key={i} className="hover:bg-[#FAFAFA]">
                        <td className="px-3 py-2 border border-solid border-[#E5E5E5]">{i + 1}</td>
                        <td className="px-3 py-2 border border-solid border-[#E5E5E5] font-medium">{item.name}</td>
                        <td className="px-3 py-2 border border-solid border-[#E5E5E5] font-mono text-[12px]">LUX-{String(item.name.replace(/\s/g,'').toUpperCase().slice(0,4))}-{item.selectedSize}</td>
                        <td className="px-3 py-2 border border-solid border-[#E5E5E5]">{item.selectedSize}</td>
                        <td className="px-3 py-2 border border-solid border-[#E5E5E5]">
                            <div className="flex items-center gap-2">
                                <span className="w-[14px] h-[14px] rounded-full border border-solid border-[#E5E5E5] flex-shrink-0" style={{ backgroundColor: item.selectedColor }}></span>
                                {item.colorName}
                            </div>
                        </td>
                        <td className="px-3 py-2 border border-solid border-[#E5E5E5] text-center font-bold">{item.qty}</td>
                        <td className="px-3 py-2 border border-solid border-[#E5E5E5] text-gray">Rack A-{i + 3}</td>
                    </tr>
                ))}
            </tbody>
        </table>
        <div className="mt-4 pt-4 border-t border-solid border-[#E5E5E5] flex justify-between text-[13px]">
            <span className="text-gray">Total items: <strong>{order.items.reduce((s, it) => s + it.qty, 0)}</strong></span>
            <span className="text-gray">Picked by: ________________</span>
        </div>
    </div>
)

/* ── Packing Slip ── */
const PackingSlip = ({ order }) => (
    <div className="print-doc p-8 max-w-[800px] mx-auto font-Inter">
        <div className="flex items-start justify-between mb-6 pb-4 border-b border-solid border-[#E5E5E5]">
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-[40px] h-[40px] rounded-full bg-orange flex items-center justify-center">
                        <span className="text-white font-bold text-[18px]">L</span>
                    </div>
                    <div>
                        <p className="font-bold text-[18px]">Lux</p>
                        <p className="text-gray text-[11px]">123 Fashion St, New York, NY 10001</p>
                    </div>
                </div>
            </div>
            <div className="text-right">
                <h2 className="text-[20px] font-bold mb-1">Packing Slip</h2>
                <p className="text-gray text-[13px]">Order: <strong>{order.ref}</strong></p>
                <p className="text-gray text-[13px]">Date: {fmtDate(order.date)}</p>
            </div>
        </div>
        <div className="mb-5">
            <p className="font-medium text-[13px] mb-1">Ship To:</p>
            <p className="font-bold text-[14px]">{order.customer}</p>
            {order.address && (
                <div className="text-[13px] text-gray">
                    <p>{order.address.street}</p>
                    <p>{order.address.city}, {order.address.region} {order.address.postal}</p>
                    <p>{order.address.country}</p>
                    <p>{order.address.phone}</p>
                </div>
            )}
        </div>
        <table className="w-full text-[13px] border-collapse mb-4">
            <thead>
                <tr className="bg-[#F6F6F6]">
                    <th className="text-left px-3 py-2 border border-solid border-[#E5E5E5] font-medium">Product</th>
                    <th className="text-left px-3 py-2 border border-solid border-[#E5E5E5] font-medium">Size</th>
                    <th className="text-left px-3 py-2 border border-solid border-[#E5E5E5] font-medium">Color</th>
                    <th className="text-center px-3 py-2 border border-solid border-[#E5E5E5] font-medium">Qty</th>
                    <th className="text-right px-3 py-2 border border-solid border-[#E5E5E5] font-medium">Price</th>
                    <th className="text-right px-3 py-2 border border-solid border-[#E5E5E5] font-medium">Subtotal</th>
                </tr>
            </thead>
            <tbody>
                {order.items.map((item, i) => (
                    <tr key={i}>
                        <td className="px-3 py-2 border border-solid border-[#E5E5E5] font-medium">{item.name}</td>
                        <td className="px-3 py-2 border border-solid border-[#E5E5E5]">{item.selectedSize}</td>
                        <td className="px-3 py-2 border border-solid border-[#E5E5E5]">{item.colorName}</td>
                        <td className="px-3 py-2 border border-solid border-[#E5E5E5] text-center">{item.qty}</td>
                        <td className="px-3 py-2 border border-solid border-[#E5E5E5] text-right">${item.price}</td>
                        <td className="px-3 py-2 border border-solid border-[#E5E5E5] text-right font-medium">${(parseFloat(item.price) * item.qty).toFixed(2)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
        <div className="flex justify-end mb-6">
            <div className="w-[240px] flex flex-col gap-1 text-[13px]">
                <div className="flex justify-between"><span className="text-gray">Subtotal</span><span>${order.subtotal?.toFixed(2) || order.total.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-gray">Shipping</span><span>{order.shippingCost === 0 ? 'Free' : `$${order.shippingCost?.toFixed(2)}`}</span></div>
                <div className="flex justify-between font-bold text-[15px] pt-1 border-t border-solid border-[#E5E5E5]"><span>Total</span><span>${order.total.toFixed(2)}</span></div>
            </div>
        </div>
        <div className="text-center pt-4 border-t border-solid border-[#E5E5E5]">
            <p className="text-[14px] font-medium text-gray">Thank you for your order!</p>
            <p className="text-[12px] text-gray mt-1">Questions? Contact us at support@lux.com</p>
        </div>
    </div>
)

/* ── Shipping Label ── */
const ShippingLabel = ({ order }) => (
    <div className="print-doc p-8 max-w-[600px] mx-auto font-Inter">
        <div className="border-4 border-solid border-black rounded-[16px] p-6">
            <div className="flex justify-between items-start mb-6 pb-4 border-b-2 border-solid border-black">
                <div>
                    <p className="text-[11px] font-bold text-gray uppercase tracking-widest mb-1">FROM</p>
                    <p className="font-bold text-[16px]">Lux Global Inc</p>
                    <p className="text-[13px]">123 Fashion St</p>
                    <p className="text-[13px]">New York, NY 10001</p>
                    <p className="text-[13px]">USA</p>
                </div>
                <div className="w-[56px] h-[56px] rounded-full bg-orange flex items-center justify-center">
                    <span className="text-white font-bold text-[24px]">L</span>
                </div>
            </div>
            <div className="mb-6 pb-4 border-b-2 border-solid border-black">
                <p className="text-[11px] font-bold text-gray uppercase tracking-widest mb-1">TO</p>
                <p className="font-bold text-[22px]">{order.customer}</p>
                {order.address && (
                    <div className="text-[15px] mt-1">
                        <p>{order.address.street}</p>
                        <p>{order.address.city}, {order.address.region} {order.address.postal}</p>
                        <p className="font-bold">{order.address.country}</p>
                        <p className="text-gray">{order.address.phone}</p>
                    </div>
                )}
            </div>
            <div className="mb-4 pb-4 border-b-2 border-solid border-[#E5E5E5]">
                <p className="text-[11px] font-bold text-gray uppercase tracking-widest mb-2">ORDER REFERENCE</p>
                <p className="font-mono font-bold text-[32px] tracking-widest text-center py-2 bg-[#F6F6F6] rounded-[8px]">{order.ref}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-[13px]">
                <div>
                    <p className="text-[11px] font-bold text-gray uppercase tracking-widest mb-1">Courier</p>
                    <p className="font-bold text-[16px]">{order.shippingMethod}</p>
                </div>
                {order.trackingNumber && (
                    <div>
                        <p className="text-[11px] font-bold text-gray uppercase tracking-widest mb-1">Tracking</p>
                        <p className="font-mono font-bold text-[14px]">{order.trackingNumber}</p>
                    </div>
                )}
            </div>
        </div>
    </div>
)

/* ── Print Preview Modal ── */
const PrintPreview = ({ order, type, onClose }) => {
    const handlePrint = () => window.print()

    const titles = { picklist: 'Pick List', packingslip: 'Packing Slip', shippinglabel: 'Shipping Label' }

    return (
        <>
            {/* Print-only styles */}
            <style>{`
                @media print {
                    body > * { display: none !important; }
                    .print-modal { display: block !important; position: static !important; background: white !important; }
                    .print-modal .no-print { display: none !important; }
                    .print-doc { display: block !important; }
                }
            `}</style>

            <div className="print-modal fixed inset-0 z-[500] flex items-center justify-center" style={{ backgroundColor: 'rgba(23,23,23,0.7)' }}>
                <div className="bg-white rounded-[24px] w-full max-w-[900px] max-h-[90vh] flex flex-col overflow-hidden">
                    {/* Header */}
                    <div className="no-print px-6 py-4 border-b border-solid border-[#E5E5E5] flex items-center justify-between flex-shrink-0">
                        <h4 className="font-Helvetica font-normal text-[20px]">{titles[type] || 'Document'}</h4>
                        <div className="flex items-center gap-3">
                            <button onClick={handlePrint}
                                className="h-[40px] px-5 rounded-full bg-black text-white text-[13px] font-medium hover:bg-orange transition-colors flex items-center gap-2">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v8H6v-8z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                Print
                            </button>
                            <button onClick={onClose} className="text-gray hover:text-black transition-colors">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                            </button>
                        </div>
                    </div>
                    {/* Content */}
                    <div className="flex-1 overflow-y-auto bg-[#F6F6F6] p-6">
                        <div className="bg-white rounded-[16px] shadow-sm">
                            {type === 'picklist'      && <PickList order={order} />}
                            {type === 'packingslip'   && <PackingSlip order={order} />}
                            {type === 'shippinglabel' && <ShippingLabel order={order} />}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PrintPreview
