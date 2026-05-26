import { useEffect, useRef, useState } from 'react'

/**
 * Animates a number from 0 to `target` when the element enters the viewport.
 *
 * @param {number} target   - final number to count up to
 * @param {number} duration - animation duration in ms (default 1800)
 * @returns [ref, displayValue] — attach ref to the container element
 */
const useCountUp = (target, duration = 1800) => {
    const ref = useRef(null)
    const [count, setCount] = useState(0)
    const [started, setStarted] = useState(false)

    useEffect(() => {
        const el = ref.current
        if (!el) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !started) {
                    setStarted(true)
                    observer.unobserve(el)
                }
            },
            { threshold: 0.3 }
        )
        observer.observe(el)
        return () => observer.disconnect()
    }, [started])

    useEffect(() => {
        if (!started) return

        let startTime = null
        const step = (timestamp) => {
            if (!startTime) startTime = timestamp
            const progress = Math.min((timestamp - startTime) / duration, 1)
            // ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(Math.floor(eased * target))
            if (progress < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
    }, [started, target, duration])

    return [ref, count]
}

export default useCountUp
