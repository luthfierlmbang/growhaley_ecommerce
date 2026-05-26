import React, { Fragment } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'
import AnimatedSection from '../Components/Common/AnimatedSection'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

const Orders = () => {
    const auth = useAuth()
    const { orders } = useCart()

    const formatDate = (d) => {
        if (!d) return ''
        const date = new Date(d)
        return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    }

    if (!auth.isLoggedIn) {
        return (
            <Fragment>
                <section>
                    <Container>
                        <AnimatedSection animation="fade-down">
                            <h3 className='font-Helvetica font-normal text-[24px] md:text-[28px] lg:text-[32px] mb-6'>My Orders</h3>
                        </AnimatedSection>
                        <AnimatedSection animation="scale-in">
                            <div className="text-center py-12">
                                <div className="w-[176px] h-[176px] rounded-full border border-solid border-[#E5E5E5] flex justify-center items-center mx-auto mb-4">
                                    <img src="./../images/shopping-bag.svg" alt="" />
                                </div>
                                <h4 className='font-medium text-[16px] lg:text-[18px] mb-2'>Please login to view your orders</h4>
                                <p className='text-[14px] lg:text-[16px] text-gray mb-4'>Login to see your order history.</p>
                            </div>
                        </AnimatedSection>
                    </Container>
                </section>
            </Fragment>
        )
    }

    if (orders.length === 0) {
        return (
            <Fragment>
                <section>
                    <Container>
                        <AnimatedSection animation="fade-down">
                            <h3 className='font-Helvetica font-normal text-[24px] md:text-[28px] lg:text-[32px] mb-6'>My Orders</h3>
                        </AnimatedSection>
                        <AnimatedSection animation="scale-in">
                            <div className="text-center py-12">
                                <div className="w-[176px] h-[176px] rounded-full border border-solid border-[#E5E5E5] flex justify-center items-center mx-auto mb-4">
                                    <img src="./../images/shopping-bag.svg" alt="" />
                                </div>
                                <h4 className='font-medium text-[16px] lg:text-[18px] mb-2'>No orders yet</h4>
                                <p className='text-[14px] lg:text-[16px] text-gray mb-4'>Start shopping and your orders will appear here.</p>
                            </div>
                        </AnimatedSection>
                    </Container>
                </section>
            </Fragment>
        )
    }

    return (
        <Fragment>
            <section>
                <Container>
                    <AnimatedSection animation="fade-down">
                        <h3 className='font-Helvetica font-normal text-[24px] md:text-[28px] lg:text-[32px] mb-6'>My Orders</h3>
                    </AnimatedSection>

                    <AnimatedSection animation="fade-up" delay="anim-delay-100">
                        <Row className='py-6 hidden lg:flex border-b border-solid border-[#E5E5E5]'>
                            <Col md={4}><h4 className='text-[14px] text-[#A3A3A3]'>Order</h4></Col>
                            <Col md={2}><h4 className='text-[14px] text-[#A3A3A3] text-center'>Date</h4></Col>
                            <Col md={2}><h4 className='text-[14px] text-[#A3A3A3] text-center'>Ref Number</h4></Col>
                            <Col md={1}><h4 className='text-[14px] text-[#A3A3A3] text-center'>Total</h4></Col>
                            <Col md={3}><h4 className='text-[14px] text-[#A3A3A3] text-right'>Actions</h4></Col>
                        </Row>
                    </AnimatedSection>

                    {[...orders].reverse().map((order, i) => (
                        <AnimatedSection key={order.ref} animation="fade-up" delay={`anim-delay-${(i + 1) * 100}`}>
                            <div className="py-6 border-t border-solid border-[#E5E5E5]">
                                <Row className='items-center'>
                                    <Col className='mb-3 mb-lg-0' lg={4}>
                                        <div className='flex flex-wrap gap-2'>
                                            {order.items?.slice(0, 2).map((item, idx) => (
                                                <div key={idx} className='flex items-center gap-3'>
                                                    <img
                                                        src={item.img || '/images/p (2).png'}
                                                        className='w-[64px] h-[64px] rounded-[8px] object-cover flex-shrink-0'
                                                        alt={item.name}
                                                    />
                                                    <div>
                                                        <h4 className='font-semibold text-[14px] lg:text-[16px] mb-1'>{item.name}</h4>
                                                        <p className='text-[12px] text-[#A3A3A3]'>
                                                            {item.selectedColor && (
                                                                <span className='inline-block w-[10px] h-[10px] rounded-full mr-1 align-middle' style={{ backgroundColor: item.selectedColor }}></span>
                                                            )}
                                                            {item.selectedSize && <span>Size {item.selectedSize} &nbsp;</span>}
                                                            ×{item.qty}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                            {order.items?.length > 2 && (
                                                <p className='text-[12px] text-[#A3A3A3] self-center'>+{order.items.length - 2} more items</p>
                                            )}
                                        </div>
                                    </Col>
                                    <Col className='mb-2 my-lg-auto lg:text-center' lg={2}>
                                        <p className='text-[12px] lg:text-[14px] text-gray'>{formatDate(order.date)}</p>
                                    </Col>
                                    <Col className='mb-2 my-lg-auto lg:text-center' lg={2}>
                                        <p className='text-[13px] lg:text-[14px] font-medium'>{order.ref}</p>
                                    </Col>
                                    <Col className='mb-2 my-lg-auto lg:text-center' lg={1}>
                                        <p className='text-[15px] lg:text-[16px] font-semibold'>${order.total?.toFixed(2)}</p>
                                    </Col>
                                    <Col className='mb-2 my-lg-auto' lg={3}>
                                        <div className="flex items-center justify-start lg:justify-end gap-2 flex-wrap">
                                            <span className='inline-block font-medium text-[11px] px-3 py-[4px] rounded-full bg-[#F0FDF4] text-green-600 border border-solid border-green-200'>
                                                {order.status || 'Completed'}
                                            </span>
                                            <NavLink
                                                to={`/orders/${order.ref}`}
                                                className='font-medium text-[12px] px-4 py-[6px] border border-solid !border-[#E5E5E5] rounded-full text-black hover:bg-black hover:text-white transition-colors'
                                            >
                                                View Details
                                            </NavLink>
                                            <NavLink
                                                to={`/orders/${order.ref}`}
                                                className='font-medium text-[12px] px-4 py-[6px] border border-solid !border-orange rounded-full text-orange hover:bg-orange hover:text-white transition-colors'
                                            >
                                                Track Order
                                            </NavLink>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </AnimatedSection>
                    ))}
                </Container>
            </section>
        </Fragment>
    )
}

export default Orders
