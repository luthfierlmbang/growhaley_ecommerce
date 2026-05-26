import React, { Fragment, useState } from 'react'
import { Col, Container, Form, Row } from 'react-bootstrap'
import { DownIcon, EditIcon, InfoIcon, StarRateIcon } from '../Components/Icon/Icon'
import { CarouselDetail } from '../Components/Carousel/Carousel'
import { ListComment, ListCommentDiscussion } from '../Components/LIst/List'
import RatingForm from "react-rating"
import { PaginationDetail } from '../Components/Pagination/Pagination'
import { CardProduct } from '../Components/Card/Card'
import { dataProduct } from '../data/products'
import AnimatedSection from '../Components/Common/AnimatedSection'

const Detail = () => {
    const sizeContent = ["XS", "S", "M", "L", "XL"]
    const colorContent = ["#D574B2", "#723020", "#CDBF9A", "#171717", "#838382"]
    const relatedProducts = [...dataProduct, dataProduct[0]]

    const [toogleTab, settoogleTab] = useState("Details")
    const [toogleFormReview, settoogleFormReview] = useState(false)
    const [toogleFormDiscussion, settoogleFormDiscussion] = useState(false)

    const Details = () => (
        <Fragment>
            <Row>
                <Col lg={8}>
                    <AnimatedSection animation="fade-up">
                        <p className='font-normal text-[16px] lg:text-[18px]'>We work with monitoring programs to guarantee compliance with our social, environmental and health and safety standards of our garments. To assess compliance, we have developed an audit program and continuous improvement plans.</p>
                        <div className="my-3">
                            <p className='font-normal text-[16px] lg:text-[18px]'>Abroad</p>
                            <p className='font-normal text-[16px] lg:text-[18px]'>100% cotton</p>
                        </div>
                        <p className='font-normal text-[16px] lg:text-[18px]'>Taking care of your clothes is taking care of the environment.</p>
                        <p className='font-normal text-[16px] lg:text-[18px]'>To extend the life of your denim garments, always wash them at low temperatures and inside out, in this way we help preserve the colours, the structure of the fabric and reduce energy consumption.</p>
                    </AnimatedSection>
                </Col>
            </Row>
        </Fragment>
    )

    const Reviews = () => (
        <Fragment>
            <Row>
                <Col md={4}>
                    <AnimatedSection animation="fade-left">
                        <div className="flex gap-2 md:block">
                            <div>
                                <h1 className='font-normal text-[32px] xl:text-[48px] mb-3'>4.5</h1>
                                <div className="flex items-center gap-3 mb-3">
                                    {[1,2,3,4,5].map(n => <StarRateIcon key={n} width={32} height={32} />)}
                                </div>
                                <p className='text-gray text-[12px] lg:text-[14px] mb-12'>Based on 146 reviews</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <img src="./../images/it (2).png" className='w-[95px] h-[95px] object-cover rounded-[8px] hidden sm:block' alt="" />
                                <img src="./../images/it (3).png" className='w-[95px] h-[95px] object-cover rounded-[8px] hidden xl:block' alt="" />
                                <div className="relative rounded-[8px] overflow-hidden">
                                    <div className="absolute w-full h-full left-0 top-0 bg-[#18181866] flex items-center justify-center">
                                        <span className='font-medium text-[14px] lg:text-[16px] text-white'>+56</span>
                                    </div>
                                    <img src="./../images/it (4).png" className='w-[95px] h-[95px] object-cover' alt="" />
                                </div>
                            </div>
                        </div>
                    </AnimatedSection>
                </Col>
                <Col md={8}>
                    <AnimatedSection animation="fade-right" delay="anim-delay-100">
                        <div className="flex flex-wrap sm:!flex-nowrap gap-3 sm:gap-0 justify-between items-center mb-6">
                            <div className="flex items-center gap-[1rem]">
                                <div className="flex px-[24px] py-[16px] rounded-full border border-[#E5E5E5] gap-[15px] items-center cursor-pointer" onClick={() => settoogleFormReview(!toogleFormReview)}>
                                    <EditIcon /> <span className='font-medium text-[14px] lg:text-[16px]'>{toogleFormReview ? "Cancel Review" : "Write a Review"}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-[1rem]">
                                <span className='text-[12px] lg:text-[14px] text-[#A3A3A3]'>Short by</span>
                                <div className="flex px-[24px] py-[16px] rounded-full border border-[#E5E5E5] gap-[15px] items-center">
                                    <span className='font-medium text-[14px] lg:text-[16px]'>Short By</span> <DownIcon />
                                </div>
                            </div>
                        </div>
                    </AnimatedSection>

                    {toogleFormReview && (
                        <AnimatedSection animation="slide-up" className="mb-4">
                            <div className="mb-3">
                                <h4 className='font-normal text-[12px] lg:text-[14px] mb-2'>Quality</h4>
                                <RatingForm
                                    placeholderRating={0}
                                    emptySymbol={<img src="./../images/star.png" alt="" className="icon" style={{ width: "24px", height: "24px", marginRight: "8px" }} />}
                                    placeholderSymbol={<img src="./../images/star (1).png" alt="" className="icon" style={{ width: "24px", height: "24px", marginRight: "8px" }} />}
                                    fullSymbol={<img src="./../images/star (2).png" alt="" className="icon" style={{ width: "24px", height: "24px", marginRight: "8px" }} />}
                                />
                            </div>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <Form.Control className='h-[54px] px-4 rounded-[24px] bg-transparent border border-solid border-[#E5E5E5] text-[12px] lg:text-[14px] outline-none hover:outline-none focus:outline-none shadow-none' placeholder="Enter your name" />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <Form.Control className='h-[54px] px-4 rounded-[24px] bg-transparent border border-solid border-[#E5E5E5] text-[12px] lg:text-[14px] outline-none hover:outline-none focus:outline-none shadow-none' placeholder="Email address" />
                                </div>
                                <div className="mb-4">
                                    <Form.Control className='px-4 py-4 rounded-[24px] bg-transparent border border-solid border-[#E5E5E5] text-[12px] lg:text-[14px] outline-none hover:outline-none focus:outline-none shadow-none !min-h-[176px]' placeholder="Write your review..." as="textarea" />
                                </div>
                                <div className="flex items-center justify-end gap-[12px]">
                                    <a href="#!" className='btnClass font-medium text-[14px] lg:text-[16px] text-black border border-solid border-[#E5E5E5]'>
                                        <div className="flex items-center justify-center gap-[8px]">
                                            <img src="./../images/gallery.svg" alt="" />
                                            <span>Add Photos</span>
                                        </div>
                                    </a>
                                    <a href="#!" className='btnClass font-medium text-[14px] lg:text-[16px] border border-solid border-[#F5F5F5] bg-[#F5F5F5] text-[#A3A3A3] hover:bg-orange hover:text-white hover:border-orange'>Send Review</a>
                                </div>
                            </div>
                        </AnimatedSection>
                    )}

                    <div className="flex flex-wrap gap-4">
                        {[1,2,3,4,5].map(n => (
                            <AnimatedSection key={n} animation="fade-up" delay={`anim-delay-${n * 100}`} className="w-full">
                                <ListComment />
                            </AnimatedSection>
                        ))}
                    </div>
                    <AnimatedSection animation="fade-up" delay="anim-delay-300" className="mt-5">
                        <PaginationDetail />
                    </AnimatedSection>
                </Col>
            </Row>
        </Fragment>
    )

    const Discussion = () => (
        <Fragment>
            <Row>
                <Col md={4}>
                    <AnimatedSection animation="fade-left">
                        <div className="flex gap-2 md:block">
                            <div>
                                <h1 className='font-normal text-[32px] xl:text-[48px] mb-3'>4.5</h1>
                                <div className="flex items-center gap-3 mb-3">
                                    {[1,2,3,4,5].map(n => <StarRateIcon key={n} width={32} height={32} />)}
                                </div>
                                <p className='text-gray text-[12px] lg:text-[14px] mb-12'>Based on 146 reviews</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <img src="./../images/it (2).png" className='w-[95px] h-[95px] object-cover rounded-[8px] hidden sm:block' alt="" />
                                <img src="./../images/it (3).png" className='w-[95px] h-[95px] object-cover rounded-[8px] hidden xl:block' alt="" />
                                <div className="relative rounded-[8px] overflow-hidden">
                                    <div className="absolute w-full h-full left-0 top-0 bg-[#18181866] flex items-center justify-center">
                                        <span className='font-medium text-[14px] lg:text-[16px] text-white'>+56</span>
                                    </div>
                                    <img src="./../images/it (4).png" className='w-[95px] h-[95px] object-cover' alt="" />
                                </div>
                            </div>
                        </div>
                    </AnimatedSection>
                </Col>
                <Col md={8}>
                    <AnimatedSection animation="fade-right" delay="anim-delay-100">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-[1rem]">
                                <div className="flex px-[24px] py-[16px] rounded-full border border-[#E5E5E5] gap-[15px] items-center cursor-pointer" onClick={() => settoogleFormDiscussion(!toogleFormDiscussion)}>
                                    <img src="./../images/gfhfggfjgj.svg" alt="" /> <span className='font-medium text-[14px] lg:text-[16px]'>{toogleFormDiscussion ? "Cancel Discussion" : "Start Discussion"}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-[1rem]">
                                <span className='text-[12px] lg:text-[14px] text-[#A3A3A3]'>Short by</span>
                                <div className="flex px-[24px] py-[16px] rounded-full border border-[#E5E5E5] gap-[15px] items-center">
                                    <span className='font-medium text-[14px] lg:text-[16px]'>Short By</span> <DownIcon />
                                </div>
                            </div>
                        </div>
                    </AnimatedSection>

                    {toogleFormDiscussion && (
                        <AnimatedSection animation="slide-up" className="mb-4">
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <Form.Control className='h-[54px] px-4 rounded-[24px] bg-transparent border border-solid border-[#E5E5E5] text-[12px] lg:text-[14px] outline-none hover:outline-none focus:outline-none shadow-none' placeholder="Enter your name" />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <Form.Control className='h-[54px] px-4 rounded-[24px] bg-transparent border border-solid border-[#E5E5E5] text-[12px] lg:text-[14px] outline-none hover:outline-none focus:outline-none shadow-none' placeholder="Email address" />
                                </div>
                                <div className="mb-4">
                                    <Form.Control className='px-4 py-4 rounded-[24px] bg-transparent border border-solid border-[#E5E5E5] text-[12px] lg:text-[14px] outline-none hover:outline-none focus:outline-none shadow-none !min-h-[176px]' placeholder="Write your discussion..." as="textarea" />
                                </div>
                                <div className="flex items-center justify-end gap-[12px]">
                                    <a href="#!" className='btnClass font-medium text-[14px] lg:text-[16px] border border-solid border-[#F5F5F5] bg-[#F5F5F5] text-[#A3A3A3] hover:bg-orange hover:text-white hover:border-orange'>Send Discussion</a>
                                </div>
                            </div>
                        </AnimatedSection>
                    )}

                    <div className="flex flex-wrap gap-4">
                        <AnimatedSection animation="fade-up" delay="anim-delay-100" className="w-full">
                            <ListCommentDiscussion replay={true} />
                        </AnimatedSection>
                        <AnimatedSection animation="fade-up" delay="anim-delay-200" className="w-full">
                            <ListCommentDiscussion replay={false} />
                        </AnimatedSection>
                    </div>
                    <AnimatedSection animation="fade-up" delay="anim-delay-300" className="mt-5">
                        <PaginationDetail />
                    </AnimatedSection>
                </Col>
            </Row>
        </Fragment>
    )

    return (
        <Fragment>
            {/* ── Product Detail ── */}
            <section>
                <Container>
                    <Row>
                        <Col md={6} className='mb-4 md:!my-auto'>
                            <AnimatedSection animation="fade-left">
                                <CarouselDetail />
                            </AnimatedSection>
                        </Col>
                        <Col md={6} lg={{ span: 5, offset: 1 }} className='my-auto'>
                            <AnimatedSection animation="fade-right" delay="anim-delay-100">
                                <h3 className='font-normal text-[24px] md:text-[28px] lg:text-[32px] font-Helvetica mb-3'>Winter Coat</h3>
                                <div className="flex items-center">
                                    <div className="flex items-center gap-[2px]">
                                        {[1,2,3,4,5].map(n => <StarRateIcon key={n} />)}
                                    </div>
                                    <div className='text-[12px] lg:text-[14px] ml-2'>
                                        <span className='font-semibold'>4.5</span>
                                        <span className='text-gray ml-1'>(146 reviews)</span>
                                    </div>
                                </div>
                            </AnimatedSection>

                            <AnimatedSection animation="fade-up" delay="anim-delay-200">
                                <div className="mt-6">
                                    <h3 className='font-normal text-[16px] lg:text-[18px] mb-3'>Select Size</h3>
                                    <div className="flex items-center flex-wrap sm:flex-nowrap gap-2 lg:gap-3">
                                        <div className="flex items-center flex-wrap sm:flex-nowrap gap-2 lg:gap-3">
                                            {sizeContent.map((obj) => (
                                                <div key={obj} className='w-[40px] h-[40px] rounded-full border border-solid border-[#E5E5E5] flex items-center justify-center uppercase text-[16px] lg:text-[18px]'>{obj}</div>
                                            ))}
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            <InfoIcon />
                                            <span className='text-[14px] lg:text-[16px]'>Size Guide</span>
                                        </div>
                                    </div>
                                </div>
                            </AnimatedSection>

                            <AnimatedSection animation="fade-up" delay="anim-delay-300">
                                <div className='mt-6'>
                                    <h3 className='font-normal text-[16px] lg:text-[18px] mb-3'>Select Colors</h3>
                                    <div className="flex items-center gap-3">
                                        {colorContent.map((obj) => (
                                            <div key={obj} className="px-[2px] py-[2px] rounded-full border border-solid border-white">
                                                <div className="w-[32px] h-[32px] rounded-full" style={{ backgroundColor: obj }}></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </AnimatedSection>

                            <AnimatedSection animation="fade-up" delay="anim-delay-400">
                                <div className="mt-10 flex items-center gap-3">
                                    <div className='font-medium text-[14px] lg:text-[16px] !border-[#E5E5E5] btnClass'>$124.99</div>
                                    <a href='#!' className='font-medium text-[14px] lg:text-[16px] !border-orange bg-orange text-white btnClass w-full min-w-fit lg:min-w-[277px] text-center'>Add To Cart</a>
                                </div>
                                <hr className='border-[#E5E5E5] mt-12 mb-6' />
                                <div className="flex flex-wrap gap-3 text-[16px] lg:text-[18px]">
                                    <div className="flex items-center gap-2 w-full"><img src="./../images/Group.svg" alt="" /><span>Secure Payment</span></div>
                                    <div className="flex items-center gap-2 w-full"><img src="./../images/truck-2.svg" alt="" /><span>Free Shipping</span></div>
                                    <div className="flex items-center gap-2 w-full"><img src="./../images/refresh-rotate.svg" alt="" /><span>Free Changes & Return</span></div>
                                    <div className="flex items-center gap-2 w-full"><img src="./../images/resize-window-arrow-full-screen-circle.svg" alt="" /><span>Size & Fit</span></div>
                                </div>
                            </AnimatedSection>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* ── Tabs ── */}
            <section>
                <Container>
                    <AnimatedSection animation="fade-down">
                        <div className="flex items-center gap-2 font-medium text-[14px] lg:text-[16px] border-b-[1px] border-solid border-[#E5E5E5] mb-6">
                            {["Details", "Reviews", "Discussion"].map((tab) => (
                                <div key={tab} onClick={() => settoogleTab(tab)} className={"px-2 sm:px-3 cursor-pointer relative py-2 " + (toogleTab === tab ? "text-black border-b-[1px] border-solid border-black" : "text-[#A3A3A3]")}>
                                    {tab === "Reviews" ? "Reviews (146)" : tab}
                                </div>
                            ))}
                        </div>
                    </AnimatedSection>
                    {toogleTab === "Details" ? Details() : toogleTab === "Reviews" ? Reviews() : Discussion()}
                </Container>
            </section>

            {/* ── Related Products ── */}
            <section>
                <Container>
                    <AnimatedSection animation="fade-up">
                        <h2 className='font-Helvetica font-normal text-[24px] md:text-[28px] lg:text-[32px] xl:text-[48px] mb-6'>You May Be Interested</h2>
                    </AnimatedSection>
                    <Row className='gap-y-[15px]'>
                        {relatedProducts.map((obj, i) => (
                            <Col key={obj.name + i} className='col-6 mb-4 mb-lg-0' lg={3}>
                                <AnimatedSection animation="fade-up" delay={`anim-delay-${(i + 1) * 100}`}>
                                    <CardProduct type={"small"} data={obj} />
                                </AnimatedSection>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>
        </Fragment>
    )
}

export default Detail
