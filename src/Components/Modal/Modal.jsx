import React, { Fragment, useState } from 'react'
import { Form, Modal } from 'react-bootstrap'
import { CloseIcon } from '../Icon/Icon'
import { useAuth } from '../../context/AuthContext'

export const AuthStepModal = ({ show, handleClose, handleShow, StatusModal, setStatusModal }) => {
    const onEventClick = (step) => {
        handleClose()
        setStatusModal(step)
        setTimeout(() => handleShow(), 500)
    }
    return (
        <Fragment>
            <StepModal
                show={show}
                handleClose={handleClose}
                handleShow={handleShow}
                StatusModal={StatusModal}
                setStatusModal={setStatusModal}
                onEventClick={onEventClick}
            />
        </Fragment>
    )
}

export const StepModal = ({ show, handleClose, handleShow, StatusModal, setStatusModal, onEventClick }) => {
    const showingForm = (step) => {
        switch (step) {
            case "login":             return <LoginContent onEventClick={onEventClick} handleClose={handleClose} />
            case "register":          return <RegisterContent onEventClick={onEventClick} />
            case "forgot password":   return <ForgotContent onEventClick={onEventClick} />
            case "verify your email": return <VerifyContent onEventClick={onEventClick} />
            case "change password":   return <ChangeContent onEventClick={onEventClick} />
            case "succsess":          return <SuccsessContent onEventClick={onEventClick} />
            default:                  return null
        }
    }
    return (
        <Modal centered show={show} onHide={() => { handleClose(); setStatusModal("login") }}>
            <Modal.Body className='px-6 py-6 relative'>
                <div className="flex justify-end mb-4 cursor-pointer" onClick={() => { handleClose(); setStatusModal("login") }}>
                    <CloseIcon color={"#292D32"} />
                </div>
                {showingForm(StatusModal)}
            </Modal.Body>
        </Modal>
    )
}

/* ─── Login ─── */
const LoginContent = ({ onEventClick, handleClose }) => {
    const auth = useAuth()
    const [togglePassword, setTogglePassword] = useState(true)
    const [rememberMe, setRememberMe] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const handleLogin = () => {
        if (!email || !password) {
            setError('Please fill in all fields.')
            return
        }
        const result = auth.login(email, password)
        if (result.success) {
            setError('')
            if (handleClose) handleClose()
        } else {
            setError(result.error)
        }
    }

    if (auth.isLoggedIn) {
        return (
            <Fragment>
                <div className="text-center py-4">
                    <div className="w-[64px] h-[64px] rounded-full bg-orange flex items-center justify-center mx-auto mb-4">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                            <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <h3 className='text-[20px] lg:text-[24px] font-Helvetica mb-2'>Welcome back!</h3>
                    <p className='text-[14px] lg:text-[16px] text-gray mb-1'>Logged in as</p>
                    <p className='font-medium text-[14px] lg:text-[16px] text-orange mb-6'>{auth.user?.email}</p>
                    <button
                        type="button"
                        onClick={() => { auth.logout(); if (handleClose) handleClose() }}
                        className='font-medium text-sm text-orange !border-orange btnClass hover:bg-orange hover:text-white cursor-pointer'
                    >
                        Sign Out
                    </button>
                </div>
            </Fragment>
        )
    }

    return (
        <Fragment>
            <h3 className='text-[20px] lg:text-[24px] font-Helvetica mb-1 text-center'>Login</h3>
            <p className='text-center text-[12px] text-[#A3A3A3] mb-4'>
                Demo: <span className='font-medium text-black'>admin@lux.com</span> / <span className='font-medium text-black'>lux2025</span>
            </p>

            {error && (
                <div className="mb-3 px-3 py-2 rounded-[8px] text-[12px] text-red-600 bg-red-50 border border-red-200">
                    {error}
                </div>
            )}

            <Form.Group className='mb-3'>
                <Form.Label className='font-medium text-[12px] lg:text-[14px]'>Email</Form.Label>
                <Form.Control
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className='text-[14px] lg:text-[16px] h-[56px] outline-none shadow-none border-[#E5E5E5] rounded-[8px] focus:border-[#E5E5E5]'
                    placeholder="Enter your email"
                />
            </Form.Group>
            <Form.Group className='mb-3'>
                <Form.Label className='font-medium text-[12px] lg:text-[14px]'>Password</Form.Label>
                <div className="relative">
                    <div className="cursor-pointer absolute right-[10px] top-1/2 -translate-y-1/2" onClick={() => setTogglePassword(!togglePassword)}>
                        <img src="./../images/eye-slash.svg" alt="" />
                    </div>
                    <Form.Control
                        type={togglePassword ? "password" : "text"}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleLogin()}
                        className='text-[14px] lg:text-[16px] h-[56px] outline-none shadow-none border-[#E5E5E5] rounded-[8px] focus:border-[#E5E5E5]'
                        placeholder="Enter your password"
                    />
                </div>
            </Form.Group>

            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => setRememberMe(!rememberMe)}>
                    <div className={"w-[24px] h-[24px] rounded-[4px] border border-solid flex items-center justify-center cursor-pointer " + (rememberMe ? "!border-orange" : "border-[#A3A3A3]")}>
                        {rememberMe && <img src="./../images/sdgdgdsg.svg" alt="" />}
                    </div>
                    <span className='text-[14px] lg:text-[16px] text-[#878690]'>Remember me</span>
                </div>
                <div onClick={() => onEventClick("forgot password")} className='font-medium text-[12px] cursor-pointer underline'>Forgot Password</div>
            </div>

            <button type="button" onClick={handleLogin} className='btnClass large font-medium text-[14px] lg:text-[16px] bg-orange !border-orange text-white w-full text-center'>
                Login
            </button>

            <div className="my-4 text-center relative">
                <div className="w-full h-[1px] bg-[#E5E5E5] absolute left-0 top-1/2 -translate-y-1/2"></div>
                <div className="inline-block text-[12px] lg:text-[14px] text-[#A3A3A3] bg-white px-3 py-1 relative z-2">Or Sign In with</div>
            </div>

            <div className="grid grid-cols-2 grid-rows-1 gap-3 mb-4">
                <a href='#!' className="relative inline-block px-3 py-[10px] w-full text-center rounded-[16px] border border-solid border-[#E5E5E5]">
                    <img src="./../images/Icon - Google.svg" className='absolute left-[10px] top-1/2 -translate-y-1/2' alt="" />
                    <div className="relative z-2 font-medium text-[12px] lg:text-[14px]">Google</div>
                </a>
                <a href='#!' className="relative inline-block px-3 py-[10px] w-full text-center rounded-[16px] border border-solid border-[#E5E5E5]">
                    <img src="./../images/facebook-3-2 1.svg" className='absolute left-[10px] top-1/2 -translate-y-1/2' alt="" />
                    <div className="relative z-2 font-medium text-[12px] lg:text-[14px]">Facebook</div>
                </a>
            </div>

            <div className="text-center text-[12px] lg:text-[14px] text-[#525252]">
                Don't have an account? <span className='text-orange cursor-pointer' onClick={() => onEventClick("register")}>Sign Up</span>
            </div>
        </Fragment>
    )
}

/* ─── Register ─── */
const RegisterContent = ({ onEventClick }) => {
    const [togglePassword, setTogglePassword] = useState(true)
    return (
        <Fragment>
            <h3 className='text-[20px] lg:text-[24px] font-Helvetica mb-3 text-center'>Register</h3>
            <Form.Group className='mb-3'>
                <Form.Label className='font-medium text-[12px] lg:text-[14px]'>Fullname</Form.Label>
                <Form.Control type="text" className='text-[14px] lg:text-[16px] h-[56px] outline-none shadow-none border-[#E5E5E5] rounded-[8px] focus:border-[#E5E5E5]' placeholder="Enter your fullname" />
            </Form.Group>
            <Form.Group className='mb-3'>
                <Form.Label className='font-medium text-[12px] lg:text-[14px]'>Email</Form.Label>
                <Form.Control type="email" className='text-[14px] lg:text-[16px] h-[56px] outline-none shadow-none border-[#E5E5E5] rounded-[8px] focus:border-[#E5E5E5]' placeholder="Enter your email" />
            </Form.Group>
            <Form.Group className='mb-3'>
                <Form.Label className='font-medium text-[12px] lg:text-[14px]'>Password</Form.Label>
                <div className="relative">
                    <div className="cursor-pointer absolute right-[10px] top-1/2 -translate-y-1/2" onClick={() => setTogglePassword(!togglePassword)}>
                        <img src="./../images/eye-slash.svg" alt="" />
                    </div>
                    <Form.Control type={togglePassword ? "password" : "text"} className='text-[14px] lg:text-[16px] h-[56px] outline-none shadow-none border-[#E5E5E5] rounded-[8px] focus:border-[#E5E5E5]' placeholder="Enter your password" />
                </div>
            </Form.Group>
            <div onClick={() => onEventClick("verify your email")} className='btnClass large font-medium text-[14px] lg:text-[16px] bg-orange !border-orange text-white w-full text-center cursor-pointer'>Register</div>
            <div className="my-4 text-center relative">
                <div className="w-full h-[1px] bg-[#E5E5E5] absolute left-0 top-1/2 -translate-y-1/2"></div>
                <div className="inline-block text-[12px] lg:text-[14px] text-[#A3A3A3] bg-white px-3 py-1 relative z-2">Or Sign In with</div>
            </div>
            <div className="grid grid-cols-2 grid-rows-1 gap-3 mb-4">
                <a href='#!' className="relative inline-block px-3 py-[10px] w-full text-center rounded-[16px] border border-solid border-[#E5E5E5]">
                    <img src="./../images/Icon - Google.svg" className='absolute left-[10px] top-1/2 -translate-y-1/2' alt="" />
                    <div className="relative z-2 font-medium text-[12px] lg:text-[14px]">Google</div>
                </a>
                <a href='#!' className="relative inline-block px-3 py-[10px] w-full text-center rounded-[16px] border border-solid border-[#E5E5E5]">
                    <img src="./../images/facebook-3-2 1.svg" className='absolute left-[10px] top-1/2 -translate-y-1/2' alt="" />
                    <div className="relative z-2 font-medium text-[12px] lg:text-[14px]">Facebook</div>
                </a>
            </div>
            <div className="text-center text-[12px] lg:text-[14px] text-[#525252]">
                Already have an account? <span className='text-orange cursor-pointer' onClick={() => onEventClick("login")}>Log In</span>
            </div>
        </Fragment>
    )
}

/* ─── Forgot Password ─── */
const ForgotContent = ({ onEventClick }) => (
    <Fragment>
        <h3 className='text-[20px] lg:text-[24px] font-Helvetica mb-3 text-center'>Forgot Password</h3>
        <p className='text-center text-[14px] lg:text-[16px] text-[#737373] mb-4'>Enter the email address associated with your account and we will send you a link to reset your password.</p>
        <Form.Group className='mb-3'>
            <Form.Label className='font-medium text-[12px] lg:text-[14px]'>Email</Form.Label>
            <Form.Control type="email" className='text-[14px] lg:text-[16px] h-[56px] outline-none shadow-none border-[#E5E5E5] rounded-[8px] focus:border-[#E5E5E5]' placeholder="Enter your email" />
        </Form.Group>
        <div onClick={() => onEventClick("change password")} className='btnClass large font-medium text-[14px] lg:text-[16px] bg-orange !border-orange text-white w-full text-center cursor-pointer'>Continue</div>
    </Fragment>
)

/* ─── Verify Email ─── */
const VerifyContent = () => (
    <Fragment>
        <h3 className='text-[20px] lg:text-[24px] font-Helvetica mb-3 text-center'>Verify your Email</h3>
        <p className='text-center text-[14px] lg:text-[16px] text-[#737373] mb-8'>Thank you, check your email for instructions to reset your password</p>
        <div className="text-center text-[12px] lg:text-[14px] font-medium mb-4">
            Don't receive an email? <span className='text-orange cursor-pointer'>Resend</span>
        </div>
    </Fragment>
)

/* ─── Change Password ─── */
const ChangeContent = ({ onEventClick }) => {
    const [tp1, setTp1] = useState(true)
    const [tp2, setTp2] = useState(true)
    const [tp3, setTp3] = useState(true)
    return (
        <Fragment>
            <h3 className='text-[20px] lg:text-[24px] font-Helvetica mb-3 text-center'>Change Password</h3>
            {[
                { label: "Old Password", show: tp1, toggle: () => setTp1(!tp1), ph: "Enter your old password" },
                { label: "New Password", show: tp2, toggle: () => setTp2(!tp2), ph: "Enter your new password" },
                { label: "Confirm New Password", show: tp3, toggle: () => setTp3(!tp3), ph: "Confirm your new password" },
            ].map(f => (
                <Form.Group key={f.label} className='mb-3'>
                    <Form.Label className='font-medium text-[12px] lg:text-[14px]'>{f.label}</Form.Label>
                    <div className="relative">
                        <div className="cursor-pointer absolute right-[10px] top-1/2 -translate-y-1/2" onClick={f.toggle}>
                            <img src="./../images/eye-slash.svg" alt="" />
                        </div>
                        <Form.Control type={f.show ? "password" : "text"} className='text-[14px] lg:text-[16px] h-[56px] outline-none shadow-none border-[#E5E5E5] rounded-[8px] focus:border-[#E5E5E5]' placeholder={f.ph} />
                    </div>
                </Form.Group>
            ))}
            <div onClick={() => onEventClick("succsess")} className='btnClass large font-medium text-[14px] lg:text-[16px] bg-orange !border-orange text-white w-full text-center cursor-pointer'>Submit</div>
        </Fragment>
    )
}

/* ─── Success ─── */
const SuccsessContent = ({ onEventClick }) => (
    <Fragment>
        <div className="text-center mb-3">
            <img src="./../images/gfgdfgfd.svg" className='mx-auto' alt="" />
            <h3 className='text-[20px] lg:text-[24px] font-Helvetica mb-3 text-center'>Congratulations!</h3>
            <p className='text-center text-[14px] lg:text-[16px] text-[#737373] mb-8'>Your password has been changed</p>
            <div onClick={() => onEventClick("login")} className='font-medium text-sm text-orange !border-orange btnClass hover:bg-orange hover:text-white cursor-pointer'>Back to Sign In</div>
        </div>
    </Fragment>
)
