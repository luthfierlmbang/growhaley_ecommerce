import React, { Fragment } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import SideBlog from '../Components/Pages/SideBlog'
import AnimatedSection from '../Components/Common/AnimatedSection'

const BlogDetail = () => {
    const sections = [
        { title: "1. Pay Attention to the Fabric", body: "Choose high-quality and comfortable fabrics that are breathable, such as cotton, linen, or rayon. Make sure that the fabric is easy to maintain and does not wrinkle easily, so that the clothing always looks neat and beautiful." },
        { title: "2. Choose a Style that Fits Your Body Shape", body: "Pay attention to your body shape when choosing Muslim clothing. Don't choose clothing that is too loose or too tight. Choose the right style that fits your body shape, such as an A-line top or a flared maxi skirt." },
        { title: "3. Pay Attention to Colors", body: "Choose colors that match your skin tone. Pastel colors and neutral colors such as white, cream, or beige always look elegant and can easily be paired with accessories or hijab." },
        { title: "4. Pay Attention to Details", body: "Choose Muslim clothing with unique and interesting details, such as lace, embroidery, or pretty ribbons. These details will make your clothing look more attractive and elegant." },
        { title: "5. Choose According to the Occasion", body: "Choose Muslim clothing that is suitable for the occasion you will attend. Don't choose clothing that is too casual for formal events, and vice versa." },
    ]

    return (
        <Fragment>
            <section>
                <Container>
                    <Row>
                        <Col className='mb-4 lg:mb-0' lg={8}>
                            {/* Hero image */}
                            <AnimatedSection animation="scale-in">
                                <img src="./../images/fsdgfsdgdgg.png" className='w-full h-[300px] lg:h-[400px] xl:h-[500px] object-cover rounded-lg' alt="" />
                            </AnimatedSection>

                            {/* Meta */}
                            <AnimatedSection animation="fade-up" delay="anim-delay-100">
                                <div className="flex items-center gap-3 my-3">
                                    <div className="font-medium text-[12px] px-4 py-[4px] border border-solid !border-[#E5E5E5] rounded-full text-black">Lifestyle</div>
                                    <span className='text-[14px] text-[#A3A3A3]'>8/2/2023 | by Zaire Dorwart</span>
                                </div>
                                <h2 className='text-[18px] lg:text-[20px] font-bold font-Helvetica mb-3'>Tips for Choosing Modest and Elegant Muslim Clothing</h2>
                                <p className='font-medium text-[16px] lg:text-[18px] mb-3'>For Muslim women, choosing modest and elegant clothing can be a challenge. However, with the right selection, Muslim clothing can also look beautiful and charming. Here are some tips for choosing the right Muslim clothing to look modest and elegant.</p>
                            </AnimatedSection>

                            {/* Article sections */}
                            {sections.map((s, i) => (
                                <AnimatedSection key={s.title} animation="fade-up" delay={`anim-delay-${(i + 1) * 100}`} className="mb-4">
                                    <h5 className='font-medium text-[14px] lg:text-[16px] mb-2'>{s.title}</h5>
                                    <p className='text-[14px] lg:text-[16px]'>{s.body}</p>
                                </AnimatedSection>
                            ))}

                            <AnimatedSection animation="fade-up" delay="anim-delay-300">
                                <p className='text-[14px] lg:text-[16px] mb-4'>Choosing the right Muslim clothing can be a challenge, but with the tips above, you can easily choose modest and elegant clothing. Choose high-quality fabrics, pay attention to the style and color, and choose clothing that is suitable for the occasion. By doing so, you can look modest and elegant on various occasions.</p>
                            </AnimatedSection>

                            {/* Share */}
                            <AnimatedSection animation="fade-up" delay="anim-delay-400">
                                <div className="flex items-center gap-2">
                                    <span className='text-[14px] lg:text-[16px] text-gray'>Share to</span>
                                    <a href="#!"><img src="./../images/sm (1).png" alt="share" /></a>
                                    <a href="#!"><img src="./../images/sm (2).png" alt="share" /></a>
                                    <a href="#!"><img src="./../images/sm (3).png" alt="share" /></a>
                                </div>
                            </AnimatedSection>
                        </Col>

                        <Col lg={4}>
                            <AnimatedSection animation="fade-left" delay="anim-delay-200">
                                <SideBlog />
                            </AnimatedSection>
                        </Col>
                    </Row>
                </Container>
            </section>
        </Fragment>
    )
}

export default BlogDetail
