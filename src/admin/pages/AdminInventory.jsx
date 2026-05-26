import React, { useState } from 'react'
import { useAdmin } from '../../context/AdminContext'

const CATEGORIES = ['All', 'Coat', 'Dress', 'T-Shirt', 'Pants', 'Skirt', 'Jacket', 'Shoes', 'Accessories']
const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
const COLOR_OPTIONS = [
    { name: 'Yellows', hex: '#F4DE6E' }, { name: 'Purple', hex: '#8152A0' },
    { name: 'Gray',    hex: '#838382' }, { name: 'White',  hex: '#FFFFFF' },
    { name: 'Kaki',    hex: '#8A8972' }, { name: 'Browns', hex: '#614126' },
    { name: 'Roses',   hex: '#D574B2' }, { name: 'Black',  hex: '#171717' },
    { name: 'Green',   hex: '#6A873A' }, { name: 'Maroon', hex: '#723020' },
    { name: 'Orange',  hex: '#DF8F5A' }, { name: 'Beiges', hex: '#CDBF9A' },
]
const STYLE_OPTIONS = ['Casual', 'Basic', 'Classic', 'Sport', 'Formal']
const IMG_OPTIONS = ['/images/p (1).png', '/images/p (2).png', '/images/p (3).png']

const stockBadge = (stock) => {
    if (stock === 0) return { label: 'Out of Stock', bg: '#FEF2F2', text: '#DC2626', border: '#FECACA' }
    if (stock <= 5)  return { label: 'Low Stock',    bg: '#FFF7ED', text: '#EA580C', border: '#FED7AA' }
    return                  { label: 'In Stock',     bg: '#F0FDF4', text: '#16A34A', border: '#BBF7D0' }
}

const EMPTY_FORM = {
    name: '', category: 'Coat', price: '', stock: '', img: '/images/p (2).png',
    status: 'Active', description: '', material: '', style: 'Casual',
    sizes: [], colors: [], images: ['/images/p (2).png'],
}

/* ── Step indicator ── */
const StepBar = ({ step }) => {
    const steps = ['Basic Info', 'Details & Variants', 'Images & Preview']
    return (
        <div className="flex items-center gap-0 mb-6">
            {steps.map((s, i) => {
                const num = i + 1
                const done = step > num
                const active = step === num
                return (
                    <React.Fragment key={s}>
                        <div className="flex items-center gap-2">
                            <div className={`w-[28px] h-[28px] rounded-full flex items-center justify-center text-[12px] font-medium border border-solid transition-all ` +
                                (done ? 'bg-orange border-orange text-white' : active ? 'bg-black border-black text-white' : 'bg-white border-[#E5E5E5] text-gray')}>
                                {done ? '✓' : num}
                            </div>
                            <span className={`text-[12px] font-medium hidden sm:block ` + (active ? 'text-black' : 'text-gray')}>{s}</span>
                        </div>
                        {i < steps.length - 1 && <div className="flex-1 h-[1px] bg-[#E5E5E5] mx-3"></div>}
                    </React.Fragment>
                )
            })}
        </div>
    )
}

const AdminInventory = () => {
    const { inventory, updateProduct, addProduct, deleteProduct } = useAdmin()
    const [catFilter, setCatFilter] = useState('All')
    const [search, setSearch]       = useState('')
    const [editing, setEditing]     = useState(null)
    const [adding, setAdding]       = useState(false)
    const [form, setForm]           = useState(EMPTY_FORM)
    const [step, setStep]           = useState(1)
    const [confirmDelete, setConfirmDelete] = useState(null)

    const filtered = inventory
        .filter(p => catFilter === 'All' || p.category === catFilter)
        .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))

    const openEdit = (p) => {
        setEditing(p)
        setForm({ name: p.name, category: p.category, price: p.price, stock: p.stock, img: p.img, status: p.status, description: p.description || '', material: p.material || '', style: p.style || 'Casual', sizes: p.sizes || [], colors: p.colors || [], images: p.images || [p.img] })
        setStep(1)
    }
    const openAdd = () => { setAdding(true); setForm(EMPTY_FORM); setStep(1) }
    const closeModal = () => { setEditing(null); setAdding(false); setStep(1) }

    const toggleSize  = (s) => setForm(f => ({ ...f, sizes:  f.sizes.includes(s)  ? f.sizes.filter(x => x !== s)  : [...f.sizes, s] }))
    const toggleColor = (c) => setForm(f => ({ ...f, colors: f.colors.includes(c) ? f.colors.filter(x => x !== c) : [...f.colors, c] }))
    const toggleImg   = (i) => setForm(f => ({ ...f, images: f.images.includes(i) ? f.images.filter(x => x !== i) : [...f.images, i], img: f.images.includes(i) ? (f.images.filter(x => x !== i)[0] || '/images/p (2).png') : i }))

    const handleSave = () => {
        if (!form.name || !form.price || form.stock === '') return
        const data = { ...form, price: parseFloat(form.price), stock: parseInt(form.stock) }
        if (editing) updateProduct(editing.id, data)
        else addProduct(data)
        closeModal()
    }

    const canNext = () => {
        if (step === 1) return form.name && form.price && form.stock !== '' && form.category
        if (step === 2) return true
        return true
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="font-Helvetica font-normal text-[32px] text-black">Inventory</h1>
                    <p className="text-gray text-[14px] lg:text-[16px] mt-1">{inventory.length} products</p>
                </div>
                <button onClick={openAdd} className="btnClass font-medium text-[12px] lg:text-[14px] bg-orange !border-orange text-white flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                    Add Product
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white border border-solid border-[#E5E5E5] rounded-[24px] px-6 py-4 mb-4 flex flex-wrap items-center gap-3">
                <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..."
                    className="h-[48px] px-4 border border-solid border-[#E5E5E5] rounded-full text-[14px] outline-none focus:border-black transition-colors w-full sm:w-[220px]" />
                <div className="flex items-center gap-2 flex-wrap">
                    {CATEGORIES.map(c => (
                        <button key={c} onClick={() => setCatFilter(c)}
                            className={`px-4 py-[8px] rounded-full text-[12px] font-medium border border-solid transition-colors ` +
                                (catFilter === c ? 'bg-black text-white border-black' : 'border-[#E5E5E5] text-gray hover:border-black hover:text-black')}>
                            {c}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map(p => {
                    const sb = stockBadge(p.stock)
                    return (
                        <div key={p.id} className="bg-white border border-solid border-[#E5E5E5] rounded-[24px] overflow-hidden group hover:shadow-md transition-shadow">
                            <div className="relative overflow-hidden h-[200px]">
                                <img src={p.img} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt={p.name} />
                                <span className="absolute top-3 left-3 text-[11px] font-medium px-3 py-[4px] rounded-full border border-solid" style={{ backgroundColor: sb.bg, color: sb.text, borderColor: sb.border }}>
                                    {sb.label}
                                </span>
                            </div>
                            <div className="px-4 py-4">
                                <p className="text-[11px] text-gray mb-1">{p.category}</p>
                                <h5 className="font-medium text-[15px] mb-2">{p.name}</h5>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-semibold text-[16px] text-orange">${p.price}</span>
                                    <span className="text-[12px] text-gray">{p.stock} in stock</span>
                                </div>
                                {p.sizes?.length > 0 && (
                                    <div className="flex gap-1 mb-2 flex-wrap">
                                        {p.sizes.map(s => <span key={s} className="text-[10px] px-2 py-[2px] border border-solid border-[#E5E5E5] rounded-full">{s}</span>)}
                                    </div>
                                )}
                                {p.colors?.length > 0 && (
                                    <div className="flex gap-1 mb-3">
                                        {p.colors.map(c => <span key={c} className="w-[14px] h-[14px] rounded-full border border-solid border-[#E5E5E5]" style={{ backgroundColor: c }}></span>)}
                                    </div>
                                )}
                                <div className="flex items-center justify-between text-[12px] text-gray mb-3">
                                    <span>{p.sold} sold</span>
                                    <span>${(p.sold * p.price).toFixed(0)} revenue</span>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => openEdit(p)} className="flex-1 py-[8px] border border-solid border-[#E5E5E5] rounded-full text-[12px] font-medium hover:border-black hover:text-black transition-colors">Edit</button>
                                    <button onClick={() => setConfirmDelete(p)} className="flex-1 py-[8px] border border-solid border-[#FECACA] text-red-500 rounded-full text-[12px] font-medium hover:bg-red-50 transition-colors">Delete</button>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
            {filtered.length === 0 && <div className="text-center py-16 text-gray text-[14px]">No products found.</div>}

            {/* ── Add / Edit Modal — Multi-step ── */}
            {(editing || adding) && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center px-4" style={{ backgroundColor: 'rgba(23,23,23,0.5)', backdropFilter: 'blur(4px)' }}>
                    <div className="bg-white rounded-[24px] w-full max-w-[560px] max-h-[92vh] overflow-y-auto">
                        <div className="px-6 py-5 border-b border-solid border-[#E5E5E5] flex items-center justify-between">
                            <h4 className="font-Helvetica font-normal text-[20px]">{adding ? 'Add New Product' : 'Edit Product'}</h4>
                            <button onClick={closeModal} className="text-gray hover:text-black transition-colors">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                            </button>
                        </div>
                        <div className="px-6 py-5">
                            <StepBar step={step} />

                            {/* ── Step 1: Basic Info ── */}
                            {step === 1 && (
                                <div className="flex flex-col gap-4">
                                    <div>
                                        <label className="block font-medium text-[12px] lg:text-[14px] mb-2">Product Name *</label>
                                        <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Winter Coat"
                                            className="w-full h-[56px] px-4 border border-solid border-[#E5E5E5] rounded-[8px] text-[14px] outline-none focus:border-black transition-colors" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block font-medium text-[12px] lg:text-[14px] mb-2">Price ($) *</label>
                                            <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="0.00"
                                                className="w-full h-[56px] px-4 border border-solid border-[#E5E5E5] rounded-[8px] text-[14px] outline-none focus:border-black transition-colors" />
                                        </div>
                                        <div>
                                            <label className="block font-medium text-[12px] lg:text-[14px] mb-2">Stock *</label>
                                            <input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} placeholder="0"
                                                className="w-full h-[56px] px-4 border border-solid border-[#E5E5E5] rounded-[8px] text-[14px] outline-none focus:border-black transition-colors" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block font-medium text-[12px] lg:text-[14px] mb-2">Category *</label>
                                            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                                                className="w-full h-[56px] px-4 border border-solid border-[#E5E5E5] rounded-[8px] text-[14px] outline-none focus:border-black transition-colors bg-white">
                                                {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block font-medium text-[12px] lg:text-[14px] mb-2">Status</label>
                                            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
                                                className="w-full h-[56px] px-4 border border-solid border-[#E5E5E5] rounded-[8px] text-[14px] outline-none focus:border-black transition-colors bg-white">
                                                <option>Active</option><option>Inactive</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ── Step 2: Details & Variants ── */}
                            {step === 2 && (
                                <div className="flex flex-col gap-5">
                                    <div>
                                        <label className="block font-medium text-[12px] lg:text-[14px] mb-2">Description</label>
                                        <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Describe the product — material, fit, occasion..."
                                            className="w-full px-4 py-3 border border-solid border-[#E5E5E5] rounded-[8px] text-[14px] outline-none focus:border-black transition-colors min-h-[100px] resize-none" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block font-medium text-[12px] lg:text-[14px] mb-2">Material</label>
                                            <input type="text" value={form.material} onChange={e => setForm({ ...form, material: e.target.value })} placeholder="e.g. 100% Cotton"
                                                className="w-full h-[56px] px-4 border border-solid border-[#E5E5E5] rounded-[8px] text-[14px] outline-none focus:border-black transition-colors" />
                                        </div>
                                        <div>
                                            <label className="block font-medium text-[12px] lg:text-[14px] mb-2">Style</label>
                                            <select value={form.style} onChange={e => setForm({ ...form, style: e.target.value })}
                                                className="w-full h-[56px] px-4 border border-solid border-[#E5E5E5] rounded-[8px] text-[14px] outline-none focus:border-black transition-colors bg-white">
                                                {STYLE_OPTIONS.map(s => <option key={s}>{s}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block font-medium text-[12px] lg:text-[14px] mb-2">Available Sizes</label>
                                        <div className="flex gap-2 flex-wrap">
                                            {SIZE_OPTIONS.map(s => (
                                                <button key={s} type="button" onClick={() => toggleSize(s)}
                                                    className={`w-[44px] h-[44px] rounded-full border border-solid text-[13px] font-medium transition-colors ` +
                                                        (form.sizes.includes(s) ? 'bg-orange border-orange text-white' : 'border-[#E5E5E5] text-gray hover:border-black hover:text-black')}>
                                                    {s}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block font-medium text-[12px] lg:text-[14px] mb-2">Available Colors</label>
                                        <div className="grid grid-cols-6 gap-3">
                                            {COLOR_OPTIONS.map(c => (
                                                <div key={c.hex} onClick={() => toggleColor(c.hex)} className="flex flex-col items-center gap-1 cursor-pointer">
                                                    <div className={`w-[36px] h-[36px] rounded-full border-2 border-solid transition-all ` +
                                                        (form.colors.includes(c.hex) ? 'border-orange scale-110' : 'border-[#E5E5E5]')}
                                                        style={{ backgroundColor: c.hex }}>
                                                    </div>
                                                    <span className="text-[9px] text-gray text-center leading-tight">{c.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ── Step 3: Images & Preview ── */}
                            {step === 3 && (
                                <div className="flex flex-col gap-5">
                                    <div>
                                        <label className="block font-medium text-[12px] lg:text-[14px] mb-2">Product Images</label>
                                        <p className="text-[12px] text-gray mb-3">Select images to use for this product (as shown on the customer detail page)</p>
                                        <div className="grid grid-cols-3 gap-3">
                                            {IMG_OPTIONS.map(img => (
                                                <div key={img} onClick={() => toggleImg(img)}
                                                    className={`relative rounded-[16px] overflow-hidden cursor-pointer border-2 border-solid transition-all ` +
                                                        (form.images.includes(img) ? 'border-orange' : 'border-[#E5E5E5]')}>
                                                    <img src={img} className="w-full h-[100px] object-cover" alt="" />
                                                    {form.images.includes(img) && (
                                                        <div className="absolute top-2 right-2 w-[20px] h-[20px] rounded-full bg-orange flex items-center justify-center">
                                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Preview card — matches customer CardProduct */}
                                    <div>
                                        <label className="block font-medium text-[12px] lg:text-[14px] mb-2">Customer Preview</label>
                                        <p className="text-[12px] text-gray mb-3">This is how the product will appear on the customer website</p>
                                        <div className="border border-solid border-[#E5E5E5] rounded-[24px] overflow-hidden max-w-[220px]">
                                            <div className="overflow-hidden rounded-t-[24px]">
                                                <img src={form.img} className="w-full h-[180px] object-cover" alt={form.name} />
                                            </div>
                                            <div className="p-3">
                                                <h5 className="font-medium text-[14px]">{form.name || 'Product Name'}</h5>
                                                <p className="text-gray text-[12px]">{form.category}</p>
                                                <div className="flex items-center justify-between mt-2">
                                                    <span className="font-medium text-[13px] px-3 py-[4px] border border-solid border-[#E5E5E5] rounded-full">${form.price || '0.00'}</span>
                                                </div>
                                                {form.sizes.length > 0 && (
                                                    <div className="flex gap-1 mt-2 flex-wrap">
                                                        {form.sizes.map(s => <span key={s} className="text-[9px] px-2 py-[2px] border border-solid border-[#E5E5E5] rounded-full">{s}</span>)}
                                                    </div>
                                                )}
                                                {form.colors.length > 0 && (
                                                    <div className="flex gap-1 mt-2">
                                                        {form.colors.map(c => <span key={c} className="w-[12px] h-[12px] rounded-full border border-solid border-[#E5E5E5]" style={{ backgroundColor: c }}></span>)}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Navigation buttons */}
                            <div className="flex gap-3 mt-6">
                                {step > 1 && (
                                    <button onClick={() => setStep(step - 1)} className="flex-1 h-[48px] border border-solid border-[#E5E5E5] rounded-full text-[14px] font-medium hover:border-black transition-colors">
                                        ← Back
                                    </button>
                                )}
                                {step < 3 ? (
                                    <button onClick={() => canNext() && setStep(step + 1)} disabled={!canNext()}
                                        className="flex-1 h-[48px] bg-black text-white rounded-full text-[14px] font-medium hover:bg-orange transition-colors disabled:opacity-40">
                                        Next →
                                    </button>
                                ) : (
                                    <button onClick={handleSave} className="flex-1 h-[48px] bg-orange !border-orange text-white rounded-full text-[14px] font-medium hover:bg-black transition-colors">
                                        {adding ? 'Add Product' : 'Save Changes'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Confirm Delete ── */}
            {confirmDelete && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center px-4" style={{ backgroundColor: 'rgba(23,23,23,0.5)', backdropFilter: 'blur(4px)' }}>
                    <div className="bg-white rounded-[24px] w-full max-w-[360px] px-6 py-6 text-center">
                        <div className="w-[56px] h-[56px] rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="#DC2626" strokeWidth="1.8" strokeLinecap="round"/></svg>
                        </div>
                        <h4 className="font-Helvetica font-normal text-[20px] mb-2">Delete Product?</h4>
                        <p className="text-gray text-[14px] mb-6">"{confirmDelete.name}" will be permanently removed from inventory.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setConfirmDelete(null)} className="flex-1 h-[48px] border border-solid border-[#E5E5E5] rounded-full text-[14px] font-medium hover:border-black transition-colors">Cancel</button>
                            <button onClick={() => { deleteProduct(confirmDelete.id); setConfirmDelete(null) }} className="flex-1 h-[48px] bg-red-500 text-white rounded-full text-[14px] font-medium hover:bg-red-600 transition-colors">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminInventory
