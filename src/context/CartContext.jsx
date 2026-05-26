import React, { createContext, useContext, useState } from 'react'

const CartContext = createContext(null)

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([])
    const [orders, setOrders] = useState([])

    const addToCart = (product) => {
        setCartItems(prev => {
            const existing = prev.find(
                item => item.id === product.id &&
                    item.selectedSize === product.selectedSize &&
                    item.selectedColor === product.selectedColor
            )
            if (existing) {
                return prev.map(item =>
                    item.id === product.id &&
                    item.selectedSize === product.selectedSize &&
                    item.selectedColor === product.selectedColor
                        ? { ...item, qty: item.qty + 1 }
                        : item
                )
            }
            return [...prev, { ...product, qty: 1, cartId: Date.now() + Math.random() }]
        })
    }

    const removeFromCart = (cartId) => {
        setCartItems(prev => prev.filter(item => item.cartId !== cartId))
    }

    const updateQty = (cartId, qty) => {
        if (qty < 1) return
        setCartItems(prev =>
            prev.map(item => item.cartId === cartId ? { ...item, qty } : item)
        )
    }

    const clearCart = () => {
        setCartItems([])
    }

    const placeOrder = (orderData) => {
        setOrders(prev => [...prev, orderData])
    }

    return (
        <CartContext.Provider value={{ cartItems, orders, addToCart, removeFromCart, updateQty, clearCart, placeOrder }}>
            {children}
        </CartContext.Provider>
    )
}

export const useCart = () => {
    const ctx = useContext(CartContext)
    if (!ctx) throw new Error('useCart must be used within CartProvider')
    return ctx
}

export default CartContext
