// src/admin/components/ui.jsx
import React from 'react'

/* ── Buttons ── */
export const PrimaryButton = ({ children, onClick, disabled, className = '', type = 'button', fullWidth = false }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`h-[48px] px-6 rounded-full bg-[#171717] text-white text-[14px] font-medium hover:bg-[#E16F3D] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${fullWidth ? 'w-full' : ''} ${className}`}
  >
    {children}
  </button>
)

export const OrangeButton = ({ children, onClick, disabled, className = '', type = 'button', fullWidth = false }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`h-[48px] px-6 rounded-full bg-[#E16F3D] text-white text-[14px] font-medium hover:bg-[#c85e2e] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${fullWidth ? 'w-full' : ''} ${className}`}
  >
    {children}
  </button>
)

export const SecondaryButton = ({ children, onClick, disabled, className = '', type = 'button', fullWidth = false }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`h-[48px] px-6 rounded-full border border-solid border-[#E5E5E5] text-[#171717] text-[14px] font-medium hover:border-[#171717] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${fullWidth ? 'w-full' : ''} ${className}`}
  >
    {children}
  </button>
)

export const DangerButton = ({ children, onClick, disabled, className = '', type = 'button', fullWidth = false }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`h-[48px] px-6 rounded-full bg-red-500 text-white text-[14px] font-medium hover:bg-red-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${fullWidth ? 'w-full' : ''} ${className}`}
  >
    {children}
  </button>
)

export const SmallButton = ({ children, onClick, disabled, className = '', variant = 'secondary' }) => {
  const base = 'h-[34px] px-4 rounded-full text-[12px] font-medium transition-colors flex items-center gap-1 disabled:opacity-40'
  const variants = {
    secondary: 'border border-solid border-[#E5E5E5] hover:border-[#171717]',
    primary:   'bg-[#171717] text-white hover:bg-[#E16F3D]',
    orange:    'bg-[#E16F3D] text-white hover:bg-[#c85e2e]',
  }
  return (
    <button onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  )
}

/* ── Page Header ── */
export const PageHeader = ({ title, subtitle, action }) => (
  <div className="flex items-center justify-between mb-6">
    <div>
      <h1 className="font-Helvetica font-normal text-[32px] text-[#171717]">{title}</h1>
      {subtitle && <p className="text-[#525252] text-[14px] mt-1">{subtitle}</p>}
    </div>
    {action && <div>{action}</div>}
  </div>
)

/* ── Stat Card ── */
export const StatCard = ({ label, value, color }) => (
  <div className="bg-white border border-solid border-[#E5E5E5] rounded-[24px] px-6 py-5">
    <p className="text-[#525252] text-[12px] mb-1">{label}</p>
    <h3 className="font-Helvetica font-normal text-[28px] text-[#171717]" style={color ? { color } : {}}>
      {value}
    </h3>
  </div>
)

/* ── Card wrapper ── */
export const Card = ({ children, className = '', padding = true }) => (
  <div className={`bg-white border border-solid border-[#E5E5E5] rounded-[24px] ${padding ? 'px-6 py-5' : 'overflow-hidden'} ${className}`}>
    {children}
  </div>
)

/* ── Empty State ── */
export const EmptyState = ({ icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
    {icon && (
      <div className="w-[56px] h-[56px] rounded-full bg-[#F6F6F6] flex items-center justify-center text-[#A3A3A3]">
        {icon}
      </div>
    )}
    <p className="text-[14px] font-medium text-[#171717]">{title}</p>
    {description && <p className="text-[13px] text-[#525252]">{description}</p>}
    {action && <div className="mt-2">{action}</div>}
  </div>
)

/* ── Input ── */
export const Input = ({ label, value, onChange, placeholder, type = 'text', required, error, className = '' }) => (
  <div className={className}>
    {label && <label className="block font-medium text-[13px] mb-2">{label}{required && ' *'}</label>}
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full h-[48px] px-4 border border-solid rounded-[8px] text-[14px] outline-none transition-colors bg-transparent ${error ? 'border-red-400 focus:border-red-500' : 'border-[#E5E5E5] focus:border-[#171717]'}`}
    />
    {error && <p className="text-red-500 text-[12px] mt-1">{error}</p>}
  </div>
)

/* ── Textarea ── */
export const Textarea = ({ label, value, onChange, placeholder, rows = 4, className = '' }) => (
  <div className={className}>
    {label && <label className="block font-medium text-[13px] mb-2">{label}</label>}
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-4 py-3 border border-solid border-[#E5E5E5] rounded-[8px] text-[14px] outline-none focus:border-[#171717] transition-colors resize-none"
    />
  </div>
)

/* ── Select ── */
export const Select = ({ label, value, onChange, options, className = '' }) => (
  <div className={className}>
    {label && <label className="block font-medium text-[13px] mb-2">{label}</label>}
    <select
      value={value}
      onChange={onChange}
      className="w-full h-[48px] px-4 border border-solid border-[#E5E5E5] rounded-[8px] text-[14px] outline-none focus:border-[#171717] transition-colors bg-white"
    >
      {options.map(o => (
        <option key={typeof o === 'string' ? o : o.value} value={typeof o === 'string' ? o : o.value}>
          {typeof o === 'string' ? o : o.label}
        </option>
      ))}
    </select>
  </div>
)

/* ── Modal overlay ── */
export const ModalOverlay = ({ children, onClose, zIndex = 400 }) => (
  <div
    className="fixed inset-0 flex items-center justify-center px-4"
    style={{ backgroundColor: 'rgba(23,23,23,0.5)', backdropFilter: 'blur(4px)', zIndex }}
    onClick={onClose}
  >
    <div onClick={e => e.stopPropagation()}>{children}</div>
  </div>
)

/* ── Modal container ── */
export const ModalBox = ({ children, maxWidth = '520px', className = '' }) => (
  <div
    className={`bg-white rounded-[24px] w-full max-h-[90vh] overflow-y-auto ${className}`}
    style={{ maxWidth }}
  >
    {children}
  </div>
)

/* ── Modal header ── */
export const ModalHeader = ({ title, subtitle, onClose }) => (
  <div className="px-6 py-5 border-b border-solid border-[#E5E5E5] flex items-center justify-between flex-shrink-0">
    <div>
      <h4 className="font-Helvetica font-normal text-[20px]">{title}</h4>
      {subtitle && <p className="text-[#525252] text-[13px]">{subtitle}</p>}
    </div>
    <button onClick={onClose} className="text-[#525252] hover:text-[#171717] transition-colors">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    </button>
  </div>
)

/* ── Status Badge ── */
export const StatusBadge = ({ label, bg, text, border }) => (
  <span
    className="inline-block text-[11px] font-medium px-3 py-[3px] rounded-full border border-solid"
    style={{ backgroundColor: bg, color: text, borderColor: border }}
  >
    {label}
  </span>
)

/* ── Search Input ── */
export const SearchInput = ({ value, onChange, placeholder = 'Search...', className = '' }) => (
  <input
    type="text"
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`h-[48px] px-4 border border-solid border-[#E5E5E5] rounded-full text-[14px] outline-none focus:border-[#171717] transition-colors ${className}`}
  />
)
