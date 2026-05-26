import React, { Fragment, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'
import RoundCheckbox from '../Components/Common/RoundCheckbox'
import AnimatedSection from '../Components/Common/AnimatedSection'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

const Cart = () => {
    const auth = useAuth()
    const { cartItems, removeFromCart, updateQty } = useCart()
    const [allChecked, setAllChecked] = useState(false)

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0)
    const total = subtotal

    // Not logged in
    if (!auth.isLoggedIn) {
        return (
            <Fragment>
                <section>
                    <Container>
                        <AnimatedSection animation="fade-down">
                            <h3 className='font-Helvetica font-normal text-[24px] md:text-[28px] lg:text-[32px] mb-6'>My Cart</h3>
                        </AnimatedSection>
                        <AnimatedSection animation="scale-in">
                            <div className="text-center">
                                <div className="w-[176px] h-[176px] rounded-full border border-solid border-[#E5E5E5] flex justify-center items-center mx-auto mb-4">
                                    <img src="./../images/shopping-bag.svg" alt="" />
                                </div>
                                <h4 className='font-medium text-[16px] lg:text-[18px] mb-2'>Please login to view your cart</h4>
                                <p className='text-[14px] lg:text-[16px] text-gray mb-4'>Login to access your cart and start shopping.</p>
                                <NavLink to="/" className='btnClass large font-medium text-[14px] lg:text-[16px] bg-orange !border-orange text-white text-center'>Login to View Cart</NavLink>
                            </div>
                        </AnimatedSection>
                    </Container>
                </section>
            </Fragment>
        )
    }

    // Logged in but cart empty
    if (cartItems.length === 0) {
        return (
            <Fragment>
                <section>
                    <Container>
                        <AnimatedSection animation="fade-down">
                            <h3 className='font-Helvetica font-normal text-[24px] md:text-[28px] lg:text-[32px] mb-6'>My Cart</h3>
                        </AnimatedSection>
                        <AnimatedSection animation="scale-in">
                            <div className="text-center">
                                <div className="w-[176px] h-[176px] rounded-full border border-solid border-[#E5E5E5] flex justify-center items-center mx-auto mb-4">
                                    <img src="./../images/shopping-bag.svg" alt="" />
                                </div>
                                <h4 className='font-medium text-[16px] lg:text-[18px] mb-2'>Oops! Your cart is empty</h4>
                                <p className='text-[14px] lg:text-[16px] text-gray mb-4'>Start exploring our collection now and add your <br /> favorite items to your cart.</p>
                                <NavLink to="/product" className='btnClass large font-medium text-[14px] lg:text-[16px] bg-orange !border-orange text-white text-center'>Shop Now</NavLink>
                            </div>
                        </AnimatedSection>
                    </Container>
                </section>
            </Fragment>
        )
    }

    // Logged in with items
    return (
        <Fragment>
            <section>
                <Container>
                    <AnimatedSection animation="fade-down">
                        <h3 className='font-Helvetica font-normal text-[24px] md:text-[28px] lg:text-[32px] mb-6'>My Cart</h3>
                    </AnimatedSection>

                    <AnimatedSection animation="fade-up" delay="anim-delay-100">
                        <Row>
                            <Col lg={8} className='mb-4 mb-lg-0'>
                                <Row className='font-medium text-[14px] lg:text-[16px] text-[#A3A3A3]'>
                                    <Col md={6}>
                                        <div className="flex items-center gap-3">
                                            <RoundCheckbox value={allChecked} id={true} onChange={() => setAllChecked(!allChecked)} />
                                            <span>Product</span>
                                        </div>
                                    </Col>
                                    <Col>Quantity</Col>
                                    <Col className='text-right'>Price</Col>
                                </Row>

                                <hr className='border-[#E5E5E5] my-4' />

                                <div className="flex flex-wrap gap-y-4 w-full">
                                    {cartItems.map((item, idx) => (
                                        <Fragment key={item.cartId}>
                                            <CartItemRow item={item} removeFromCart={removeFromCart} updateQty={updateQty} />
                                            {idx < cartItems.length - 1 && <hr className='border-[#E5E5E5] w-full' />}
                                        </Fragment>
                                    ))}
                                </div>
                            </Col>
                            <Col lg={4}>
                                <div className="px-6 py-6 border border-solid border-[#E5E5E5] rounded-[16px]">
                                    <h4 className='font-bold text-[18px] lg:text-[24px] mb-2'>Order Summary</h4>
                                    <p className='text-[14px] lg:text-[16px]'>The total cost consists of temporary costs, not including shipping costs</p>

                                    <div className="mt-4 mb-6 flex items-center flex-wrap gap-3">
                                        <div className="flex items-center justify-between text-[16px] lg:text-[18px] w-full">
                                            <span className='text-gray'>Subtotal</span>
                                            <span className='font-medium'>${subtotal.toFixed(2)}</span>
                                        </div>
                                        <hr className='border-[#E5E5E5] w-full' />
                                        <div className="flex items-center justify-between text-[16px] lg:text-[18px] w-full">
                                            <span className='text-gray'>Total</span>
                                            <span className='font-medium'>${total.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    <NavLink to="/checkout" className='btnClass large font-medium text-[14px] lg:text-[16px] bg-orange !border-orange text-white w-full text-center'>Checkout Now</NavLink>
                                </div>
                            </Col>
                        </Row>
                    </AnimatedSection>
                </Container>
            </section>
        </Fragment>
    )
}

const CartItemRow = ({ item, removeFromCart, updateQty }) => {
    return (
        <Row className='w-full'>
            <Col className='mb-2 my-md-auto' md={6}>
                <div className="flex items-center gap-3">
                    <div className='flex items-center gap-3'>
                        <img src={item.img || '/images/it (4).png'} className='w-[100px] xl:w-[128px] h-[100px] xl:h-[128px] rounded-[8px] object-cover' alt={item.name} />
                        <div>
                            <h4 className='font-semibold text-[18px] mb-2'>{item.name}</h4>
                            <p className='text-[18px] text-[#A3A3A3] font-normal'>
                                {item.selectedColor && (
                                    <span className='inline-block w-[14px] h-[14px] rounded-full mr-1 align-middle' style={{ backgroundColor: item.selectedColor }}></span>
                                )}
                                <span className='font-medium text-black'>{item.selectedSize || ''}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </Col>
            <Col md={4} className='mb-2 my-md-auto'>
                <div className="flex items-center justify-end md:justify-start gap-4 xl:gap-6">
                    <div className="flex items-center gap-2 xl:gap-3">
                        <img
                            src="/images/size.svg"
                            className='cursor-pointer'
                            onClick={() => updateQty(item.cartId, item.qty - 1)}
                            alt="decrease"
                        />
                        <div className="w-[32px] h-[32px] rounded-full flex justify-center items-center text-[14px] lg:text-[16px] border border-solid border-[#E5E5E5] flex-shrink-0">{item.qty}</div>
                        <img
                            src="/images/size (1).svg"
                            className='cursor-pointer'
                            onClick={() => updateQty(item.cartId, item.qty + 1)}
                            alt="increase"
                        />
                    </div>
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => removeFromCart(item.cartId)}>
                        <img src="/images/trash.svg" alt="remove" />
                        <span className='font-medium text-[12px] lg:text-[14px]'>Remove</span>
                    </div>
                </div>
            </Col>
            <Col className='text-right my-auto'>
                <h5 className='text-[18px] font-medium'>${(item.price * item.qty).toFixed(2)}</h5>
            </Col>
        </Row>
    )
}

export default Cart
