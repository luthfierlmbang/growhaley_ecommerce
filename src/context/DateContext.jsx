import React, { createContext, useContext, useState } from 'react'

const DateContext = createContext(null)

export const DateProvider = ({ children }) => {
    const [period, setPeriod] = useState('7d') // 'today' | '7d' | '30d' | 'custom'
    const [dateRange, setDateRange] = useState({
        from: (() => { const d = new Date(); d.setDate(d.getDate() - 7); return d })(),
        to: new Date(),
    })

    const selectPeriod = (p) => {
        setPeriod(p)
        const now = new Date()
        if (p === 'today') {
            const start = new Date(now); start.setHours(0, 0, 0, 0)
            setDateRange({ from: start, to: now })
        } else if (p === '7d') {
            const start = new Date(now); start.setDate(now.getDate() - 7)
            setDateRange({ from: start, to: now })
        } else if (p === '30d') {
            const start = new Date(now); start.setDate(now.getDate() - 30)
            setDateRange({ from: start, to: now })
        }
        // 'custom' — caller sets dateRange manually via setDateRange
    }

    /**
     * filterByPeriod(items, dateField)
     * Filter an array of objects by the active period using item[dateField] as the date.
     */
    const filterByPeriod = (items, dateField = 'date') => {
        const { from, to } = dateRange
        return items.filter(item => {
            const d = new Date(item[dateField])
            return d >= from && d <= to
        })
    }

    return (
        <DateContext.Provider value={{ period, setPeriod, dateRange, setDateRange, selectPeriod, filterByPeriod }}>
            {children}
        </DateContext.Provider>
    )
}

export const useDate = () => {
    const ctx = useContext(DateContext)
    if (!ctx) throw new Error('useDate must be used within DateProvider')
    return ctx
}

export default DateContext
