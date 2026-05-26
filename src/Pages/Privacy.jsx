import React, { Fragment } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import AnimatedSection from '../Components/Common/AnimatedSection'

const privacySections = [
    { title: "Information We Collect", body: "We collect various types of information from you when you use our website. This may include personal information such as your name, email address, and phone number. We may also collect non-personal information such as your IP address, browser type, and operating system." },
    { title: "How We Use Your Information", body: "We may use your personal information to contact you, provide services to you, and to improve our website. We may also use your non-personal information to improve our website, monitor our website usage, and analyze trends." },
    { title: "Disclosure of Your Information", body: "We may share your personal information with third-party service providers who help us operate our website, provide our services, and fulfill your requests. We may also share your information when required by law or when we believe that disclosure is necessary to protect our rights or the rights of others." },
    { title: "Security of Your Information", body: "We take reasonable measures to protect your personal information from unauthorized access, disclosure, or misuse. However, we cannot guarantee the security of your information transmitted through the internet." },
    { title: "Children's Privacy", body: "Our website is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us and we will remove the information." },
    { title: "Changes to this Privacy Policy", body: "We may update this Privacy Policy from time to time. We will notify you of any changes by posting the updated policy on our website." },
    { title: "Contact Us", body: "If you have any questions about this Privacy Policy or our practices, please contact us at [Business Agency Contact Information]." },
]

const Privacy = () => {
    return (
        <Fragment>
            <section>
                <Container>
                    <Row className='justify-center'>
                        <Col md={10}>
                            <AnimatedSection animation="fade-down">
                                <div className="text-center mb-8">
                                    <h3 className='font-normal font-Helvetica text-[24px] md:text-[28px] text-[32px] mb-2'>Privacy Policy</h3>
                                    <p className='text-[14px] lg:text-[16px] text-[#A3A3A3]'>Effective Date: <span className="text-black">November 28, 2023</span></p>
                                </div>
                            </AnimatedSection>

                            <AnimatedSection animation="fade-up" delay="anim-delay-100">
                                <h5 className='font-medium text-[16px] lg:text-[18px] mb-3'>At [Business Agency Name], we understand the importance of your privacy. This Privacy Policy outlines the type of information we collect, how we use it, and how we protect your personal information. Please read this policy carefully to understand how we collect, use, and disclose information.</h5>
                            </AnimatedSection>

                            {privacySections.map((s, i) => (
                                <AnimatedSection key={s.title} animation="fade-up" delay={`anim-delay-${Math.min((i + 1) * 100, 500)}`} className="mb-3">
                                    <h5 className='font-medium text-[16px] lg:text-[18px] mb-2'>{s.title}</h5>
                                    <p className='text-[14px] lg:text-[16px]'>{s.body}</p>
                                </AnimatedSection>
                            ))}
                        </Col>
                    </Row>
                </Container>
            </section>
        </Fragment>
    )
}

export default Privacy
