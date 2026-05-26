import React from 'react'
import { Container } from 'react-bootstrap'
import { BagIcon, CloseIcon, SearchIcon } from '../Icon/Icon'
import { Fragment } from 'react'
import { AuthStepModal } from '../Modal/Modal'
import { NavLink } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'

const Navbar = () => {
    const auth = useAuth()
    const { cartItems } = useCart()
    const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0)

    const [StatusModal, setStatusModal] = useState("login")
    const [show, setShow] = useState(false)

    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)

    const dataSearch = ["Shirts", "Skirts", "Jeans", "Casual", "Pants", "Coats", "Sneakers"]

    const [toggleSearch, settoggleSearch] = useState(false)
    const [ToogleMenuResponsive, setToogleMenuResponsive] = useState(false)

    return (
        <Fragment>
            <AuthStepModal show={show} handleClose={handleClose} handleShow={handleShow} StatusModal={StatusModal} setStatusModal={setStatusModal} />

            {/* Mobile Menu */}
            <div className={"fixed h-full w-full bg-white z-[99] pt-[100px] menuMobile " + (ToogleMenuResponsive ? "active" : "")}>
                <Container className='h-full'>
                    <div className="flex flex-wrap w-full h-full">
                        <ul className='list-none p-0 m-0 flex items-center flex-wrap gap-2 text-[20px] w-full'>
                            <li className='w-full'>
                                <a href="#!" className='font-medium text-black'>Menu</a>
                            </li>
                            <li className='w-full'>
                                <NavLink to="/product" className='font-medium text-black'>Product</NavLink>
                            </li>
                            <li className='w-full'>
                                <NavLink to="/tracking" className='font-medium text-black'>Order Tracking</NavLink>
                            </li>
                            <li className='w-full'>
                                <NavLink to="/blog" className='font-medium text-black'>Blog</NavLink>
                            </li>
                            <li className='w-full'>
                                <a href="#!" className='font-medium text-black'>Contact Us</a>
                            </li>
                            <li className='w-full'>
                                <NavLink to="/address" className='font-medium text-black'>Address</NavLink>
                            </li>
                            {auth.isLoggedIn && (
                                <li className='w-full'>
                                    <NavLink to="/orders" className='font-medium text-black'>My Orders</NavLink>
                                </li>
                            )}
                        </ul>
                        <div className="self-end w-full pb-4">
                            {auth.isLoggedIn ? (
                                <div className="flex items-center gap-3">
                                    <div className="w-[40px] h-[40px] rounded-full bg-orange flex items-center justify-center text-white font-bold text-[16px]">
                                        {auth.user?.name?.charAt(0) || 'A'}
                                    </div>
                                    <div>
                                        <p className='font-medium text-[14px]'>{auth.user?.name}</p>
                                        <p className='text-[12px] text-gray'>{auth.user?.email}</p>
                                    </div>
                                    <button
                                        onClick={auth.logout}
                                        className='ml-auto cursor-pointer font-medium text-[14px] text-orange !border-orange btnClass hover:bg-orange hover:text-white'
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <div onClick={handleShow} className='cursor-pointer font-medium text-[14px] text-orange !border-orange btnClass hover:bg-orange hover:text-white'>Login</div>
                            )}
                        </div>
                    </div>
                </Container>
            </div>

            {/* Search overlay */}
            <div className={"fixed z-[79] w-full h-full bgDropPopup left-0 transition-all duration-500 " + (toggleSearch ? "top-0" : "-top-[100%]")}></div>
            <div className={"fixed w-full left-0 z-[80] pt-[100px] bg-white pb-4 transition-all duration-500 " + (toggleSearch ? "top-0" : "-top-[100%]")}>
                <Container>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-full h-[48px] rounded-full border border-solid border-[#E5E5E5] flex items-center gap-2 px-2">
                            <SearchIcon />
                            <input type="text" className='fieldInput w-full !border-none hover:!border-none focus:!border-none active:!border-none !px-1 text-[12px] lg:text-[14px]' placeholder='Search...' />
                        </div>
                        <div onClick={() => settoggleSearch(false)} className="w-[48px] h-[48px] flex items-center justify-center rounded-full border border-solid border-[#E5E5E5] shrink-0 cursor-pointer">
                            <CloseIcon />
                        </div>
                    </div>
                    <div>
                        <h4 className='font-normal text-[14px] lg:text-[16px] mb-3'>Recent Search</h4>
                        <div className="flex items-center flex-wrap gap-2">
                            {dataSearch.map((obj) => (
                                <div key={obj} className="px-3 py-[5px] cursor-pointer border border-solid border-[#E5E5E5] rounded-2xl flex items-center gap-2">{obj} <CloseIcon width={20} height={20} /></div>
                            ))}
                        </div>
                    </div>
                </Container>
            </div>

            {/* Main Navbar */}
            <div className='fixed py-4 bg-white w-full z-[999] left-0 top-0'>
                <Container className='relative flex items-center'>
                    <div onClick={() => setToogleMenuResponsive(!ToogleMenuResponsive)} className={"relative px-1 py-1 barIcon w-[30px] h-[30px] cursor-pointer md:hidden " + (ToogleMenuResponsive ? "active" : "")}>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>

                    <ul className='list-none p-0 m-0 hidden md:flex items-center gap-4 text-[14px] lg:text-[16px]'>
                        <li><NavLink to="/" className='font-medium text-black'>Home</NavLink></li>
                        <li><NavLink to="/product" className='font-medium text-black'>Product</NavLink></li>
                        <li><NavLink to="/blog" className='font-medium text-black'>Blog</NavLink></li>
                        <li><a href='#!' className='font-medium text-black'>Contact Us</a></li>
                        {auth.isLoggedIn && (
                            <li><NavLink to="/orders" className='font-medium text-black'>My Orders</NavLink></li>
                        )}
                    </ul>

                    <NavLink to="/" className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'>
                        <img src="./../images/logo.png" alt="" />
                    </NavLink>

                    <div className="ml-auto flex items-center gap-2 md:gap-3">
                        <div className="w-[40px] md:w-[48px] h-[40px] md:h-[48px] rounded-full border border-solid border-[#E5E5E5] flex items-center justify-center cursor-pointer" onClick={() => settoggleSearch(!toggleSearch)}>
                            <SearchIcon />
                        </div>

                        <NavLink to="/cart" className="relative w-[40px] md:w-[48px] h-[40px] md:h-[48px] rounded-full border border-solid border-[#E5E5E5] flex items-center justify-center">
                            <BagIcon />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-[18px] h-[18px] rounded-full bg-orange text-white text-[10px] font-bold flex items-center justify-center">
                                    {cartCount > 99 ? '99+' : cartCount}
                                </span>
                            )}
                        </NavLink>

                        {auth.isLoggedIn ? (
                            <div className='hidden md:flex items-center gap-2'>
                                <div className="w-[36px] h-[36px] rounded-full bg-orange flex items-center justify-center text-white font-bold text-[14px] cursor-pointer" onClick={handleShow}>
                                    {auth.user?.name?.charAt(0) || 'A'}
                                </div>
                                <span className='font-medium text-[12px] lg:text-[14px] hidden lg:block'>{auth.user?.name}</span>
                                <button
                                    onClick={auth.logout}
                                    className='cursor-pointer font-medium text-[12px] lg:text-[14px] text-orange !border-orange btnClass hover:bg-orange hover:text-white'
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div onClick={handleShow} className='!hidden md:!inline-block cursor-pointer font-medium text-[12px] lg:text-[14px] text-orange !border-orange btnClass hover:bg-orange hover:text-white'>Login</div>
                        )}
                    </div>
                </Container>
            </div>
        </Fragment>
    )
}

export default Navbar
