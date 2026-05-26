import React, { Fragment } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { FilterProduct } from '../Components/Filter/Filter'
import { CardProduct } from '../Components/Card/Card'
import { CarouselTestimonial } from '../Components/Carousel/Carousel'
import { RotateIcon, ShieldIcon, StarIcon, TrukIcon } from '../Components/Icon/Icon'
import Subscribe from '../Components/Pages/Subscribe'
import { NavLink } from 'react-router-dom'
import { dataProduct } from '../data/products'
import AnimatedSection from '../Components/Common/AnimatedSection'
import useCountUp from '../hooks/useCountUp'

/* ── Animated stat number ── */
const StatNumber = ({ target, suffix = '' }) => {
    const [ref, count] = useCountUp(target, 1800)
    return (
        <span ref={ref}>
            {count}{suffix}
        </span>
    )
}

const Homepage = () => {
    return (
        <Fragment>
            {/* ── Hero ── */}
            <section className='py-0'>
                <Container>
                    <div className="bg-[#F6F6F6] rounded-[24px] overflow-hidden">
                        <div className="p-8 md:p-14 w-full relative">
                            <img src="./../images/wide.png" className='hidden md:block absolute right-0 top-[14rem] xl:top-[3rem] w-[14rem] xl:w-auto' alt="" />
                            <img src="./../images/Minimalist Fashion Brand Catalog Mobile Presentation  1.png" className='md:block hidden absolute right-0 bottom-0 w-[34rem] lg:w-[40rem] xl:w-[53rem]' alt="" />
                            <Row className='relative z-[2]'>
                                <Col md={6}>
                                    <AnimatedSection animation="fade-down" delay="anim-delay-100">
                                        <h1 className='font-Helvetica text-[32px] md:text-[40px] lg:text-[50px] xl:text-[64px]'>
                                            <b>TRENDY FASHION</b> <br />COLLECTION
                                        </h1>
                                    </AnimatedSection>
                                    <AnimatedSection animation="fade-up" delay="anim-delay-200">
                                        <p className='text-[14px] lg:text-[16px] text-gray my-4 mb-6'>Finding your fashion has never been easier. Browse the best selection of famous fashion brands that suit your style and preferences.</p>
                                        <NavLink to="/product" className='btnClass font-medium text-[14px] lg:text-[16px] bg-orange !border-orange text-white'>Shop Now</NavLink>
                                    </AnimatedSection>
                                    <AnimatedSection animation="fade-up" delay="anim-delay-400">
                                        <div className="mt-[3rem] md:mt-[6rem]">
                                            <div className="flex gap-4">
                                                <div>
                                                    <h4 className='font-normal font-Helvetica text-[24px] md:text-[32px] xl:text-[46px]'>
                                                        <StatNumber target={80} suffix="+" />
                                                    </h4>
                                                    <p className='text-[14px] lg:text-[16px] text-gray'>Unique Style</p>
                                                </div>
                                                <div>
                                                    <h4 className='font-normal font-Helvetica text-[24px] md:text-[32px] xl:text-[46px]'>
                                                        <StatNumber target={40} suffix="+" />
                                                    </h4>
                                                    <p className='text-[14px] lg:text-[16px] text-gray'>Brand Trusted</p>
                                                </div>
                                            </div>
                                            <div className="mt-8">
                                                <div className="flex items-center mb-2">
                                                    <div className="w-[16px] md:w-[24px] xl:w-[32px] h-[16px] md:h-[24px] xl:h-[32px] rounded-full bg-[#3E5064]"></div>
                                                    <div className="w-[16px] md:w-[24px] xl:w-[32px] h-[16px] md:h-[24px] xl:h-[32px] rounded-full bg-[#E16F3D] -ml-[12px]"></div>
                                                </div>
                                                <p className='text-[14px] lg:text-[16px] text-gray'>80+ Molestie hendrerit amet <br className='block md:hidden' /> sapien volutpat.</p>
                                            </div>
                                        </div>
                                    </AnimatedSection>
                                </Col>
                            </Row>
                        </div>
                        <AnimatedSection animation="fade-right" delay="anim-delay-300" className="text-right md:hidden -mt-[9rem] translate-x-[3rem] sm:translate-x-[4rem]">
                            <img src="./../images/Minimalist Fashion Brand Catalog Mobile Presentation  1.png" className='w-[34rem] lg:w-[40rem] xl:w-[53rem]' alt="" />
                        </AnimatedSection>
                    </div>
                </Container>
            </section>

            {/* ── Our Products ── */}
            <section>
                <Container>
                    <AnimatedSection animation="fade-up">
                        <h2 className='font-Helvetica font-normal text-[24px] md:text-[28px] lg:text-[32px] xl:text-[48px] mb-10'>Our Products</h2>
                    </AnimatedSection>
                    <AnimatedSection animation="fade-up" delay="anim-delay-100">
                        <div className="mb-6 overflow-auto no-scrollbar">
                            <FilterProduct />
                        </div>
                    </AnimatedSection>
                    <Row>
                        {dataProduct.map((obj, i) => (
                            <Col key={obj.name + i} className={'col-6 ' + (i === 2 ? "hidden lg:block" : "")} lg={4}>
                                <AnimatedSection animation="fade-up" delay={`anim-delay-${(i + 1) * 100}`}>
                                    <CardProduct data={obj} />
                                </AnimatedSection>
                            </Col>
                        ))}
                    </Row>
                    <AnimatedSection animation="fade-up" delay="anim-delay-400">
                        <div className="text-center mt-8">
                            <NavLink to="/product" className='font-medium text-[12px] lg:text-[14px] text-orange !border-orange btnClass hover:bg-orange hover:text-white'>See All Product</NavLink>
                        </div>
                    </AnimatedSection>
                </Container>
            </section>

            {/* ── New Collections ── */}
            <section>
                <Container>
                    <Row className='mb-6'>
                        <Col md={6} className='my-auto'>
                            <AnimatedSection animation="fade-left">
                                <h2 className='font-Helvetica font-normal text-[24px] md:text-[28px] lg:text-[32px] xl:text-[48px]'>New Style for Latest Collections</h2>
                            </AnimatedSection>
                        </Col>
                        <Col md={6} className='my-auto'>
                            <AnimatedSection animation="fade-right" delay="anim-delay-200">
                                <p className='text-[14px] lg:text-[16px] text-gray'>Discover our latest collection of clothing, shoes, and accessories that are perfect for any occasion. From casual wear to formal attire, we have everything you need to revamp your wardrobe and stay on trend.</p>
                            </AnimatedSection>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6} className='mb-4 md:my-auto'>
                            <AnimatedSection animation="fade-left" delay="anim-delay-100">
                                <div className="w-full h-[400px] md:h-[560px] rounded-[24px] p-4 lg:p-8 bg-[#F6F6F6] relative overflow-hidden">
                                    <img src="./../images/wide.png" className='absolute -left-[9rem] -bottom-[9rem] rotate-[45deg]' alt="" />
                                    <img src="./../images/wide.png" className='absolute right-[8rem] top-[11rem]' alt="" />
                                    <img src="./../images/img.png" className='absolute right-0 bottom-0' alt="" />
                                    <div className="relative z-2">
                                        <h4 className='font-Helvetica text-[32px] md:text-[40px] lg:text-[50px] xl:text-[64px] font-normal'>NEW <br />CASUAL <br />STYLE</h4>
                                        <p className='text-[14px] lg:text-[16px] mt-3 mb-8 text-gray'>Collection</p>
                                        <NavLink to="/product" className='font-medium text-[14px] lg:text-[16px] bg-black text-white btnClass'>Shop Now</NavLink>
                                    </div>
                                </div>
                            </AnimatedSection>
                        </Col>
                        <Col md={6} className='my-auto'>
                            <div className="flex w-full h-full gap-[1rem] md:flex-wrap">
                                <AnimatedSection animation="fade-right" delay="anim-delay-200" className="w-full h-[calc((560px_/_2)_-_0.5rem)] rounded-[24px] py-4 lg:py-0 px-4 lg:px-8 bg-[#F6F6F6] relative overflow-hidden">
                                    <img src="./../images/wide.png" className='absolute -left-[7rem] -bottom-[7rem] rotate-[45deg] w-[14rem]' alt="" />
                                    <img src="./../images/wide.png" className='absolute right-0 top-[1rem] rotate-[45deg] w-[9rem]' alt="" />
                                    <img src="./../images/safsafsaf.png" className='absolute right-0 bottom-0 h-auto md:h-[112%] object-cover' alt="" />
                                    <div className="relative z-2">
                                        <h3 className='text-[32px] md:text-[40px] lg:text-[50px] xl:text-[64px] font-normal font-Helvetica'><span className='text-[32px]'>SPRING</span><br />DATING</h3>
                                        <p className='text-[14px] lg:text-[16px] text-gray'>Collection</p>
                                    </div>
                                </AnimatedSection>
                                <AnimatedSection animation="fade-right" delay="anim-delay-400" className="w-full h-[calc((560px_/_2)_-_0.5rem)] rounded-[24px] p-4 lg:p-8 bg-orange relative overflow-hidden">
                                    <img src="./../images/sdfdg.png" className='absolute bottom-0 md:bottom-auto md:top-1/2 md:-translate-y-[70%] lg:-translate-y-1/2 md:right-0 lg:right-[4rem] w-[7rem] md:w-auto' alt="" />
                                    <div className="relative z-2 my-auto">
                                        <h3 className='text-[32px] md:text-[40px] lg:text-[50px] xl:text-[64px] font-normal font-Helvetica text-[#E2DBCB]'>GET <br />$15 OFF</h3>
                                        <p className='text-[14px] lg:text-[16px] text-[#E2DBCB] mt-2'>For all item in our store or website</p>
                                    </div>
                                </AnimatedSection>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* ── Supported By ── */}
            <section>
                <Container>
                    <AnimatedSection animation="fade-up">
                        <h5 className="text-[24px] md:text-[28px] lg:text-[32px] xl:text-[48px] font-normal text-center font-Helvetica mb-6">We Are Supported By</h5>
                    </AnimatedSection>
                    <div className="flex justify-center items-center gap-[1rem] flex-wrap">
                        {[
                            "./../images/ic (6).png",
                            "./../images/ic (1).png",
                            "./../images/ic (2).png",
                            "./../images/ic (3).png",
                            "./../images/ic (4).png",
                            "./../images/ic (5).png",
                        ].map((src, i) => (
                            <AnimatedSection key={src} animation="scale-in" delay={`anim-delay-${(i + 1) * 100}`} className="w-[calc((100%_/_2)_-_1rem)] sm:w-[190px] h-[128px] rounded-[16px] flex items-center justify-center border border-solid border-[#E5E5E5]">
                                <img src={src} alt="" />
                            </AnimatedSection>
                        ))}
                    </div>
                </Container>
            </section>

            {/* ── Testimonials ── */}
            <section>
                <Container>
                    <AnimatedSection animation="fade-up" className="mb-6 text-center">
                        <h5 className="text-[24px] md:text-[28px] lg:text-[32px] xl:text-[48px] font-normal font-Helvetica mb-2">What our clients have to say!</h5>
                        <p className='text-[14px] lg:text-[16px] text-[#525252]'>80+ Molestie hendrerit amet sapien volutpat.</p>
                    </AnimatedSection>
                    <AnimatedSection animation="fade-up" delay="anim-delay-200">
                        <CarouselTestimonial />
                    </AnimatedSection>
                </Container>
            </section>

            {/* ── Outfit Inspiration ── */}
            <section>
                <Container>
                    <Row>
                        <Col className='col-6 col-md-5'>
                            <AnimatedSection animation="fade-left">
                                <div className="w-full h-[256px] md:h-[370px] lg:h-[520px] overflow-hidden p-[0.5rem] sm:p-[1.5rem] rounded-[24px] bg-[#E16F3D] flex flex-wrap">
                                    <div className='hidden lg:block'><StarIcon /></div>
                                    <div className='w-full self-end'>
                                        <h4 className='font-Helvetica text-[24px] sm:text-[32px] md:text-[40px] lg:text-[50px] xl:text-[64px] font-normal text-[#E2DBCB]'>OUTFIT INSPIRATION OT THE DAY</h4>
                                        <p className='text-[14px] lg:text-[16px] mt-3 font-medium text-[#E2DBCB]'>80+ Molestie hendrerit amet <br className='hidden sm:block' /> sapien volutpat.</p>
                                    </div>
                                </div>
                            </AnimatedSection>
                        </Col>
                        <Col className='col-6 col-md-7'>
                            <AnimatedSection animation="fade-right" delay="anim-delay-200">
                                <div className="w-full h-[256px] md:h-[370px] lg:h-[520px] overflow-hidden p-[0.5rem] sm:p-[1.5rem] rounded-[24px] bg-[#F6F6F6] relative overflow-hidden">
                                    <h4 className='font-Helvetica text-[24px] sm:text-[32px] md:text-[40px] lg:text-[50px] xl:text-[64px] font-normal relative z-2'>NEW <br />CASUAL<br />STYLE</h4>
                                    <img src="/images/wide.png" className="absolute w-[13rem] xl:w-auto right-[0rem] top-[1rem]" alt="" />
                                    <img src="/images/wide.png" className="absolute -left-[9rem] -bottom-[9rem] rotate-[45deg]" alt="" />
                                    <img src="./../images/Stylish Fabulous Woman Fashion Instagram Story 1.png" className='absolute -right-[3.5rem] xl:right-0 bottom-0 w-[30rem] xl:w-auto' alt="" />
                                </div>
                            </AnimatedSection>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* ── Our Services ── */}
            <section>
                <Container>
                    <Row>
                        <Col className='mb-4 xl:mb-0' md={6} xl={3}>
                            <AnimatedSection animation="fade-up">
                                <h2 className='font-Helvetica font-normal text-[24px] md:text-[28px] lg:text-[32px] xl:text-[48px] mb-2'>Our Services</h2>
                                <p className='text-[14px] lg:text-[16px] text-gray'>We understand the importance of a seamless and enjoyable shopping experience.</p>
                            </AnimatedSection>
                        </Col>
                        {[
                            { icon: <RotateIcon />, title: "Free Returns", desc: "Our customers can return or exchange their purchases hassle-free, with our easy-to-use return policy." },
                            { icon: <ShieldIcon />, title: "Secure Payment", desc: "We offer a secure checkout process that protects our customers' personal and financial information." },
                            { icon: <TrukIcon />, title: "Customer Support", desc: "Our customer support team is available to help customers with any questions or concerns they may have, ensuring a seamless and stress-free shopping experience." },
                        ].map((service, i) => (
                            <Col key={service.title} className='mb-4 xl:mb-0' md={6} xl={3}>
                                <AnimatedSection animation="fade-up" delay={`anim-delay-${(i + 1) * 200}`}>
                                    <div className='w-full h-full p-6 rounded-[24px] border border-solid border-[#E5E5E5]'>
                                        {service.icon}
                                        <h5 className='text-[24px] font-Helvetica my-3'>{service.title}</h5>
                                        <p className='text-[14px] lg:text-[16px] text-gray'>{service.desc}</p>
                                    </div>
                                </AnimatedSection>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>

            <AnimatedSection animation="fade-up">
                <Subscribe />
            </AnimatedSection>
        </Fragment>
    )
}

export default Homepage
