import React from 'react'
import useInView from '../../hooks/useInView'

/**
 * Wraps children in a div that animates when it enters the viewport.
 *
 * @param {'fade-in'|'fade-up'|'fade-down'|'fade-left'|'fade-right'|'scale-in'|'slide-up'} animation
 * @param {string}  delay     - e.g. 'anim-delay-200'
 * @param {string}  className - extra classes for the wrapper
 * @param {string}  as        - HTML tag to render ('div', 'section', 'article', etc.)
 * @param {number}  threshold - IntersectionObserver threshold (0–1)
 */
const AnimatedSection = ({
    children,
    animation = 'fade-up',
    delay = '',
    className = '',
    as: Tag = 'div',
    threshold = 0.12,
}) => {
    const [ref, isVisible] = useInView(threshold)

    return (
        <Tag
            ref={ref}
            className={`anim-hidden anim-${animation} ${isVisible ? 'is-visible' : ''} ${delay} ${className}`}
        >
            {children}
        </Tag>
    )
}

export default AnimatedSection
