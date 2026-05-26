import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdmin } from '../context/AdminContext'

const AdminLogin = () => {
    const { adminLogin } = useAdmin()
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPw, setShowPw] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!email || !password) { setError('Please fill in all fields.'); return }
        setLoading(true)
        setTimeout(() => {
            const result = adminLogin(email, password)
            if (result.success) {
                navigate('/admin')
            } else {
                setError(result.error)
                setLoading(false)
            }
        }, 600)
    }

    return (
        <div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center px-4">
            <div className="w-full max-w-[420px]">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="w-[56px] h-[56px] rounded-[16px] bg-[#171717] flex items-center justify-center mx-auto mb-4">
                        <span className="text-white font-bold text-[24px] font-Helvetica">L</span>
                    </div>
                    <h1 className="font-Helvetica font-normal text-[28px] text-[#171717]">Lux Admin</h1>
                    <p className="text-gray text-[14px] mt-1">Sign in to your dashboard</p>
                </div>

                {/* Card */}
                <div className="bg-white border border-solid border-[#E5E5E5] rounded-[16px] px-8 py-8">
                    {error && (
                        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-[8px] text-[13px] text-red-600">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block font-medium text-[13px] mb-2 text-[#171717]">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full h-[48px] px-4 border border-solid border-[#E5E5E5] rounded-[8px] text-[14px] outline-none focus:border-[#171717] transition-colors bg-transparent"
                                placeholder="admin@lux.com"
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block font-medium text-[13px] mb-2 text-[#171717]">Password</label>
                            <div className="relative">
                                <input
                                    type={showPw ? 'text' : 'password'}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className="w-full h-[48px] px-4 pr-12 border border-solid border-[#E5E5E5] rounded-[8px] text-[14px] outline-none focus:border-[#171717] transition-colors bg-transparent"
                                    placeholder="Enter password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPw(!showPw)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray hover:text-black transition-colors"
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                        {showPw
                                            ? <><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /><path d="M1 1l22 22" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></>
                                            : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.8" /><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" /></>
                                        }
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-[48px] bg-[#171717] text-white rounded-[8px] font-medium text-[14px] hover:bg-orange transition-colors disabled:opacity-60"
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
