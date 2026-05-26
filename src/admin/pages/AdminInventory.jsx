import React, { useState } from 'react'
import { useAdmin } from '../../context/AdminContext'

const CATEGORIES = ['All', 'Coat', 'Dress', 'T-Shirt', 'Pants', 'Skirt', 'Jacket', 'Shoes', 'Accessories']

const stockBadge = (stock) => {
    if (stock === 0)  return { label: 'Out of Stock', bg: '#FEF2F2', text: '#DC2626', border: '#FECACA' }
    if (stock <= 5)   return { label: 'Low Stock',    bg: '#FFF7ED', text: '#EA580C', border: '#FED7AA' }
    return                   { label: 'In Stock',     bg: '#F0FDF4', text: '#16A34A', border: '#BBF7D0' }
}

const EMPTY_FORM = { name: '', category: 'Coat', price: '', stock: '', img: '/images/p (2).png', status: 'Active' }

const AdminInventory = () => {
    const { inventory, updateProduct, addProduct, deleteProduct } = useAdmin()
    const [catFilter, setCatFilter] = useState('All')
    const [search, setSearch]       = useState('')
    const [editing, setEditing]     = useState(null)   // product being edited
    const [adding, setAdding]       = useState(false)
    const [form, setForm]           = useState(EMPTY_FORM)
    const [confirmDelete, setConfirmDelete] = useState(null)

    const filtered = inventory
        .filter(p => catFilter === 'All' || p.category === catFilter)
        .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))

    const openEdit = (p) => { setEditing(p); setForm({ name: p.name, category: p.category, price: p.price, stock: p.stock, img: p.img, status: p.status }) }
    const openAdd  = ()  => { setAdding(true); setForm(EMPTY_FORM) }
    const closeModal = () => { setEditing(null); setAdding(false) }

    const handleSave = () => {
        if (!form.name || !form.price || form.stock === '') return
        if (editing) {
            updateProduct(editing.id, { ...form, price: parseFloat(form.price), stock: parseInt(form.stock) })
        } else {
            addProduct({ ...form, price: parseFloat(form.price), stock: parseInt(form.stock) })
        }
        closeModal()
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="font-Helvetica font-normal text-[28px] text-[#171717]">Inventory</h1>
                    <p className="text-gray text-[14px] mt-1">{inventory.length} products</p>
                </div>
                <button
                    onClick={openAdd}
                    className="flex items-center gap-2 px-5 py-[10px] bg-[#171717] text-white rounded-full text-[13px] font-medium hover:bg-orange transition-colors"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                    Add Product
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white border border-solid border-[#E5E5E5] rounded-[16px] px-6 py-4 mb-4 flex flex-wrap items-center gap-3">
                <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search products..."
                    className="h-[40px] px-4 border border-solid border-[#E5E5E5] rounded-full text-[13px] outline-none focus:border-[#171717] transition-colors w-full sm:w-[220px]"
                />
                <div className="flex items-center gap-2 flex-wrap">
                    {CATEGORIES.map(c => (
                        <button
                            key={c}
                            onClick={() => setCatFilter(c)}
                            className={`px-3 py-[5px] rounded-full text-[12px] font-medium border border-solid transition-colors ` +
                                (catFilter === c ? 'bg-[#171717] text-white border-[#171717]' : 'border-[#E5E5E5] text-gray hover:border-[#171717] hover:text-black')}
                        >
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
                        <div key={p.id} className="bg-white border border-solid border-[#E5E5E5] rounded-[16px] overflow-hidden hover:shadow-md transition-shadow">
                            <div className="relative overflow-hidden h-[180px]">
                                <img src={p.img} className="w-full h-full object-cover" alt={p.name} />
                                <span className="absolute top-3 left-3 text-[11px] font-medium px-2 py-[3px] rounded-full border border-solid" style={{ backgroundColor: sb.bg, color: sb.text, borderColor: sb.border }}>
                                    {sb.label}
                                </span>
                            </div>
                            <div className="px-4 py-4">
                                <p className="text-[11px] text-gray mb-1">{p.category}</p>
                                <h5 className="font-medium text-[15px] mb-2">{p.name}</h5>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="font-semibold text-[16px] text-orange">${p.price}</span>
                                    <span className="text-[12px] text-gray">{p.stock} in stock</span>
                                </div>
                                <div className="flex items-center justify-between text-[12px] text-gray mb-3">
                                    <span>{p.sold} sold</span>
                                    <span>${(p.sold * p.price).toFixed(0)} revenue</span>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => openEdit(p)}
                                        className="flex-1 py-[7px] border border-solid border-[#E5E5E5] rounded-full text-[12px] font-medium hover:border-[#171717] hover:text-black transition-colors"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => setConfirmDelete(p)}
                                        className="flex-1 py-[7px] border border-solid border-[#FECACA] text-red-500 rounded-full text-[12px] font-medium hover:bg-red-50 transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {filtered.length === 0 && (
                <div className="text-center py-16 text-gray text-[14px]">No products found.</div>
            )}

            {/* ── Edit / Add Modal ── */}
            {(editing || adding) && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center px-4" style={{ backgroundColor: 'rgba(23,23,23,0.5)' }}>
                    <div className="bg-white rounded-[16px] w-full max-w-[480px] max-h-[90vh] overflow-y-auto">
                        <div className="px-6 py-5 border-b border-solid border-[#E5E5E5] flex items-center justify-between">
                            <h4 className="font-Helvetica font-normal text-[18px]">{adding ? 'Add Product' : 'Edit Product'}</h4>
                            <button onClick={closeModal} className="text-gray hover:text-black transition-colors">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
                            </button>
                        </div>
                        <div className="px-6 py-5 flex flex-col gap-4">
                            {[
                                { label: 'Product Name', key: 'name', type: 'text', ph: 'e.g. Winter Coat' },
                                { label: 'Price ($)',    key: 'price', type: 'number', ph: '0.00' },
                                { label: 'Stock',       key: 'stock', type: 'number', ph: '0' },
                            ].map(f => (
                                <div key={f.key}>
                                    <label className="block text-[13px] font-medium mb-1">{f.label}</label>
                                    <input
                                        type={f.type}
                                        value={form[f.key]}
                                        onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                                        placeholder={f.ph}
                                        className="w-full h-[44px] px-4 border border-solid border-[#E5E5E5] rounded-[8px] text-[13px] outline-none focus:border-[#171717] transition-colors"
                                    />
                                </div>
                            ))}
                            <div>
                                <label className="block text-[13px] font-medium mb-1">Category</label>
                                <select
                                    value={form.category}
                                    onChange={e => setForm({ ...form, category: e.target.value })}
                                    className="w-full h-[44px] px-4 border border-solid border-[#E5E5E5] rounded-[8px] text-[13px] outline-none focus:border-[#171717] transition-colors bg-white"
                                >
                                    {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-[13px] font-medium mb-1">Status</label>
                                <select
                                    value={form.status}
                                    onChange={e => setForm({ ...form, status: e.target.value })}
                                    className="w-full h-[44px] px-4 border border-solid border-[#E5E5E5] rounded-[8px] text-[13px] outline-none focus:border-[#171717] transition-colors bg-white"
                                >
                                    <option>Active</option>
                                    <option>Inactive</option>
                                </select>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button onClick={closeModal} className="flex-1 h-[44px] border border-solid border-[#E5E5E5] rounded-full text-[13px] font-medium hover:border-[#171717] transition-colors">Cancel</button>
                                <button onClick={handleSave} className="flex-1 h-[44px] bg-[#171717] text-white rounded-full text-[13px] font-medium hover:bg-orange transition-colors">
                                    {adding ? 'Add Product' : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Confirm Delete ── */}
            {confirmDelete && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center px-4" style={{ backgroundColor: 'rgba(23,23,23,0.5)' }}>
                    <div className="bg-white rounded-[16px] w-full max-w-[360px] px-6 py-6 text-center">
                        <div className="w-[48px] h-[48px] rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="#DC2626" strokeWidth="1.8" strokeLinecap="round" /></svg>
                        </div>
                        <h4 className="font-medium text-[16px] mb-2">Delete Product?</h4>
                        <p className="text-gray text-[13px] mb-5">"{confirmDelete.name}" will be permanently removed.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setConfirmDelete(null)} className="flex-1 h-[40px] border border-solid border-[#E5E5E5] rounded-full text-[13px] font-medium">Cancel</button>
                            <button onClick={() => { deleteProduct(confirmDelete.id); setConfirmDelete(null) }} className="flex-1 h-[40px] bg-red-500 text-white rounded-full text-[13px] font-medium hover:bg-red-600 transition-colors">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminInventory
