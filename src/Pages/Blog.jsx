import React, { Fragment } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { CardBlog } from '../Components/Card/Card'
import { PaginationDetail } from '../Components/Pagination/Pagination'
import SideBlog from '../Components/Pages/SideBlog'
import { dataBlog } from '../data/blogs'
import AnimatedSection from '../Components/Common/AnimatedSection'

const Blog = () => {
    return (
        <Fragment>
            <section>
                <Container>
                    <Row>
                        <Col className='mb-4 lg:mb-0' lg={8}>
                            <Row>
                                {dataBlog.map((obj, i) => (
                                    <Col key={obj.title} md={6} className='mb-4'>
                                        <AnimatedSection animation="fade-up" delay={`anim-delay-${(i % 2 + 1) * 100}`}>
                                            <CardBlog data={obj} />
                                        </AnimatedSection>
                                    </Col>
                                ))}
                            </Row>
                            <AnimatedSection animation="fade-up" delay="anim-delay-300">
                                <div className="text-center mt-4">
                                    <PaginationDetail />
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

export default Blog
