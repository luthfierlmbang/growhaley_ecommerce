import React, { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Wraps page content with a fade-in on every route change.
 */
const PageTransition = ({ children }) => {
    const location = useLocation()
    const ref = useRef(null)

    useEffect(() => {
        const el = ref.current
        if (!el) return
        // Reset and replay animation on route change
        el.style.animation = 'none'
        // Force reflow
        void el.offsetHeight
        el.style.animation = ''
    }, [location.pathname])

    return (
        <div ref={ref} className="page-enter">
            {children}
        </div>
    )
}

export default PageTransition
