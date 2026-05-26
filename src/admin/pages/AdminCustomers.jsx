import React, { useState } from 'react'
import { useAdmin } from '../../context/AdminContext'
import { PageHeader } from '../components/ui'

const AdminCustomers = () => {
    const { customers } = useAdmin()
    const [search, setSearch] = useState('')

    const filtered = customers.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase())
    )

    const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

    return (
        <div>
            <PageHeader
                title="Customers"
                subtitle={`${customers.length} registered customers`}
            />

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                    { label: 'Total Customers', value: customers.length },
                    { label: 'Active',           value: customers.filter(c => c.status === 'Active').length },
                    { label: 'Inactive',         value: customers.filter(c => c.status === 'Inactive').length },
                    { label: 'Total Revenue',    value: `$${customers.reduce((s, c) => s + c.totalSpent, 0).toFixed(2)}` },
                ].map(s => (
                    <div key={s.label} className="bg-white border border-solid border-[#E5E5E5] rounded-[24px] px-6 py-5">
                        <p className="text-gray text-[12px] mb-1">{s.label}</p>
                        <h3 className="font-Helvetica font-normal text-[28px] text-[#171717]">{s.value}</h3>
                    </div>
                ))}
            </div>

            {/* Search */}
            <div className="bg-white border border-solid border-[#E5E5E5] rounded-[24px] px-6 py-4 mb-4">
                <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search by name or email..."
                    className="h-[48px] px-4 border border-solid border-[#E5E5E5] rounded-full text-[14px] outline-none focus:border-[#171717] transition-colors w-full sm:w-[300px]"
                />
            </div>

            {/* Table */}
            <div className="bg-white border border-solid border-[#E5E5E5] rounded-[24px] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-[13px]">
                        <thead className="border-b border-solid border-[#E5E5E5] bg-[#F6F6F6]">
                            <tr>
                                <th className="text-left text-gray font-medium px-6 py-3">Customer</th>
                                <th className="text-left text-gray font-medium px-4 py-3">Joined</th>
                                <th className="text-center text-gray font-medium px-4 py-3">Orders</th>
                                <th className="text-right text-gray font-medium px-4 py-3">Total Spent</th>
                                <th className="text-center text-gray font-medium px-4 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(c => (
                                <tr key={c.id} className="border-b border-solid border-[#F5F5F5] last:border-0 hover:bg-[#FAFAFA] transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-[36px] h-[36px] rounded-full bg-orange flex items-center justify-center flex-shrink-0">
                                                <span className="text-white font-medium text-[13px]">{c.name.charAt(0)}</span>
                                            </div>
                                            <div>
                                                <p className="font-medium">{c.name}</p>
                                                <p className="text-gray text-[11px]">{c.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-gray">{formatDate(c.joined)}</td>
                                    <td className="px-4 py-4 text-center font-medium">{c.orders}</td>
                                    <td className="px-4 py-4 text-right font-medium">${c.totalSpent.toFixed(2)}</td>
                                    <td className="px-4 py-4 text-center">
                                        <span className={`inline-block text-[11px] font-medium px-2 py-[3px] rounded-full border border-solid ` +
                                            (c.status === 'Active'
                                                ? 'bg-[#F0FDF4] text-[#16A34A] border-[#BBF7D0]'
                                                : 'bg-[#F5F5F5] text-gray border-[#E5E5E5]')
                                        }>
                                            {c.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filtered.length === 0 && (
                        <div className="text-center py-12 text-gray text-[14px]">No customers found.</div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AdminCustomers
