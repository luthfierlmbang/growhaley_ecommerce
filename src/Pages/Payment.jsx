import React, { Fragment, useState } from 'react'
import { Col, Container, Form, Modal, Row } from 'react-bootstrap'
import { RightArrowIcon } from '../Components/Icon/Icon'
import AnimatedSection from '../Components/Common/AnimatedSection'

const Payment = () => {
    const [ToogleCheck, setToogleCheck] = useState("")
    const roundChekck = (e) => (
        <div onClick={() => setToogleCheck(e)} className={"w-[24px] h-[24px] rounded-full border border-solid flex items-center justify-center cursor-pointer " + (ToogleCheck === e ? "border-orange bg-orange" : "border-[#A3A3A3]")}>
            {ToogleCheck === e && <img src="./../images/check (3).svg" alt="" />}
        </div>
    )

    const [show, setShow] = useState(false)
    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)

    return (
        <Fragment>
            <Modal show={show} onHide={handleClose}>
                <Modal.Body className='px-6 py-6'>
                    <div className="text-center">
                        <img src="./../images/Checkmark, Done, Check.svg" className='mx-auto mb-3' alt="" />
                        <h3 className='font-normal text-[18px] lg:text-[24px] font-Helvetica'>Payment Success!</h3>
                        <p className='text-[14px] lg:text-[16px] text-gray'>Thanks for your order, the order confirmation has <br className='hidden sm:block' /> been sent to customer@gmail.com</p>
                        <div className="my-6">
                            <p className='text-[12px] lg:text-[14px] text-gray mb-1'>Total Payment</p>
                            <h3 className='text-[24px] md:text-[28px] text-[32px] font-Helvetica'>$112.99</h3>
                        </div>
                        <Row className='text-left'>
                            <Col className='col-6 mb-3'><p className='text-[12px] lg:text-[14px] text-gray mb-1'>Ref Number</p><h5 className='text-[14px] lg:text-[16px]'>0981727198201</h5><hr className="border-[#E5E5E5] mt-3" /></Col>
                            <Col className='col-6 mb-3'><p className='text-[12px] lg:text-[14px] text-gray mb-1'>Transaction Date</p><h5 className='text-[14px] lg:text-[16px]'>Thursday, May 11 2023</h5><hr className="border-[#E5E5E5] mt-3" /></Col>
                            <Col className='col-6 mb-3'><p className='text-[12px] lg:text-[14px] text-gray mb-1'>Payment Method</p><h5 className='text-[14px] lg:text-[16px]'>PayPal</h5><hr className="border-[#E5E5E5] mt-3" /></Col>
                            <Col className='col-6 mb-3'><p className='text-[12px] lg:text-[14px] text-gray mb-1'>Shipping Method</p><h5 className='text-[14px] lg:text-[16px]'>DHL <span className='text-[#A3A3A3]'>(3 business days)</span></h5><hr className="border-[#E5E5E5] mt-3" /></Col>
                        </Row>
                        <h5 className='font-medium text-[16px] lg:text-[18px] mt-2 mb-3 text-left'>Your Order</h5>
                        <div className="flex items-center gap-3 mb-3">
                            <img src="./../images/it (2).png" className='w-[96px] h-[96px] rounded-[4px] object-cover' alt="" />
                            <div className='text-left'>
                                <h4 className='font-semibold text-[16px] lg:text-[18px]'>Winter Coat</h4>
                                <p className='text-[16px] lg:text-[18px] text-[#A3A3A3] my-1'>Beiges <span className='font-medium text-black'>M</span></p>
                                <p className='text-[16px] lg:text-[18px] text-[#A3A3A3]'><span className='font-medium text-black'>$124.99</span> x1</p>
                            </div>
                        </div>
                        <div className="mt-4 mb-6 flex items-center flex-wrap gap-3">
                            <div className="flex items-center justify-between text-[16px] lg:text-[18px] w-full"><span className='text-gray'>Subtotal</span><span className='font-semibold text-black'>$124.99</span></div>
                            <div className="flex items-center justify-between text-[16px] lg:text-[18px] w-full"><span className='text-gray'>Discount</span><span className='font-semibold text-black'>-$12</span></div>
                            <div className="flex items-center justify-between text-[16px] lg:text-[18px] w-full"><span className='text-gray'>Shipping Cost</span><span className='font-semibold text-black'>-Free</span></div>
                            <hr className='border-[#E5E5E5] w-full' />
                            <div className="flex items-center justify-between text-[16px] lg:text-[18px] w-full"><span className='text-gray'>Total</span><span className='font-semibold text-black'>$124.99</span></div>
                        </div>
                        <div className="mt-4 grid grid-cols-2 grid-rows-1 gap-4">
                            <div onClick={handleClose} className='cursor-pointer btnClass !px-[12px] sm:!px-[24px] font-medium text-[12px] lg:text-[14px] bg-transparent !border-transparent text-black'>Continue Shopping</div>
                            <div className='cursor-pointer btnClass !px-[12px] sm:!px-[24px] font-medium text-[12px] lg:text-[14px] bg-orange !border-orange text-white'>Download Received</div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

            <section>
                <Container>
                    <AnimatedSection animation="fade-down">
                        <div className="mb-6 flex items-center gap-2 font-medium text-[14px] lg:text-[16px] text-[#A3A3A3]">
                            <span>My Cart</span>
                            <RightArrowIcon width={24} height={24} color={"#A3A3A3"} />
                            <span>Checkout</span>
                            <RightArrowIcon width={24} height={24} color={"#A3A3A3"} />
                            <span className='text-black'>Payment</span>
                        </div>
                    </AnimatedSection>

                    <Row>
                        <Col lg={8} className='mb-4 mb-lg-0'>
                            <AnimatedSection animation="fade-left" delay="anim-delay-100">
                                <div className="mb-6">
                                    <Form.Label className='font-medium text-[14px] lg:text-[16px]'>Select Payment Method</Form.Label>
                                    <Row>
                                        <Col md={6} className='mb-3 md:mb-0'>
                                            <div className={"flex justify-between items-center px-3 py-3 border border-solid rounded-[8px] cursor-pointer " + (ToogleCheck === "paypal" ? "!border-orange" : "border-[#E5E5E5]")} onClick={() => setToogleCheck("paypal")}>
                                                <div className="flex items-center gap-3"><img src="./../images/paypal.png" alt="" /><h4 className='font-medium text-[12px] lg:text-[14px]'>Paypal</h4></div>
                                                {roundChekck("paypal")}
                                            </div>
                                        </Col>
                                        <Col md={6}>
                                            <div className={"flex justify-between items-center px-3 py-3 border border-solid rounded-[8px] cursor-pointer " + (ToogleCheck === "Apple Pay" ? "!border-orange" : "border-[#E5E5E5]")} onClick={() => setToogleCheck("Apple Pay")}>
                                                <div className="flex items-center gap-3"><img src="./../images/applepay.png" alt="" /><h4 className='font-medium text-[12px] lg:text-[14px]'>Apple Pay</h4></div>
                                                {roundChekck("Apple Pay")}
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </AnimatedSection>

                            <AnimatedSection animation="fade-up" delay="anim-delay-200">
                                <Form.Group className='mb-3'>
                                    <Form.Label className='font-medium text-[14px] lg:text-[16px]'>Credit Card — Cardholder Name</Form.Label>
                                    <Form.Control type="text" className='text-[12px] lg:text-[14px] h-[56px] outline-none shadow-none border-[#E5E5E5] rounded-[8px] focus:border-[#E5E5E5]' placeholder="Cardholder Name" />
                                </Form.Group>
                                <Form.Group className='mb-3'>
                                    <Form.Label className='font-medium text-[14px] lg:text-[16px]'>Card Number</Form.Label>
                                    <Form.Control type="text" className='text-[12px] lg:text-[14px] h-[56px] outline-none shadow-none border-[#E5E5E5] rounded-[8px] focus:border-[#E5E5E5]' placeholder="Card Number" />
                                </Form.Group>
                                <Row>
                                    <Col md={4}><Form.Group className='mb-3'><Form.Control type="text" className='text-[12px] lg:text-[14px] h-[56px] outline-none shadow-none border-[#E5E5E5] rounded-[8px] focus:border-[#E5E5E5]' placeholder="Expiration date (MM/YY)" /></Form.Group></Col>
                                    <Col md={4}><Form.Group className='mb-3'><Form.Control type="text" className='text-[12px] lg:text-[14px] h-[56px] outline-none shadow-none border-[#E5E5E5] rounded-[8px] focus:border-[#E5E5E5]' placeholder="CVV" /></Form.Group></Col>
                                    <Col md={4}><Form.Group className='mb-3'><Form.Control type="text" className='text-[12px] lg:text-[14px] h-[56px] outline-none shadow-none border-[#E5E5E5] rounded-[8px] focus:border-[#E5E5E5]' placeholder="Postal code" /></Form.Group></Col>
                                </Row>
                            </AnimatedSection>
                        </Col>

                        <Col lg={4}>
                            <AnimatedSection animation="fade-right" delay="anim-delay-200">
                                <div className="px-6 py-6 border border-solid border-[#E5E5E5] rounded-[16px]">
                                    <h4 className='font-bold text-[18px] lg:text-[24px] mb-2'>Order Summary</h4>
                                    <div className="flex items-center gap-3 mb-3">
                                        <img src="./../images/it (2).png" className='w-[96px] h-[96px] rounded-[4px] object-cover' alt="" />
                                        <div>
                                            <h4 className='font-semibold text-[16px] lg:text-[18px]'>Winter Coat</h4>
                                            <p className='text-[16px] lg:text-[18px] text-[#A3A3A3] my-1'>Beiges <span className='font-medium text-black'>M</span></p>
                                            <p className='text-[16px] lg:text-[18px] text-[#A3A3A3]'><span className='font-medium text-black'>$124.99</span> x1</p>
                                        </div>
                                    </div>
                                    <p className='text-[18px] text-[#A3A3A3] mb-2'>Discount Code</p>
                                    <Form.Control type="text" className='text-[12px] lg:text-[14px] h-[56px] outline-none shadow-none border-[#E5E5E5] rounded-[8px] focus:border-[#E5E5E5]' placeholder="Input discount code" />
                                    <div className="mt-4 mb-6 flex items-center flex-wrap gap-3">
                                        <div className="flex items-center justify-between text-[16px] lg:text-[18px] w-full"><span className='text-gray'>Subtotal</span><span className='font-medium'>$124.99</span></div>
                                        <div className="flex items-center justify-between text-[16px] lg:text-[18px] w-full"><span className='text-gray'>Discount</span><span className='font-medium'>-$12</span></div>
                                        <div className="flex items-center justify-between text-[16px] lg:text-[18px] w-full"><span className='text-gray'>Shipping Cost</span><span className='font-medium'>-Free</span></div>
                                        <hr className='border-[#E5E5E5] w-full' />
                                        <div className="flex items-center justify-between text-[16px] lg:text-[18px] w-full"><span className='text-gray'>Total</span><span className='font-medium'>$124.99</span></div>
                                    </div>
                                    <a href="#!" onClick={handleShow} className='btnClass large font-medium text-[14px] lg:text-[16px] bg-orange !border-orange text-white w-full text-center'>Continue To Payment</a>
                                </div>
                            </AnimatedSection>
                        </Col>
                    </Row>
                </Container>
            </section>
        </Fragment>
    )
}

export default Payment
