import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdmin } from '../context/AdminContext'

const AdminLogin = () => {
    const { adminLogin } = useAdmin()
    const navigate = useNavigate()
    const [email, setEmail]     = useState('')
    const [password, setPassword] = useState('')
    const [showPw, setShowPw]   = useState(false)
    const [error, setError]     = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!email || !password) { setError('Please fill in all fields.'); return }
        setLoading(true)
        setTimeout(() => {
            const result = adminLogin(email, password)
            if (result.success) { navigate('/admin') }
            else { setError(result.error); setLoading(false) }
        }, 600)
    }

    return (
        <div className="min-h-screen bg-[#F6F6F6] flex items-center justify-center px-4">
            <div className="w-full max-w-[440px]">
                {/* Logo */}
                <div className="text-center mb-8">
                    <img src="/images/logo.png" className="mx-auto mb-4 h-[32px] object-contain" alt="Lux" />
                    <h1 className="font-Helvetica font-normal text-[32px] text-black">Admin Dashboard</h1>
                    <p className="text-gray text-[14px] lg:text-[16px] mt-1">Sign in to manage your store</p>
                </div>

                {/* Card */}
                <div className="bg-white border border-solid border-[#E5E5E5] rounded-[24px] px-8 py-8">
                    {error && (
                        <div className="mb-4 px-4 py-3 bg-[#FEF2F2] border border-solid border-[#FECACA] rounded-[8px] text-[13px] text-red-600">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block font-medium text-[12px] lg:text-[14px] mb-2">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full h-[56px] px-4 border border-solid border-[#E5E5E5] rounded-[8px] text-[14px] lg:text-[16px] outline-none focus:border-black transition-colors bg-transparent"
                                placeholder="admin@lux.com"
                            />
                        </div>
                        <div className="mb-8">
                            <label className="block font-medium text-[12px] lg:text-[14px] mb-2">Password</label>
                            <div className="relative">
                                <input
                                    type={showPw ? 'text' : 'password'}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleSubmit(e)}
                                    className="w-full h-[56px] px-4 pr-12 border border-solid border-[#E5E5E5] rounded-[8px] text-[14px] lg:text-[16px] outline-none focus:border-black transition-colors bg-transparent"
                                    placeholder="Enter password"
                                />
                                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray hover:text-black transition-colors">
                                    <img src="/images/eye-slash.svg" alt="" />
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-[56px] rounded-full bg-[#E16F3D] text-white text-[14px] lg:text-[16px] font-medium hover:bg-[#c85e2e] transition-colors disabled:opacity-60"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <p className="text-center text-[12px] text-gray mt-4">
                        Demo: <span className="font-medium text-black">admin@lux.com</span> / <span className="font-medium text-black">lux2025</span>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default AdminLogin
