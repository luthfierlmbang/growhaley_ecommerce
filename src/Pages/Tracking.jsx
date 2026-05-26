import React, { Fragment } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import AnimatedSection from '../Components/Common/AnimatedSection'

const Tracking = () => {
    const orders = Array.from({ length: 4 }, (_, index) => ({
        id: `ORD-${index + 1}`,
        img: "/images/it (4).png",
        name: "Winter Coat",
        variant: "Beiges M",
        date: "Thursday, May 11 2023",
        ref: "0981727198201",
        price: "$124.99",
    }))

    return (
        <Fragment>
            <section>
                <Container>
                    <AnimatedSection animation="fade-down">
                        <h3 className='font-Helvetica text-[32px] mb-6'>Order Tracking</h3>
                    </AnimatedSection>

                    <AnimatedSection animation="fade-up" delay="anim-delay-100">
                        <Row className='py-6 hidden lg:flex'>
                            <Col md={3}><h4 className='text-[16px] text-[#A3A3A3]'>Product</h4></Col>
                            <Col md={3}><h4 className='text-[16px] text-[#A3A3A3] text-center'>Date</h4></Col>
                            <Col md={3}><h4 className='text-[16px] text-[#A3A3A3] text-center'>Ref Number</h4></Col>
                            <Col md={1}><h4 className='text-[16px] text-[#A3A3A3] text-center'>Price</h4></Col>
                            <Col md={2}><h4 className='text-[16px] text-[#A3A3A3] text-right'>Status</h4></Col>
                        </Row>
                    </AnimatedSection>

                    {orders.map((order, i) => (
                        <AnimatedSection key={order.id} animation="fade-up" delay={`anim-delay-${(i + 1) * 100}`}>
                            <div className="py-6 border-t border-solid border-[#E5E5E5]">
                                <Row>
                                    <Col className='mb-2 mb-lg-0' lg={3}>
                                        <div className='flex items-center gap-3'>
                                            <img src={order.img} className='w-[80px] h-[80px] rounded-[8px] object-cover' alt={order.name} />
                                            <div>
                                                <h4 className='font-semibold text-[18px] mb-2'>{order.name}</h4>
                                                <p className='text-[18px] text-[#A3A3A3] font-normal'>{order.variant}</p>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col className='mb-2 my-lg-auto lg:text-center' lg={3}>
                                        <p className='ml-[6rem] lg:ml-0 text-[16px]'>{order.date}</p>
                                    </Col>
                                    <Col className='mb-2 my-lg-auto lg:text-center' lg={3}>
                                        <p className='ml-[6rem] lg:ml-0 text-[16px]'>{order.ref}</p>
                                    </Col>
                                    <Col className='mb-2 my-lg-auto lg:text-center' lg={1}>
                                        <p className='ml-[6rem] lg:ml-0 text-[18px] font-medium'>{order.price}</p>
                                    </Col>
                                    <Col className='mb-2 my-lg-auto lg:text-right' lg={2}>
                                        <a href="#!" className='ml-[6rem] lg:ml-0 font-medium text-[12px] lg:text-sm text-orange !border-orange btnClass hover:bg-orange hover:text-white'>Track Order</a>
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

export default Tracking
