import React, { Fragment } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { useParams, NavLink } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import AnimatedSection from '../Components/Common/AnimatedSection'
import { RightArrowIcon } from '../Components/Icon/Icon'

/* ── Delivery steps definition ── */
const DELIVERY_STEPS = [
    {
        key: 'placed',
        label: 'Order Placed',
        desc: 'Your order has been received and confirmed.',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
    },
    {
        key: 'processing',
        label: 'Processing',
        desc: 'Your order is being prepared and packed.',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
    },
    {
        key: 'shipped',
        label: 'Shipped',
        desc: 'Your order is on its way with the courier.',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="5.5" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="1.8" />
                <circle cx="18.5" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="1.8" />
            </svg>
        ),
    },
    {
        key: 'out_for_delivery',
        label: 'Out for Delivery',
        desc: 'Your package is out for delivery today.',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.8" />
            </svg>
        ),
    },
    {
        key: 'delivered',
        label: 'Delivered',
        desc: 'Your order has been delivered successfully.',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
    },
]

/* Simulate delivery progress based on order date */
const getDeliveryStep = (orderDate) => {
    if (!orderDate) return 1
    const now = Date.now()
    const placed = new Date(orderDate).getTime()
    const diffMin = (now - placed) / 60000

    if (diffMin < 1) return 1        // placed
    if (diffMin < 3) return 2        // processing
    if (diffMin < 6) return 3        // shipped
    if (diffMin < 10) return 4       // out for delivery
    return 5                          // delivered
}

const formatDate = (d) => {
    if (!d) return ''
    return new Date(d).toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    })
}

const formatDateTime = (d) => {
    if (!d) return ''
    return new Date(d).toLocaleString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    })
}

const OrderDetail = () => {
    const { ref } = useParams()
    const auth = useAuth()
    const { orders } = useCart()

    /* ── Not logged in ── */
    if (!auth.isLoggedIn) {
        return (
            <section>
                <Container>
                    <AnimatedSection animation="scale-in">
                        <div className="text-center py-16">
                            <div className="w-[176px] h-[176px] rounded-full border border-solid border-[#E5E5E5] flex justify-center items-center mx-auto mb-4">
                                <img src="./../images/shopping-bag.svg" alt="" />
                            </div>
                            <h4 className='font-medium text-[16px] lg:text-[18px] mb-2'>Please login to view order details</h4>
                            <NavLink to="/" className='btnClass font-medium text-[14px] bg-orange !border-orange text-white mt-4 inline-block'>Go Home</NavLink>
                        </div>
                    </AnimatedSection>
                </Container>
            </section>
        )
    }

    const order = orders.find(o => o.ref === ref)

    /* ── Order not found ── */
    if (!order) {
        return (
            <section>
                <Container>
                    <AnimatedSection animation="scale-in">
                        <div className="text-center py-16">
                            <h4 className='font-medium text-[18px] mb-2'>Order not found</h4>
                            <p className='text-gray text-[14px] mb-4'>Ref: {ref}</p>
                            <NavLink to="/orders" className='btnClass font-medium text-[14px] bg-orange !border-orange text-white'>Back to My Orders</NavLink>
                        </div>
                    </AnimatedSection>
                </Container>
            </section>
        )
    }

    const currentStep = getDeliveryStep(order.date)
    const subtotal = order.items?.reduce((s, i) => s + parseFloat(i.price) * i.qty, 0) || 0
    const shipping = order.shippingMethod === 'FedEx' ? 0.88 : 0
    const discount = order.discount || 0

    return (
        <Fragment>
            <section>
                <Container>
                    {/* ── Breadcrumb ── */}
                    <AnimatedSection animation="fade-down">
                        <div className="mb-6 flex items-center gap-2 font-medium text-[14px] lg:text-[16px] text-[#A3A3A3]">
                            <NavLink to="/orders" className='text-[#A3A3A3] hover:text-black transition-colors'>My Orders</NavLink>
                            <RightArrowIcon width={20} height={20} color="#A3A3A3" />
                            <span className='text-black'>Order {order.ref}</span>
                        </div>
                    </AnimatedSection>

                    <Row>
                        {/* ── Left column ── */}
                        <Col lg={8} className='mb-6 mb-lg-0'>

                            {/* ── Delivery Tracking ── */}
                            <AnimatedSection animation="fade-up" delay="anim-delay-100">
                                <div className="border border-solid border-[#E5E5E5] rounded-[16px] px-6 py-6 mb-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h4 className='font-Helvetica font-normal text-[18px] lg:text-[20px]'>Delivery Tracking</h4>
                                        <span className='text-[12px] text-gray'>
                                            Est. delivery: {currentStep >= 5 ? 'Delivered' : '2–5 business days'}
                                        </span>
                                    </div>

                                    {/* Timeline */}
                                    <div className="relative">
                                        {/* Vertical line */}
                                        <div className="absolute left-[19px] top-0 bottom-0 w-[2px] bg-[#E5E5E5]" style={{ top: '20px', bottom: '20px' }}></div>
                                        {/* Progress line */}
                                        <div
                                            className="absolute left-[19px] w-[2px] bg-orange transition-all duration-700"
                                            style={{
                                                top: '20px',
                                                height: currentStep >= DELIVERY_STEPS.length
                                                    ? 'calc(100% - 40px)'
                                                    : `calc(${((currentStep - 1) / (DELIVERY_STEPS.length - 1)) * 100}% - 0px)`,
                                            }}
                                        ></div>

                                        <div className="flex flex-col gap-6">
                                            {DELIVERY_STEPS.map((step, idx) => {
                                                const stepNum = idx + 1
                                                const isDone = stepNum <= currentStep
                                                const isCurrent = stepNum === currentStep

                                                return (
                                                    <div key={step.key} className="flex items-start gap-4 relative">
                                                        {/* Circle */}
                                                        <div className={
                                                            'w-[40px] h-[40px] rounded-full flex items-center justify-center flex-shrink-0 z-[1] transition-all duration-500 ' +
                                                            (isDone
                                                                ? 'bg-orange text-white'
                                                                : 'bg-white border-2 border-[#E5E5E5] text-[#A3A3A3]')
                                                        }>
                                                            {step.icon}
                                                        </div>

                                                        {/* Content */}
                                                        <div className="pt-[8px]">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <h5 className={
                                                                    'font-medium text-[14px] lg:text-[16px] ' +
                                                                    (isDone ? 'text-black' : 'text-[#A3A3A3]')
                                                                }>
                                                                    {step.label}
                                                                </h5>
                                                                {isCurrent && (
                                                                    <span className='text-[10px] font-medium px-2 py-[2px] bg-orange text-white rounded-full'>
                                                                        Current
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className={
                                                                'text-[12px] lg:text-[14px] ' +
                                                                (isDone ? 'text-gray' : 'text-[#A3A3A3]')
                                                            }>
                                                                {step.desc}
                                                            </p>
                                                            {isDone && (
                                                                <p className='text-[11px] text-[#A3A3A3] mt-1'>
                                                                    {formatDateTime(order.date)}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </AnimatedSection>

                            {/* ── Order Items ── */}
                            <AnimatedSection animation="fade-up" delay="anim-delay-200">
                                <div className="border border-solid border-[#E5E5E5] rounded-[16px] px-6 py-6 mb-6">
                                    <h4 className='font-Helvetica font-normal text-[18px] lg:text-[20px] mb-4'>Order Items</h4>
                                    <div className="flex flex-col gap-4">
                                        {order.items?.map((item, idx) => (
                                            <div key={idx} className="flex items-center justify-between py-3 border-b border-solid border-[#E5E5E5] last:border-0">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={item.img || '/images/p (2).png'}
                                                        className='w-[80px] h-[80px] rounded-[8px] object-cover flex-shrink-0'
                                                        alt={item.name}
                                                    />
                                                    <div>
                                                        <h5 className='font-semibold text-[16px] mb-1'>{item.name}</h5>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            {item.selectedColor && (
                                                                <span
                                                                    className='inline-block w-[14px] h-[14px] rounded-full border border-solid border-[#E5E5E5]'
                                                                    style={{ backgroundColor: item.selectedColor }}
                                                                ></span>
                                                            )}
                                                            {item.selectedSize && (
                                                                <span className='text-[12px] text-gray'>Size: {item.selectedSize}</span>
                                                            )}
                                                        </div>
                                                        <p className='text-[14px] text-[#A3A3A3]'>Qty: {item.qty}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className='font-medium text-[16px]'>${(parseFloat(item.price) * item.qty).toFixed(2)}</p>
                                                    <p className='text-[12px] text-gray'>${item.price} each</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </AnimatedSection>

                            {/* ── Shipping Info ── */}
                            <AnimatedSection animation="fade-up" delay="anim-delay-300">
                                <div className="border border-solid border-[#E5E5E5] rounded-[16px] px-6 py-6">
                                    <h4 className='font-Helvetica font-normal text-[18px] lg:text-[20px] mb-4'>Shipping Information</h4>
                                    <Row>
                                        <Col md={6} className='mb-3 md:mb-0'>
                                            <p className='text-[12px] text-gray mb-1'>Shipping Method</p>
                                            <h5 className='font-medium text-[14px] lg:text-[16px]'>
                                                {order.shippingMethod || 'DHL'}
                                                <span className='font-normal text-gray ml-2 text-[12px]'>
                                                    ({order.shippingMethod === 'FedEx' ? 'Next day' : '3 business days'})
                                                </span>
                                            </h5>
                                        </Col>
                                        <Col md={6}>
                                            <p className='text-[12px] text-gray mb-1'>Payment Method</p>
                                            <h5 className='font-medium text-[14px] lg:text-[16px]'>{order.paymentMethod || 'Credit Card'}</h5>
                                        </Col>
                                    </Row>
                                </div>
                            </AnimatedSection>
                        </Col>

                        {/* ── Right column — Order Summary ── */}
                        <Col lg={4}>
                            <AnimatedSection animation="fade-left" delay="anim-delay-200">
                                <div className="border border-solid border-[#E5E5E5] rounded-[16px] px-6 py-6 sticky top-[110px]">
                                    <h4 className='font-Helvetica font-normal text-[18px] lg:text-[20px] mb-4'>Order Summary</h4>

                                    {/* Meta */}
                                    <div className="flex flex-col gap-3 mb-4">
                                        <div className="flex justify-between text-[14px]">
                                            <span className='text-gray'>Ref Number</span>
                                            <span className='font-medium'>{order.ref}</span>
                                        </div>
                                        <div className="flex justify-between text-[14px]">
                                            <span className='text-gray'>Order Date</span>
                                            <span className='font-medium'>{formatDate(order.date)}</span>
                                        </div>
                                        <div className="flex justify-between text-[14px]">
                                            <span className='text-gray'>Status</span>
                                            <span className='font-medium text-orange'>{order.status || 'Completed'}</span>
                                        </div>
                                    </div>

                                    <hr className='border-[#E5E5E5] mb-4' />

                                    {/* Pricing */}
                                    <div className="flex flex-col gap-3 mb-4">
                                        <div className="flex justify-between text-[14px] lg:text-[16px]">
                                            <span className='text-gray'>Subtotal</span>
                                            <span className='font-medium'>${subtotal.toFixed(2)}</span>
                                        </div>
                                        {discount > 0 && (
                                            <div className="flex justify-between text-[14px] lg:text-[16px]">
                                                <span className='text-gray'>Discount</span>
                                                <span className='font-medium'>-${discount.toFixed(2)}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between text-[14px] lg:text-[16px]">
                                            <span className='text-gray'>Shipping</span>
                                            <span className='font-medium'>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                                        </div>
                                        <hr className='border-[#E5E5E5]' />
                                        <div className="flex justify-between text-[16px] lg:text-[18px]">
                                            <span className='text-gray'>Total</span>
                                            <span className='font-semibold'>${order.total?.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    <NavLink
                                        to="/orders"
                                        className='btnClass font-medium text-[14px] lg:text-[16px] !border-[#E5E5E5] text-black w-full text-center block'
                                    >
                                        ← Back to My Orders
                                    </NavLink>
                                </div>
                            </AnimatedSection>
                        </Col>
                    </Row>
                </Container>
            </section>
        </Fragment>
    )
}

export default OrderDetail
