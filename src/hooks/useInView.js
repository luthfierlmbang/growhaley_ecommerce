import { useEffect, useRef, useState } from 'react'

/**
 * Triggers when an element enters the viewport.
 * @param {number} threshold - 0–1, how much of the element must be visible
 * @param {string} rootMargin - IntersectionObserver rootMargin
 */
const useInView = (threshold = 0.15, rootMargin = '0px') => {
    const ref = useRef(null)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const el = ref.current
        if (!el) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                    observer.unobserve(el) // animate once
                }
            },
            { threshold, rootMargin }
        )

        observer.observe(el)
        return () => observer.disconnect()
    }, [threshold, rootMargin])

    return [ref, isVisible]
}

export default useInView
