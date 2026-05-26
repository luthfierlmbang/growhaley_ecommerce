import React from 'react'

/**
 * Reusable round checkbox used across Cart, Checkout, Payment, Address.
 *
 * @param {string|boolean} value   - current selected value (or boolean for simple toggle)
 * @param {string|boolean} id      - the id this checkbox represents
 * @param {function} onChange      - called with id when clicked
 */
const RoundCheckbox = ({ value, id, onChange }) => {
    const isChecked = value === id || value === true
    return (
        <div
            onClick={() => onChange(id)}
            role="checkbox"
            aria-checked={isChecked}
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onChange(id) }}
            className={
                'w-[24px] h-[24px] rounded-full border border-solid flex items-center justify-center cursor-pointer ' +
                (isChecked ? 'border-orange bg-orange' : 'border-[#A3A3A3]')
            }
        >
            {isChecked && <img src="/images/check (3).svg" alt="checked" />}
        </div>
    )
}

export default RoundCheckbox
