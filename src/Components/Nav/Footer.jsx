import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'

const Footer = () => {
    return (
        <section className='pt-0 pb-4'>
            <Container>
                <Row>
                    <Col className='mb-4 lg:mb-0 col-12' lg={3}>
                        <img src="./../images/logo.png" className='mb-4' alt="" />
                        <p className='text-[14px] lg:text-[16px] text-gray'>Finding your fashion has never been easier. Browse the best selection of famous fashion brands that suit your style and preferences.</p>
                    </Col>
                    <Col className='mb-4 lg:mb-0 col-12' lg={4}>
                        <h4 className='font-Helvetica text-[18px] lg:text-[20px] xl:text-[24px] font-normal mb-4'>Menu</h4>
                        <div className="grid grid-cols-2 grid-rows-4 gap-[15px] text-[14px] lg:text-[16px]">
                            <a href="#!" className='text-gray'>Menu</a>
                            <a href="#!" className='text-gray'>FAQ</a>
                            <a href="#!" className='text-gray'>Women</a>
                            <NavLink to="/privacy" className='text-gray'>Privacy Policy</NavLink>
                            <NavLink to="/tracking" className='text-gray'>Order Tracking</NavLink>
                            <NavLink to="/terms" className='text-gray'>Term Of Conditions</NavLink>
                            <NavLink to="/blog" className='text-gray'>Blog</NavLink>
                        </div>
                    </Col>
                    <Col className='mb-4 lg:mb-0 col-6' lg={2}>
                        <h4 className='font-Helvetica text-[18px] lg:text-[20px] xl:text-[24px] font-normal mb-4'>Connect</h4>
                        <div className="grid grid-cols-1 gap-[15px] text-[14px] lg:text-[16px]">
                            <a href="#!" className='text-gray'>Contact Us</a>
                            <a href="#!" className='text-gray'>Instagram</a>
                            <a href="#!" className='text-gray'>Facebook</a>
                            <a href="#!" className='text-gray'>Twitter</a>
                        </div>
                    </Col>
                    <Col className='mb-4 lg:mb-0 col-6' lg={3}>
                        <h4 className='font-Helvetica text-[18px] lg:text-[20px] xl:text-[24px] font-normal mb-4'>Payment Method</h4>
                        <div className="flex items-center gap-[8px] md:gap-[15px]">
                            <a href="#!" className="w-[70px] h-[35px] md:h-[50px] rounded-[4px] border border-solid border-[#F5F5F5] flex items-center justify-center">
                                <img src="./../images/lg (3).png" alt="" />
                            </a>
                            <a href="#!" className="w-[70px] h-[35px] md:h-[50px] rounded-[4px] border border-solid border-[#F5F5F5] flex items-center justify-center">
                                <img src="./../images/lg (4).png" alt="" />
                            </a>
                            <a href="#!" className="w-[70px] h-[35px] md:h-[50px] rounded-[4px] border border-solid border-[#F5F5F5] flex items-center justify-center">
                                <img src="./../images/lg (1).png" alt="" />
                            </a>
                            <a href="#!" className="w-[70px] h-[35px] md:h-[50px] rounded-[4px] border border-solid border-[#F5F5F5] flex items-center justify-center">
                                <img src="./../images/lg (2).png" alt="" />
                            </a>
                        </div>
                    </Col>
                </Row>
                <div className="text-center text-[12px] xl:text-[14px] text-gray mt-10">
                    © 2025 Lux Global Inc.
                </div>
            </Container>
        </section>
    )
}

export default Footer
