import React, { Fragment } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import AnimatedSection from '../Components/Common/AnimatedSection'

const termsSections = [
    {
        title: "Services",
        body: 'Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the website (the "Service") operated by [company name]. Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users, and others who access or use the Service. By accessing or using the Service you agree to be bound by these Terms. If you disagree with any part of the terms then you may not access the Service.',
    },
    {
        title: "Accounts",
        body: "When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service. You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password, whether your password is with our Service or a third-party service. You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.",
    },
    {
        title: "Intellectual Property",
        body: "We may share your personal information with third-party service providers who help us operate our website, provide our services, and fulfill your requests. We may also share your information when required by law or when we believe that disclosure is necessary to protect our rights or the rights of others.",
    },
    {
        title: "Links To Other Web Sites",
        body: "Our Service may contain links to third-party web sites or services that are not owned or controlled by [company name]. [company name] has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third-party web sites or services. You further acknowledge and agree that [company name] shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with the use of or reliance on any such content, goods or services available on or through any such web sites or services.",
    },
    {
        title: "Changes",
        body: "We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion. Contact Us. If you have any questions about these Terms, please contact us.",
    },
]

const Terms = () => {
    return (
        <Fragment>
            <section>
                <Container>
                    <Row className='justify-center'>
                        <Col md={10}>
                            <AnimatedSection animation="fade-down">
                                <div className="text-center mb-8">
                                    <h3 className='font-Helvetica font-normal text-[24px] md:text-[28px] lg:text-[32px] mb-2'>Terms of Conditions</h3>
                                    <p className='text-[14px] lg:text-[16px] text-[#A3A3A3]'>Effective Date: <span className="text-black">November 28, 2023</span></p>
                                </div>
                            </AnimatedSection>

                            <AnimatedSection animation="fade-up" delay="anim-delay-100">
                                <h5 className='font-medium text-[16px] lg:text-[18px] mb-3'>At [Business Agency Name], we understand the importance of your privacy. This Privacy Policy outlines the type of information we collect, how we use it, and how we protect your personal information. Please read this policy carefully to understand how we collect, use, and disclose information.</h5>
                            </AnimatedSection>

                            {termsSections.map((s, i) => (
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

export default Terms
