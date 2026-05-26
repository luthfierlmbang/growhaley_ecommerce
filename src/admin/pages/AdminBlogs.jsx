import React, { useState } from 'react'
import { useAdmin } from '../../context/AdminContext'

const AdminBlogs = () => {
    const { blogs, updateBlog, deleteBlog } = useAdmin()
    const [search, setSearch]   = useState('')
    const [confirmDelete, setConfirmDelete] = useState(null)
    const [editing, setEditing] = useState(null)
    const [form, setForm]       = useState({})

    const filtered = blogs.filter(b =>
        b.title.toLowerCase().includes(search.toLowerCase()) ||
        b.tag.toLowerCase().includes(search.toLowerCase())
    )

    const openEdit = (b) => { setEditing(b); setForm({ title: b.title, tag: b.tag, by: b.by, status: b.status }) }

    const handleSave = () => {
        updateBlog(editing.id, form)
        setEditing(null)
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="font-Helvetica font-normal text-[28px] text-[#171717]">Blog Posts</h1>
                <p className="text-gray text-[14px] mt-1">{blogs.length} articles</p>
            </div>

            {/* Search */}
            <div className="bg-white border border-solid border-[#E5E5E5] rounded-[16px] px-6 py-4 mb-4">
                <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search articles..."
                    className="h-[40px] px-4 border border-solid border-[#E5E5E5] rounded-full text-[13px] outline-none focus:border-[#171717] transition-colors w-full sm:w-[280px]"
                />
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map(b => (
                    <div key={b.id} className="bg-white border border-solid border-[#E5E5E5] rounded-[16px] overflow-hidden hover:shadow-md transition-shadow">
                        <div className="h-[160px] overflow-hidden">
                            <img src={b.img} className="w-full h-full object-cover" alt={b.title} />
                        </div>
                        <div className="px-4 py-4">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-[11px] font-medium px-2 py-[2px] border border-solid border-[#E5E5E5] rounded-full">{b.tag}</span>
                                <span className={`text-[11px] font-medium px-2 py-[2px] rounded-full border border-solid ` +
                                    (b.status === 'Published'
                                        ? 'bg-[#F0FDF4] text-[#16A34A] border-[#BBF7D0]'
                                        : 'bg-[#F5F5F5] text-gray border-[#E5E5E5]')
                                }>
                                    {b.status}
                                </span>
                            </div>
                            <h5 className="font-medium text-[14px] mb-1 line-clamp-2">{b.title}</h5>
                            <p className="text-[12px] text-gray mb-3">by {b.by} · {b.views} views</p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => openEdit(b)}
                                    className="flex-1 py-[7px] border border-solid border-[#E5E5E5] rounded-full text-[12px] font-medium hover:border-[#171717] hover:text-black transition-colors"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => updateBlog(b.id, { status: b.status === 'Published' ? 'Draft' : 'Published' })}
                                    className="flex-1 py-[7px] border border-solid border-[#E5E5E5] rounded-full text-[12px] font-medium hover:border-orange hover:text-orange transition-colors"
                                >
                                    {b.status === 'Published' ? 'Unpublish' : 'Publish'}
                                </button>
                                <button
                                    onClick={() => setConfirmDelete(b)}
                                    className="py-[7px] px-3 border border-solid border-[#FECACA] text-red-500 rounded-full text-[12px] font-medium hover:bg-red-50 transition-colors"
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Edit Modal */}
            {editing && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center px-4" style={{ backgroundColor: 'rgba(23,23,23,0.5)' }}>
                    <div className="bg-white rounded-[16px] w-full max-w-[440px]">
                        <div className="px-6 py-5 border-b border-solid border-[#E5E5E5] flex items-center justify-between">
                            <h4 className="font-Helvetica font-normal text-[18px]">Edit Post</h4>
                            <button onClick={() => setEditing(null)} className="text-gray hover:text-black transition-colors">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
                            </button>
                        </div>
                        <div className="px-6 py-5 flex flex-col gap-4">
                            <div>
                                <label className="block text-[13px] font-medium mb-1">Title</label>
                                <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full h-[44px] px-4 border border-solid border-[#E5E5E5] rounded-[8px] text-[13px] outline-none focus:border-[#171717] transition-colors" />
                            </div>
                            <div>
                                <label className="block text-[13px] font-medium mb-1">Tag</label>
                                <input type="text" value={form.tag} onChange={e => setForm({ ...form, tag: e.target.value })} className="w-full h-[44px] px-4 border border-solid border-[#E5E5E5] rounded-[8px] text-[13px] outline-none focus:border-[#171717] transition-colors" />
                            </div>
                            <div>
                                <label className="block text-[13px] font-medium mb-1">Author</label>
                                <input type="text" value={form.by} onChange={e => setForm({ ...form, by: e.target.value })} className="w-full h-[44px] px-4 border border-solid border-[#E5E5E5] rounded-[8px] text-[13px] outline-none focus:border-[#171717] transition-colors" />
                            </div>
                            <div>
                                <label className="block text-[13px] font-medium mb-1">Status</label>
                                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full h-[44px] px-4 border border-solid border-[#E5E5E5] rounded-[8px] text-[13px] outline-none focus:border-[#171717] transition-colors bg-white">
                                    <option>Published</option>
                                    <option>Draft</option>
                                </select>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button onClick={() => setEditing(null)} className="flex-1 h-[44px] border border-solid border-[#E5E5E5] rounded-full text-[13px] font-medium">Cancel</button>
                                <button onClick={handleSave} className="flex-1 h-[44px] bg-[#171717] text-white rounded-full text-[13px] font-medium hover:bg-orange transition-colors">Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirm Delete */}
            {confirmDelete && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center px-4" style={{ backgroundColor: 'rgba(23,23,23,0.5)' }}>
                    <div className="bg-white rounded-[16px] w-full max-w-[360px] px-6 py-6 text-center">
                        <div className="w-[48px] h-[48px] rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="#DC2626" strokeWidth="1.8" strokeLinecap="round" /></svg>
                        </div>
                        <h4 className="font-medium text-[16px] mb-2">Delete Post?</h4>
                        <p className="text-gray text-[13px] mb-5 line-clamp-2">"{confirmDelete.title}"</p>
                        <div className="flex gap-3">
                            <button onClick={() => setConfirmDelete(null)} className="flex-1 h-[40px] border border-solid border-[#E5E5E5] rounded-full text-[13px] font-medium">Cancel</button>
                            <button onClick={() => { deleteBlog(confirmDelete.id); setConfirmDelete(null) }} className="flex-1 h-[40px] bg-red-500 text-white rounded-full text-[13px] font-medium hover:bg-red-600 transition-colors">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminBlogs
