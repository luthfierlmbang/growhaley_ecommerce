import React, { Fragment, useState } from 'react'
import { Col, Container, Form, Row } from 'react-bootstrap'
import { RightArrowIcon } from '../Components/Icon/Icon'
import { NavLink } from 'react-router-dom'
import AnimatedSection from '../Components/Common/AnimatedSection'

const Checkout = () => {
    const [ToogleCheck, setToogleCheck] = useState("")
    const roundChekck = (e) => {
        return <div onClick={() => setToogleCheck(e)} className={"w-[24px] h-[24px] rounded-full border border-solid flex items-center justify-center cursor-pointer " + (ToogleCheck === e ? "border-orange bg-orange" : "border-[#A3A3A3]")}>
            {
                ToogleCheck === e ? <img src="./../images/check (3).svg" alt="" /> : ""
            }
        </div>
    }
    return (
        <Fragment>
            <section>
                <Container>
                    <AnimatedSection animation="fade-down">
                    <div className="mb-6 flex items-center gap-2 font-medium text-[14px] lg:text-[16px] text-[#A3A3A3]">
                        <span>My Cart</span>
                        <RightArrowIcon width={24} height={24} color={"#A3A3A3"} />
                        <span className='text-black'>Checkout</span>
                        <RightArrowIcon width={24} height={24} color={"#171717"} />
                        <span>Payment</span>
                    </div>
                    </AnimatedSection>
                    <AnimatedSection animation="fade-up" delay="anim-delay-100">
                    <Row>
                        <Col className='mb-4 md:mb-0' md={8}>
                            <Form.Group className='mb-3'>
                                <Form.Label className='font-medium text-[14px] lg:text-[16px]'>Select Shipping Country</Form.Label>
                                <Form.Select aria-label="Default select example" className='text-[12px] lg:text-[14px] h-[56px] outline-none shadow-none border-[#E5E5E5] rounded-[8px] focus:border-[#E5E5E5]'>
                                    <option>Select Country</option>
                                    <option value="1">One</option>
                                    <option value="2">Two</option>
                                    <option value="3">Three</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className='mb-3'>
                                <Form.Label className='font-medium text-[14px] lg:text-[16px]'>Shipping Address</Form.Label>
                                <Form.Control type="text" className='text-[12px] lg:text-[14px] h-[56px] outline-none shadow-none border-[#E5E5E5] rounded-[8px] focus:border-[#E5E5E5]' placeholder="Full name" />
                            </Form.Group>

                            <Row>
                                <Col md={6}>
                                    <Form.Group className='mb-3'>
                                        <Form.Control type="text" className='text-[12px] lg:text-[14px] h-[56px] outline-none shadow-none border-[#E5E5E5] rounded-[8px] focus:border-[#E5E5E5]' placeholder="Email address" />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className='mb-3'>
                                        <Form.Control type="text" className='text-[12px] lg:text-[14px] h-[56px] outline-none shadow-none border-[#E5E5E5] rounded-[8px] focus:border-[#E5E5E5]' placeholder="Phone number" />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Form.Group className='mb-3'>
                                <Form.Control type="text" className='text-[12px] lg:text-[14px] h-[56px] outline-none shadow-none border-[#E5E5E5] rounded-[8px] focus:border-[#E5E5E5]' placeholder="Enter street name and house number" />
                            </Form.Group>

                            <Row>
                                <Col md={6}>
                                    <Form.Group className='mb-3'>
                                        <Form.Control type="text" className='text-[12px] lg:text-[14px] h-[56px] outline-none shadow-none border-[#E5E5E5] rounded-[8px] focus:border-[#E5E5E5]' placeholder="City" />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className='mb-3'>
                                        <Form.Select aria-label="Default select example" className='text-[12px] lg:text-[14px] h-[56px] outline-none shadow-none border-[#E5E5E5] rounded-[8px] focus:border-[#E5E5E5]'>
                                            <option>Select Region</option>
                                            <option value="1">One</option>
                                            <option value="2">Two</option>
                                            <option value="3">Three</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Form.Group className='mb-3'>
                                <Form.Control type="text" className='text-[12px] lg:text-[14px] h-[56px] outline-none shadow-none border-[#E5E5E5] rounded-[8px] focus:border-[#E5E5E5]' placeholder="Enter your postal code" />
                            </Form.Group>


                            <div className="mt-6">
                                <Form.Label className='font-medium text-[14px] lg:text-[16px]'>Shipping Method</Form.Label>
                                <Row>
                                    <Col className='mb-4 xl:mb-0' xl={6}>
                                        <div className={"flex justify-between items-center px-3 py-3 border border-solid rounded-[8px] cursor-pointer " + (ToogleCheck === "DHL" ? "!border-orange" : "border-[#E5E5E5]")} onClick={() => setToogleCheck("DHL")}>
                                            <div className="flex items-center gap-3">
                                                <img src="./../images/dhl-3 1.png" alt="" />
                                                <div>
                                                    <h4 className='font-semibold text-[16px] lg:text-[18px] mb-1'>DHL</h4>
                                                    <p className='text-[16px] lg:text-[18px] text-[#A3A3A3]'>3 business days</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className='text-[14px] lg:text-[16px]'>Free</span>
                                                {roundChekck("DHL")}
                                            </div>
                                        </div>
                                    </Col>
                                    <Col xl={6}>
                                        <div className={"flex justify-between items-center px-3 py-3 border border-solid rounded-[8px] cursor-pointer " + (ToogleCheck === "FedEx" ? "!border-orange" : "border-[#E5E5E5]")} onClick={() => setToogleCheck("FedEx")}>
                                            <div className="flex items-center gap-3">
                                                <img src="./../images/fedex-express-1 1.png" alt="" />
                                                <div>
                                                    <h4 className='font-semibold text-[16px] lg:text-[18px] mb-1'>FedEx</h4>
                                                    <p className='text-[16px] lg:text-[18px] text-[#A3A3A3]'>Next day</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className='text-[14px] lg:text-[16px]'>$0.88</span>
                                                {roundChekck("FedEx")}
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                        <Col md={4}>
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
                                    <div className="flex items-center justify-between text-[16px] lg:text-[18px] w-full">
                                        <span className='text-gray'>Subtotal</span>
                                        <span className='font-medium'>$124.99</span>
                                    </div>
                                    <div className="flex items-center justify-between text-[16px] lg:text-[18px] w-full">
                                        <span className='text-gray'>Discount</span>
                                        <span className='font-medium'>-$12</span>
                                    </div>
                                    <div className="flex items-center justify-between text-[16px] lg:text-[18px] w-full">
                                        <span className='text-gray'>Shipping Cost</span>
                                        <span className='font-medium'>-Free</span>
                                    </div>
                                    <hr className='border-[#E5E5E5] w-full' />
                                    <div className="flex items-center justify-between text-[16px] lg:text-[18px] w-full">
                                        <span className='text-gray'>Total</span>
                                        <span className='font-medium'>$124.99</span>
                                    </div>
                                </div>

                                <NavLink to="/payment" className='btnClass large font-medium text-[14px] lg:text-[16px] bg-orange !border-orange text-white w-full text-center '>Continue To Payment</NavLink>
                            </div>
                        </Col>
                    </Row>
                    </AnimatedSection>

                </Container>
            </section>
        </Fragment >
    )
}

export default Checkout
